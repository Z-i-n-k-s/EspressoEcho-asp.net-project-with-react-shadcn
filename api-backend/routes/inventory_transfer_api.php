<?php

use App\Http\Controllers\InventoryTransferController;
use Illuminate\Support\Facades\Route;


Route::prefix('inventory-transfers')->group(function () {
    Route::post('/request', [InventoryTransferController::class, 'requestTransfer']);
    Route::post('/{transferId}/approve', [InventoryTransferController::class, 'approveTransfer']);
    Route::post('/{transferId}/reject', [InventoryTransferController::class, 'rejectTransfer']);
    Route::post('/{transferId}/complete', [InventoryTransferController::class, 'completeTransfer']);
    Route::get('/{transferId}', [InventoryTransferController::class, 'getTransfer']);
    Route::get('/', [InventoryTransferController::class, 'listTransfers']);
});