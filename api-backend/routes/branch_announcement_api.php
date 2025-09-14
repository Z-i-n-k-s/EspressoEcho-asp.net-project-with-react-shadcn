<?php

// routes/api.php
use App\Http\Controllers\BranchAnnouncementController;
use Illuminate\Support\Facades\Route;

// Branch Announcement Routes
Route::prefix('branch-announcements')->group(function () {
    // Standard CRUD routes
    Route::get('/', [BranchAnnouncementController::class, 'index']);
    Route::post('/', [BranchAnnouncementController::class, 'store']);
    Route::get('/{id}', [BranchAnnouncementController::class, 'show']);
    Route::put('/{id}', [BranchAnnouncementController::class, 'update']);
    Route::delete('/{id}', [BranchAnnouncementController::class, 'destroy']);

    // Additional custom routes
    Route::get('/branch/{branchId}', [BranchAnnouncementController::class, 'getByBranch']);
    Route::post('/bulk/status', [BranchAnnouncementController::class, 'bulkUpdate']);
});
