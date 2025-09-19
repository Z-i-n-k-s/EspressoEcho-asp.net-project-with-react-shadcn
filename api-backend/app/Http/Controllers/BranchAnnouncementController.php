<?php

// app/Http/Controllers/BranchAnnouncementController.php
namespace App\Http\Controllers;

use App\Models\BranchAnnouncement;
use App\Services\BranchAnnouncementService;
use App\Traits\AuthIdentity;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BranchAnnouncementController extends Controller
{
    protected $branchAnnouncementService;
    use AuthIdentity;

    public function __construct(BranchAnnouncementService $branchAnnouncementService)
    {
        $this->branchAnnouncementService = $branchAnnouncementService;
    }

    /**
     * Display a listing of branch announcements.
     */
    public function index(): JsonResponse
    {
        $announcements = $this->branchAnnouncementService->getAllAnnouncements();
        return response()->json(['data' => $announcements], 200);
    }

    /**
     * Store a newly created branch announcement.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|uuid|exists:branches,id',
            'message' => 'required|string|max:1000',
            'type' => 'required|in:info,offer,closure',
            'created_by' => 'required|uuid|exists:users,id', // user ID passed
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Convert the user ID to actual admin ID
        $adminId = $this->adminId($validated['created_by']);

        if (!$adminId) {
            return response()->json([
                'error' => true,
                'message' => 'Unauthorized: User is not an admin.'
            ], 403);
        }

        $validated['created_by'] = $adminId; // Replace with admin ID

        try {
            $announcement = $this->branchAnnouncementService->createAnnouncement($validated);

            return response()->json([
                'message' => 'Branch announcement created successfully',
                'data' => $announcement
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create branch announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified branch announcement.
     */
    public function show(string $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|uuid|exists:branch_announcements,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid announcement ID',
                'errors' => $validator->errors()
            ], 404);
        }

        try {
            $announcement = $this->branchAnnouncementService->getAnnouncementById($id);
            return response()->json(['data' => $announcement], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Branch announcement not found'
            ], 404);
        }
    }

    /**
     * Update the specified branch announcement.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $data = array_merge($request->all(), ['id' => $id]);

        $validator = Validator::make($data, [
            'id' => 'required|uuid|exists:branch_announcements,id',
            'branch_id' => 'sometimes|uuid|exists:branches,id',
            'message' => 'sometimes|string|max:1000',
            'type' => 'sometimes|in:info,offer,closure',
            'created_by' => 'sometimes|uuid|exists:users,id', // user ID passed
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        unset($validated['id']); // Remove id from update data

        // Convert user ID to admin ID if provided
        if (isset($validated['created_by'])) {
            $adminId = $this->adminId($validated['created_by']);
            if (!$adminId) {
                return response()->json([
                    'error' => true,
                    'message' => 'Unauthorized: User is not an admin.'
                ], 403);
            }
            $validated['created_by'] = $adminId;
        }

        try {
            $announcement = $this->branchAnnouncementService->updateAnnouncement($id, $validated);

            return response()->json([
                'message' => 'Branch announcement updated successfully',
                'data' => $announcement
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Branch announcement not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update branch announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified branch announcement.
     */
    public function destroy(string $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|uuid|exists:branch_announcements,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid announcement ID',
                'errors' => $validator->errors()
            ], 404);
        }

        try {
            $this->branchAnnouncementService->deleteAnnouncement($id);

            return response()->json([
                'message' => 'Branch announcement deleted successfully'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Branch announcement not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete branch announcement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active announcements for a specific branch.
     */
    public function getByBranch(string $branchId): JsonResponse
    {
        $validator = Validator::make(['branch_id' => $branchId], [
            'branch_id' => 'required|uuid|exists:branches,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Invalid branch ID',
                'errors' => $validator->errors()
            ], 404);
        }

        try {
            $announcements = $this->branchAnnouncementService->getActiveAnnouncementsByBranch($branchId);
            return response()->json(['data' => $announcements], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch branch announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update announcement statuses.
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'uuid|exists:branch_announcements,id',
            'status' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $count = $this->branchAnnouncementService->bulkUpdateStatus(
                $request->ids,
                $request->status
            );

            return response()->json([
                'message' => "Successfully updated $count announcement(s)",
                'updated_count' => $count
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update announcements',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
