<?php

namespace App\Services;

use App\Models\Feedback;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FeedbackService
{
    /**
     * Create a new feedback
     */
    public function createFeedback(array $data): Feedback
    {
        return DB::transaction(function () use ($data) {
            try {
                $feedback = Feedback::create([
                    'customer_id' => $data['customer_id'],
                    'branch_id' => $data['branch_id'],
                    'subject' => $data['subject'],
                    'message' => $data['message'],
                    'rating' => $data['rating'],
                    'status' => $data['status'] ?? 'open'
                ]);

                // Log the feedback creation
                Log::info('Feedback created successfully', [
                    'feedback_id' => $feedback->id,
                    'customer_id' => $data['customer_id'],
                    'branch_id' => $data['branch_id']
                ]);

                return $feedback->load(['customer', 'branch']);
            } catch (\Exception $e) {
                Log::error('Failed to create feedback', [
                    'error' => $e->getMessage(),
                    'data' => $data
                ]);
                
                throw new \Exception('Failed to create feedback: ' . $e->getMessage());
            }
        });
    }

    /**
     * Get feedback by customer ID
     */
    public function getFeedbackByCustomerId(string $customerId)
    {
        return DB::transaction(function () use ($customerId) {
            try {
                return Feedback::with(['customer', 'branch', 'replies'])
                    ->where('customer_id', $customerId)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve feedbacks by customer ID', [
                    'error' => $e->getMessage(),
                    'customer_id' => $customerId
                ]);
                
                throw new \Exception('Failed to retrieve feedbacks: ' . $e->getMessage());
            }
        }, 3); // Retry transaction up to 3 times
    }

    /**
     * Get feedback by branch ID
     */
    public function getFeedbackByBranchId(string $branchId)
    {
        return DB::transaction(function () use ($branchId) {
            try {
                return Feedback::with(['customer', 'branch', 'replies'])
                    ->where('branch_id', $branchId)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve feedbacks by branch ID', [
                    'error' => $e->getMessage(),
                    'branch_id' => $branchId
                ]);
                
                throw new \Exception('Failed to retrieve feedbacks: ' . $e->getMessage());
            }
        }, 3); // Retry transaction up to 3 times
    }
}