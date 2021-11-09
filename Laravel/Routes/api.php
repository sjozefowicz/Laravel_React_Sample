<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group([
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'login'])
        ->name('login');

    Route::post('register', [AuthController::class, 'register'])
        ->name('register');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::post('logout', [AuthController::class, 'logout'])
            ->name('logout');

        Route::post('refresh', [AuthController::class, 'refresh'])
            ->name('refresh');

        Route::post('user-profile', [AuthController::class, 'userProfile'])
            ->name('userProfile');

        Route::post('set-password', [AuthController::class, 'setNewPassword'])
            ->name('setNewPassword');
    });
});

Route::group([
    'prefix' => 'book',
    'as' => 'book.'
], function () {
    Route::post('show/{id}', [BookController::class, 'show'])
        ->name('show');

    Route::post('/{type?}', [BookController::class, 'index'])
        ->name('list');
});

Route::middleware('auth:api')->group(function () {
    Route::group([
        'middleware' => 'role:admin|librarian|user'
    ], function () {
        Route::group([
            'prefix' => 'book',
            'as' => 'book.'
        ], function () {
            Route::middleware('role:admin|librarian')->group(function () {
                Route::post('import', [BookController::class, 'store'])
                    ->name('import');

                Route::delete('remove/{id}', [BookController::class, 'delete'])
                    ->name('remove');

                Route::put('update/{id}', [BookController::class, 'update'])
                    ->name('update');
            });
        });

        Route::group([
            'prefix' => 'user',
            'as' => 'user.'
        ], function () {
            Route::middleware('role:admin')->group(function () {
                Route::post('store', [UserController::class, 'store'])
                    ->name('store');

                Route::delete('remove/{id}', [UserController::class, 'delete'])
                    ->name('remove');
            });

            Route::middleware('role:admin|librarian')->group(function () {
                Route::get('/', [UserController::class, 'index'])
                    ->name('list');

                Route::get('/{role}', [UserController::class, 'index'])
                    ->name('role.list');

                Route::get('librarian/{branch_id}', [UserController::class, 'index'])
                    ->name('librarian.list');
            });

            Route::put('update/{id}', [UserController::class, 'update'])
                ->name('update');

            Route::get('show/{id}', [UserController::class, 'show'])
                ->name('show');
        });
    });
});
