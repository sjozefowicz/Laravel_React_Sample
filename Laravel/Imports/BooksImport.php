<?php

namespace App\Imports;

use App\Models\Book;
use App\Models\Branch;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Maatwebsite\Excel\Concerns\RemembersChunkOffset;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithUpserts;

class BooksImport implements ToModel, WithChunkReading, WithBatchInserts, WithUpserts
{
    use RemembersChunkOffset;

    private string|int $librarianBranch;

    public function __construct(string|int $librarianBranch)
    {
        $this->librarianBranch = $librarianBranch;
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        if ($row[1] === 'isbn') return null;

        $categories = explode('|', $row[3]);
        $book_category_ids = [];

        preg_match_all('!\d+!', $row[8], $matches);

        $branch_id = $matches[0][0];

        foreach ($categories as $item) {
            $category = Category::where('name', $item)->first();
            if (is_null($category)) {
                $category = Category::create(['name' => $item]);
            }
            $book_category_ids[] = $category->id;
        }

        if (!Branch::where('branch_slug', $branch_id)->first()) {
            Branch::create(['branch_slug' => $branch_id]);
        }

        if (is_integer($this->librarianBranch)) {
            if ($this->librarianBranch == $branch_id) {
                $book = $this->createBook($row, $branch_id);
            } else {
                Cache::has('missedBooks')
                    ? Cache::increment('missedBooks')
                    : Cache::put('missedBooks', 1);
                return null;
            }
        } else {
            $book = $this->createBook($row, $branch_id);
        }

        if ($book->wasRecentlyCreated) $book->categories()->attach($book_category_ids);

        return $book;
    }

    private function createBook($row, $branch_id): Book
    {
        return Book::firstOrCreate(['isbn' => $row[1]],[
            'title' => $row[0],
            'isbn' => $row[1],
            'language' => $row[2],
            'publication_date' => $row[4],
            'description' => $row[5],
            'publisher' => $row[6],
            'pages_num' => $row[7],
            'branch_slug' => $branch_id,
        ]);
    }

    public function chunkSize(): int
    {
        return 1000;
    }

    public function batchSize(): int
    {
        return 1000;
    }

    public function uniqueBy()
    {
        return 'isbn';
    }
}
