<?php

namespace App\Jobs;

use App\Imports\BooksImport;
use App\Models\User;
use App\Services\BookService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Maatwebsite\Excel\Facades\Excel as Excel;

class ImportBooksJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;
    public int $timeout = 1200;
    private string|int $librarianBranch;
    private User $user;
    private string $file;
    private BookService $bookService;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(string $file, User $user, BookService $bookService)
    {
        $this->file = $file;
        $this->user = $user;
        $this->bookService = $bookService;
        ($user->hasRole('librarian')) ? $this->librarianBranch = $user->branch_id : $this->librarianBranch = 'all';
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            Redis::throttle('import_csv')->allow(1)->every(5)->then(function () {
                Excel::import(new BooksImport($this->librarianBranch), $this->file);
            }, function () {
                $this->release(5);
            });
            $this->bookService->mailAfterImport([
                'status' => 'accomplished',
                'message' => 'books imported',
                'email' => $this->user->email,
                'missedBooks' => Cache::pull('missedBooks')
            ]);
            $this->bookService->createImport($this->file, $this->user->id);
        } catch (\Exception $exception) {
            $this->bookService->mailAfterImport([
                'status' => 'failure',
                'message' => $exception->getMessage(),
                'email' => $this->user->email,
                'missedBooks' => 0]);
            $this->fail($exception);
        }
    }
}
