<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminSalesController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BranchController;
use App\Http\Controllers\EmployeeController;

use App\Http\Controllers\PromotionController;

// Dashboard routes
Route::get('/dashboard', [AdminDashboardController::class, 'getDashboardData']);

// Branch routes
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/branches/{id}', [BranchController::class, 'show']);

// Employee routes
Route::get('/employees', [EmployeeController::class, 'index']);
Route::get('/employees/{id}', [EmployeeController::class, 'show']);

// Sales routes
Route::get('/sales', [AdminSalesController::class, 'getSalesData']);

// Promotion routes
Route::get('/promotions', [PromotionController::class, 'index']);
Route::get('/promotions/active', [PromotionController::class, 'activePromotions']);
Route::get('/promotions/{id}', [PromotionController::class, 'show']);