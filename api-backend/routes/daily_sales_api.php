<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DailySalesReportController;
use App\Http\Middleware\AuthMiddleware;

// Daily sales report routes
Route::middleware(AuthMiddleware::class)->group(function () {
    Route::get('/manager/daily-sales-report', [DailySalesReportController::class, 'getDailySalesReport']);
});