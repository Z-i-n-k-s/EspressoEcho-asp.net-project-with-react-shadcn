<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\InventoryController;

// -------------------------
// Test Routes
// -------------------------
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

// -------------------------
// Branch Routes
// -------------------------
Route::prefix('branches')->group(function () {
    Route::get('/', [BranchController::class, 'index']);          // List all branches
    Route::post('/', [BranchController::class, 'store']);         // Create new branch
    Route::get('/{id}', [BranchController::class, 'show']);       // Get a single branch by ID
    Route::put('/{id}', [BranchController::class, 'update']);     // Full update of a branch
    Route::patch('/{id}', [BranchController::class, 'update']);   // Partial update of a branch
    Route::delete('/{id}', [BranchController::class, 'destroy']); // Soft delete a branch
    Route::post('/{id}/restore', [BranchController::class, 'restore']); // Restore a soft-deleted branch
    Route::get('/{branchId}/categories', [CategoryController::class, 'getByBranch']);
    Route::get('/{branchId}/inventory', [InventoryController::class, 'getInventory']);
});

