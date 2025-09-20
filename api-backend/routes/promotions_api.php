<?php

use App\Http\Controllers\PromotionController;
use Illuminate\Support\Facades\Route;

Route::prefix('promotions')->group(function () {
    Route::get('/', [PromotionController::class, 'index']);
    Route::post('/', [PromotionController::class, 'store']);
    Route::get('/{id}', [PromotionController::class, 'show']);
    Route::put('/{id}', [PromotionController::class, 'update']);
    Route::delete('/{id}', [PromotionController::class, 'destroy']);
    Route::get('/active', [PromotionController::class, 'activePromotions']);
    Route::post('/{id}/restore', [PromotionController::class, 'restore']);
    Route::delete('/{id}/force', [PromotionController::class, 'forceDelete']);
});