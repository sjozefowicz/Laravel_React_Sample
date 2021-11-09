<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookRequest;
use App\Http\Requests\BookUpdateRequest;
use App\Models\Book;
use App\Repository\BookRepository\BookInterface;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookController extends Controller
{
    private BookInterface $bookRepository;

    public function __construct(BookInterface $bookRepository) {
        $this->bookRepository = $bookRepository;
    }

    /**
     * @param Request $request
     * @param string|null $type
     * @return JsonResponse
     */
    public function index(Request $request, ?string $type = null): JsonResponse
    {
        if ($type === 'filter') {
            $bookList = $this->bookRepository->filterBy($request, $request->search ?? '');
        } else {
            $bookList = $this->bookRepository->allPaginated($request->per ?? 25);
        }

        return $this->jsonResponse($bookList);
    }

    /**
     * @param BookRequest $request
     * @return JsonResponse
     */
    public function store(BookRequest $request): JsonResponse
    {
        $filePath = $request->validated()['file']->store('imports');

        $bookService = new BookService();

        $bookService->importFile($filePath);

        return $this->jsonResponse(['message' => 'Books are importing']);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        return $this->jsonResponse($this->bookRepository->get($id));
    }

    /**
     * @param BookUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(BookUpdateRequest $request, int $id): JsonResponse
    {
        return $this->jsonResponse($this->bookRepository->update($id, $request->validated()));
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function delete(int $id): JsonResponse
    {
        return $this->jsonResponse($this->bookRepository->delete($id));
    }
}
