<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Orders group
Route::prefix('orders')->group(function () {
    Route::apiResource('', OrderController::class);

    // Status & delivery
    Route::patch('{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('{id}/assign-delivery', [OrderController::class, 'assignDelivery']);

    // Cancellation flows
    Route::post('{id}/cancel', [OrderController::class, 'cancelOrder']);              // Generic
    Route::post('{id}/customer-cancel', [OrderController::class, 'customerCancelOrder']); // Customer-specific
    Route::post('{id}/cashier-cancel', [OrderController::class, 'cashierCancelOrder']);   // Cashier-specific
    Route::get('{id}/cancellation-eligibility', [OrderController::class, 'checkCancellationEligibility']);
});

// Customers group
Route::prefix('customers')->group(function () {
    Route::get('{customerId}/orders', [OrderController::class, 'customerOrderHistory']);
});
