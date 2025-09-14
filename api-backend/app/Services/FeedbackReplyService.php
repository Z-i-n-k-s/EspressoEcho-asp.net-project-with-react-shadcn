<?php

namespace App\Services;

use App\Models\FeedbackReply;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FeedbackReplyService
{
    /**
     * Get all replies for a specific feedback
     */
    public function getRepliesByFeedbackId(string $feedbackId)
    {
        return DB::transaction(function () use ($feedbackId) {
            try {
                return FeedbackReply::with(['feedback', 'responder'])
                    ->where('feedback_id', $feedbackId)
                    ->orderBy('replied_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve replies by feedback ID', [
                    'error' => $e->getMessage(),
                    'feedback_id' => $feedbackId
                ]);
                
                throw new \Exception('Failed to retrieve replies: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Create a new reply
     */
    public function createReply(array $data): FeedbackReply
    {
        return DB::transaction(function () use ($data) {
            try {
                $reply = FeedbackReply::create([
                    'feedback_id' => $data['feedback_id'],
                    'responder_id' => $data['responder_id'],
                    'responder_role' => $data['responder_role'],
                    'message' => $data['message'],
                    'replied_at' => $data['replied_at'] ?? now()
                ]);

                Log::info('Feedback reply created successfully', [
                    'reply_id' => $reply->id,
                    'feedback_id' => $data['feedback_id'],
                    'responder_id' => $data['responder_id']
                ]);

                return $reply->load(['feedback', 'responder']);
            } catch (\Exception $e) {
                Log::error('Failed to create feedback reply', [
                    'error' => $e->getMessage(),
                    'data' => $data
                ]);
                
                throw new \Exception('Failed to create reply: ' . $e->getMessage());
            }
        });
    }

    /**
     * Get a specific reply by ID
     */
    public function getReplyById(string $id): FeedbackReply
    {
        return DB::transaction(function () use ($id) {
            try {
                $reply = FeedbackReply::with(['feedback', 'responder'])->findOrFail($id);
                return $reply;
            } catch (\Exception $e) {
                Log::error('Failed to retrieve feedback reply', [
                    'error' => $e->getMessage(),
                    'reply_id' => $id
                ]);
                
                throw new \Exception('Failed to retrieve reply: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Update a reply
     */
    public function updateReply(string $id, array $data): FeedbackReply
    {
        return DB::transaction(function () use ($id, $data) {
            try {
                $reply = FeedbackReply::findOrFail($id);
                $reply->update($data);

                Log::info('Feedback reply updated successfully', [
                    'reply_id' => $id,
                    'updated_data' => $data
                ]);

                return $reply->fresh()->load(['feedback', 'responder']);
            } catch (\Exception $e) {
                Log::error('Failed to update feedback reply', [
                    'error' => $e->getMessage(),
                    'reply_id' => $id,
                    'data' => $data
                ]);
                
                throw new \Exception('Failed to update reply: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Delete a reply
     */
    public function deleteReply(string $id): void
    {
        DB::transaction(function () use ($id) {
            try {
                $reply = FeedbackReply::findOrFail($id);
                $reply->delete();

                Log::info('Feedback reply deleted successfully', [
                    'reply_id' => $id
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to delete feedback reply', [
                    'error' => $e->getMessage(),
                    'reply_id' => $id
                ]);
                
                throw new \Exception('Failed to delete reply: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Get replies by responder role
     */
    public function getRepliesByRole(string $role)
    {
        return DB::transaction(function () use ($role) {
            try {
                return FeedbackReply::with(['feedback', 'responder'])
                    ->where('responder_role', $role)
                    ->orderBy('replied_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve replies by role', [
                    'error' => $e->getMessage(),
                    'role' => $role
                ]);
                
                throw new \Exception('Failed to retrieve replies: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Get replies by responder ID
     */
    public function getRepliesByResponder(string $responderId)
    {
        return DB::transaction(function () use ($responderId) {
            try {
                return FeedbackReply::with(['feedback', 'responder'])
                    ->where('responder_id', $responderId)
                    ->orderBy('replied_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve replies by responder', [
                    'error' => $e->getMessage(),
                    'responder_id' => $responderId
                ]);
                
                throw new \Exception('Failed to retrieve replies: ' . $e->getMessage());
            }
        }, 3);
    }
}