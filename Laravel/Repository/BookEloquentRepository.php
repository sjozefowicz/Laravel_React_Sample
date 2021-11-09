<?php

namespace App\Repository\BookRepository;

use App\Models\Book;
use App\Repository\BaseRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class BookEloquentRepository extends BaseRepository implements BookInterface
{
    /**
     * @param Book $bookModel
     */
    public function __construct(Book $bookModel)
    {
        parent::__construct($bookModel);
    }

    /**
     * @param int $limit
     * @return LengthAwarePaginator
     */
    public function allPaginated(int $limit): LengthAwarePaginator
    {
        return $this->model
            ->orderBy('title')
            ->paginate($limit);
    }

    /**
     * @param Request $request
     * @param string|null $phrase
     * @return LengthAwarePaginator
     */
    public function filterBy(Request $request, ?string $phrase): LengthAwarePaginator
    {
        $query = QueryBuilder::for(Book::class)->with('categories');
            if ($phrase) {
                $query->whereNested(function($query) use ($phrase) {
                    $query->whereRaw('title like ?', ["%$phrase%"]);
                    $query->orWhereRaw('description like ?', ["%$phrase%"]);
                    $query->orWhereRaw('isbn like ?', ["%$phrase%"]);
                    $query->orWhereRaw('publisher like ?', ["%$phrase%"]);
                });
            }
            $query->allowedFilters([
                AllowedFilter::scope('category'),
                AllowedFilter::exact('branch_slug'),
                AllowedFilter::custom('publisher', new FilterPublishers),
            ])
            ->orderBy('title');

        return $query->paginate($request->per ?? 25);
    }

    /**
     * @param int $id
     * @param array $data
     * @return bool|JsonResponse
     */
    public function update(int $id, array $data): bool|JsonResponse
    {
        $user = auth()->user();
        if ($book = $this->model->find($id)) {
            if ($user->hasRole('librarian') && $user->branch_id != $book->branch_slug) {
                return response()->json(['message' => 'You cannot update book witch is not in your branch']);
            }
            return $book->update($data);
        }

        return response()->json(['message' => 'Record with id ' . $id . ' not found']);
    }

    /**
     * @param int $id
     * @return bool|JsonResponse
     */
    public function delete(int $id): bool|JsonResponse
    {
        $user = auth()->user();
        if ($book = $this->model->find($id)) {
            if ($user->hasRole('librarian') && $user->branch_id != $book->branch_slug) {
                return response()->json(['message' => 'You cannot delete book witch is not in your branch']);
            }
            $book->categories()->detach();
            return $book->delete();
        }

        return response()->json(['message' => 'Record with id ' . $id . ' not found']);
    }
}
