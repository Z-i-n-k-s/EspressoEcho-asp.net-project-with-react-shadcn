<?php

use App\Http\Controllers\ProductReviewController;
use Illuminate\Support\Facades\Route;

Route::prefix('product-reviews')->group(function () {
    Route::get('/product/{productId}', [ProductReviewController::class, 'indexByProduct']);
    Route::get('/customer/{customerId}', [ProductReviewController::class, 'indexByCustomer']);
    Route::post('/', [ProductReviewController::class, 'store']);
    Route::get('/{id}', [ProductReviewController::class, 'show']);
    Route::put('/{id}', [ProductReviewController::class, 'update']);
    Route::delete('/{id}', [ProductReviewController::class, 'destroy']);
    Route::get('/rating/{rating}', [ProductReviewController::class, 'getByRating']);
    Route::get('/high-rated', [ProductReviewController::class, 'getHighRated']);
    Route::get('/low-rated', [ProductReviewController::class, 'getLowRated']);
});