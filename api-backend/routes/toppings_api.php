<?php

use App\Http\Controllers\ToppingController;
use Illuminate\Support\Facades\Route;

// Toppings API routes
Route::prefix('toppings')->group(function () {
    Route::get('/', [ToppingController::class, 'index']);
    Route::post('/', [ToppingController::class, 'store']);
    Route::get('/{id}', [ToppingController::class, 'show']);
    Route::put('/{id}', [ToppingController::class, 'update']);
    Route::delete('/{id}', [ToppingController::class, 'destroy']);
    
    // Product assignment routes
    Route::post('/{topping}/assign-to-product/{product}', [ToppingController::class, 'assignToProduct']);
    Route::delete('/{topping}/remove-from-product/{product}', [ToppingController::class, 'removeFromProduct']);
    
    // Optional: Get toppings by product
    Route::get('/by-product/{productId}', [ToppingController::class, 'getToppingsByProduct']);
});