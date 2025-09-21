<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Orders group
Route::prefix('orders')->group(function () {
    // Basic CRUD operations
    Route::get('', [OrderController::class, 'index']); // List orders with filters
    Route::post('', [OrderController::class, 'store']); // Create new order
    Route::get('{id}', [OrderController::class, 'show']); // Get order details
    
    // Status & delivery management
    Route::patch('{id}/status', [OrderController::class, 'updateStatus']); // Update order status
    Route::post('{id}/assign-delivery', [OrderController::class, 'assignDelivery']); // Assign delivery staff
    
    // Cancellation flows
    Route::post('{id}/cancel', [OrderController::class, 'cancelOrder']); // Generic cancellation
    Route::post('{id}/customer-cancel', [OrderController::class, 'customerCancelOrder']); // Customer cancellation
    Route::post('{id}/cashier-cancel', [OrderController::class, 'cashierCancelOrder']); // Cashier cancellation
    Route::get('{id}/cancellation-eligibility', [OrderController::class, 'checkCancellationEligibility']); // Check cancellation eligibility
});

// Customer-specific routes
Route::prefix('customers')->group(function () {
    Route::get('{customerId}/orders', [OrderController::class, 'customerOrderHistory']); // Get customer order history
});