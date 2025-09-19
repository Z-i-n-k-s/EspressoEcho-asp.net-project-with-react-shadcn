<?php

namespace App\Http\Controllers;

use App\Services\FeedbackReplyService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FeedbackReplyController extends Controller
{
    protected $feedbackReplyService;
     use AuthIdentity;

    public function __construct(FeedbackReplyService $feedbackReplyService)
    {
        $this->feedbackReplyService = $feedbackReplyService;
    }

    /**
     * Get all replies for a specific feedback
     */
    public function index(string $feedbackId): JsonResponse
    {
        $validator = Validator::make(['feedback_id' => $feedbackId], [
            'feedback_id' => 'required|uuid|exists:feedbacks,id'
        ], [
            'feedback_id.uuid' => 'Feedback ID must be a valid UUID',
            'feedback_id.exists' => 'Feedback does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $replies = $this->feedbackReplyService->getRepliesByFeedbackId($feedbackId);
            
            return response()->json([
                'message' => 'Replies retrieved successfully',
                'data' => $replies
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve replies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new reply
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'feedback_id' => 'required|uuid|exists:feedbacks,id',
            'responder_id' => 'required|uuid|exists:users,id', // user ID passed
            'responder_role' => ['required', Rule::in(['admin'])],
            'message' => 'required|string',
            'replied_at' => 'sometimes|date'
        ], [
            'feedback_id.uuid' => 'Feedback ID must be a valid UUID',
            'feedback_id.exists' => 'Feedback does not exist',
            'responder_id.uuid' => 'Responder ID must be a valid UUID',
            'responder_id.exists' => 'User does not exist',
            'responder_role.in' => 'Responder role must be admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Verify admin ID
        $adminId = $this->adminId($validated['responder_id']);
        if (!$adminId) {
            return response()->json([
                'message' => 'Unauthorized: Only an admin can create replies.'
            ], 403);
        }

        // Replace the user ID with the actual admin ID if needed
        $validated['responder_id'] = $adminId;

        try {
            $reply = $this->feedbackReplyService->createReply($validated);

            return response()->json([
                'message' => 'Reply created successfully',
                'data' => $reply
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific reply
     */
    public function show(string $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|uuid|exists:feedback_replies,id'
        ], [
            'id.uuid' => 'Reply ID must be a valid UUID',
            'id.exists' => 'Reply does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reply = $this->feedbackReplyService->getReplyById($id);
            
            return response()->json([
                'message' => 'Reply retrieved successfully',
                'data' => $reply
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a reply
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|uuid|exists:feedback_replies,id',
            'message' => 'required|string',
            'responder_role' => ['sometimes', Rule::in(['admin', 'manager'])]
        ], [
            'id.uuid' => 'Reply ID must be a valid UUID',
            'id.exists' => 'Reply does not exist',
            'responder_role.in' => 'Responder role must be either admin or manager'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reply = $this->feedbackReplyService->updateReply($id, $validator->validated());
            
            return response()->json([
                'message' => 'Reply updated successfully',
                'data' => $reply
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a reply
     */
    public function destroy(string $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|uuid|exists:feedback_replies,id'
        ], [
            'id.uuid' => 'Reply ID must be a valid UUID',
            'id.exists' => 'Reply does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->feedbackReplyService->deleteReply($id);
            
            return response()->json([
                'message' => 'Reply deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete reply',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get replies by responder role
     */
    public function getByRole(string $role): JsonResponse
    {
        $validator = Validator::make(['role' => $role], [
            'role' => ['required', Rule::in(['admin', 'manager'])]
        ], [
            'role.in' => 'Role must be either admin or manager'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $replies = $this->feedbackReplyService->getRepliesByRole($role);
            
            return response()->json([
                'message' => 'Replies retrieved successfully',
                'data' => $replies
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve replies',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get replies by responder ID
     */
    public function getByResponder(string $responderId): JsonResponse
    {
        $validator = Validator::make(['responder_id' => $responderId], [
            'responder_id' => 'required|uuid|exists:users,id'
        ], [
            'responder_id.uuid' => 'Responder ID must be a valid UUID',
            'responder_id.exists' => 'User does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $replies = $this->feedbackReplyService->getRepliesByResponder($responderId);
            
            return response()->json([
                'message' => 'Replies retrieved successfully',
                'data' => $replies
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve replies',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}