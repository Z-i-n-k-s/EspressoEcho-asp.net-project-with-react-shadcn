<?php

use App\Http\Controllers\FeedbackReplyController;
use Illuminate\Support\Facades\Route;

Route::prefix('feedback-replies')->group(function () {
    Route::get('/feedback/{feedbackId}', [FeedbackReplyController::class, 'index']);
    Route::post('/', [FeedbackReplyController::class, 'store']);
    Route::get('/{id}', [FeedbackReplyController::class, 'show']);
    Route::put('/{id}', [FeedbackReplyController::class, 'update']);
    Route::delete('/{id}', [FeedbackReplyController::class, 'destroy']);
    Route::get('/role/{role}', [FeedbackReplyController::class, 'getByRole']);
    Route::get('/responder/{responderId}', [FeedbackReplyController::class, 'getByResponder']);
});