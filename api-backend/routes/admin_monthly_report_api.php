<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminMonthlyReportController;
use App\Http\Middleware\AuthMiddleware;

// Admin monthly report routes
Route::middleware(AuthMiddleware::class)->group(function () {
    Route::get('/admin/monthly-report', [AdminMonthlyReportController::class, 'getMonthlyReport']);
});