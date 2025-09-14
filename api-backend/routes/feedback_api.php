<?php

use App\Http\Controllers\FeedbackController;
use Illuminate\Support\Facades\Route;

Route::prefix('feedback')->group(function () {
    Route::post('/', [FeedbackController::class, 'store']);
    Route::get('/customer/{customerId}', [FeedbackController::class, 'getByCustomerId']);
    Route::get('/branch/{branchId}', [FeedbackController::class, 'getByBranchId']);
});