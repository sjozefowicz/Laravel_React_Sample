<?php

namespace App\Services;

use App\Jobs\ImportBooksJob;
use App\Mail\ImportStatus;
use App\Models\Book;
use App\Models\Category;
use App\Models\Import;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class BookService
{
    /**
     * @param string $path
     */
    public function importFile(string $path): void
    {
        $user = auth()->user();
        ImportBooksJob::dispatch($path, $user, $this);
    }

    /**
     * @param string $path
     * @param int $userId
     */
    public function createImport(string $path, int $userId): void
    {
        Import::create([
            'path' => $path,
            'user_id' => $userId,
            'import_date' => Carbon::now()
        ]);
    }

    /**
     * @param array $data
     */
    public function mailAfterImport(array $data): void
    {
        Mail::to($data['email'])->send(new ImportStatus($data['status'], $data['missedBooks'], $data['message']));
    }

    /**
     * @return JsonResponse
     */
    public function categoriesList(): JsonResponse
    {
        $categories = Category::all();
        return response()->json($categories);
    }

    /**
     * @return JsonResponse
     */
    public function publishersList(): JsonResponse
    {
        $publishers = array_unique(array_merge_recursive(...Book::select('publisher')->get()->toArray())['publisher']);
        return response()->json($publishers);
    }
}
