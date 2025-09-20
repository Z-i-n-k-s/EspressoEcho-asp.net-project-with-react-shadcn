<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;

// -------------------------
// Test Routes
// -------------------------
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

// Category resource routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('branches/{id}', [CategoryController::class, 'getByBranch']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
    Route::post('/{id}/branches', [CategoryController::class, 'manageBranchAssignment']);
});
