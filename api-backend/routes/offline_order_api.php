
<?php

use App\Http\Controllers\OfflineOrderController;
use Illuminate\Support\Facades\Route;

// Offline Order Routes without middleware, with more specific prefix
Route::prefix('pos/orders')->group(function () {
    // Get all offline orders with optional filtering
    Route::get('/', [OfflineOrderController::class, 'index']);
    
    // Create a new offline order
    Route::post('/', [OfflineOrderController::class, 'store']);
    
    // Get orders by cashier ID
    Route::get('/cashier/{cashierId}', [OfflineOrderController::class, 'getByCashierId']);
});