<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AuthMiddleware;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/token/refresh', [AuthController::class, 'refreshToken']);
Route::middleware([AuthMiddleware::class])->get('/me', [AuthController::class, 'currentUser']);

// Protected routes (require valid JWT access token)
Route::post('/logout', [AuthController::class, 'logout'])->middleware(AuthMiddleware::class);
