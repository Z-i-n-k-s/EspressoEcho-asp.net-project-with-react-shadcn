<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AuthMiddleware;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/token/refresh', [AuthController::class, 'refreshToken']);

// Protected routes (require valid JWT access token)
Route::post('/logout', [AuthController::class, 'logout'])->middleware(AuthMiddleware::class);
