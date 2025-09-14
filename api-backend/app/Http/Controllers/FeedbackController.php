<?php

namespace App\Http\Controllers;

use App\Services\FeedbackService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FeedbackController extends Controller
{
    protected $feedbackService;

    public function __construct(FeedbackService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
    }

    /**
     * Store a newly created feedback
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|uuid|exists:customers,id',
            'branch_id' => 'required|uuid|exists:branches,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'rating' => 'required|integer|between:1,5',
            'status' => ['sometimes', Rule::in(['open', 'in_progress', 'closed'])]
        ], [
            'customer_id.uuid' => 'Customer ID must be a valid UUID',
            'customer_id.exists' => 'Customer does not exist',
            'branch_id.uuid' => 'Branch ID must be a valid UUID',
            'branch_id.exists' => 'Branch does not exist',
            'rating.between' => 'Rating must be between 1 and 5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $feedback = $this->feedbackService->createFeedback($validator->validated());
            
            return response()->json([
                'message' => 'Feedback created successfully',
                'data' => $feedback
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create feedback',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get feedback by customer ID
     */
    public function getByCustomerId(string $customerId): JsonResponse
    {
        $validator = Validator::make(['customer_id' => $customerId], [
            'customer_id' => 'required|uuid|exists:customers,id'
        ], [
            'customer_id.uuid' => 'Customer ID must be a valid UUID',
            'customer_id.exists' => 'Customer does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $feedbacks = $this->feedbackService->getFeedbackByCustomerId($customerId);
            
            return response()->json([
                'message' => 'Feedbacks retrieved successfully',
                'data' => $feedbacks
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve feedbacks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get feedback by branch ID
     */
    public function getByBranchId(string $branchId): JsonResponse
    {
        $validator = Validator::make(['branch_id' => $branchId], [
            'branch_id' => 'required|uuid|exists:branches,id'
        ], [
            'branch_id.uuid' => 'Branch ID must be a valid UUID',
            'branch_id.exists' => 'Branch does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $feedbacks = $this->feedbackService->getFeedbackByBranchId($branchId);
            
            return response()->json([
                'message' => 'Feedbacks retrieved successfully',
                'data' => $feedbacks
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve feedbacks',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}