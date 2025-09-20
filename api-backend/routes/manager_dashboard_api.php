<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Middleware\AuthMiddleware;

// Manager dashboard routes
Route::middleware(AuthMiddleware::class)->group(function () {
    Route::get('/manager/dashboard', [ManagerDashboardController::class, 'getManagerDashboardData']);
});