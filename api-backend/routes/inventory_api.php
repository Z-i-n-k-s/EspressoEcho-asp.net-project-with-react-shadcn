<?php

use App\Http\Controllers\InventoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('inventory')->group(function () {
    Route::post('/adjust', [InventoryController::class, 'adjustInventory']);
    Route::post('/bulk-update', [InventoryController::class, 'bulkUpdate']);
    
});