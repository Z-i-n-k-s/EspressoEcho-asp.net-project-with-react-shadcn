<?php

namespace App\Services;

use App\Models\BranchAnnouncement;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class BranchAnnouncementService
{
    /**
     * Get all branch announcements.
     */
    public function getAllAnnouncements(): Collection
    {
        return BranchAnnouncement::with(['branch', 'creator'])->get();
    }

    /**
     * Get a specific branch announcement by ID.
     */
    public function getAnnouncementById(string $id): BranchAnnouncement
    {
        $announcement = BranchAnnouncement::with(['branch', 'creator'])->find($id);
        
        if (!$announcement) {
            throw new ModelNotFoundException('Branch announcement not found');
        }

        return $announcement;
    }

    /**
     * Create a new branch announcement with transaction.
     */
    public function createAnnouncement(array $data): BranchAnnouncement
    {
        return DB::transaction(function () use ($data) {
            // Validate branch exists
            if (!Branch::where('id', $data['branch_id'])->exists()) {
                throw new ModelNotFoundException('Branch not found');
            }

            // Validate creator exists
            if (!User::where('id', $data['created_by'])->exists()) {
                throw new ModelNotFoundException('User not found');
            }

            return BranchAnnouncement::create($data);
        });
    }

    /**
     * Update an existing branch announcement with transaction.
     */
    public function updateAnnouncement(string $id, array $data): BranchAnnouncement
    {
        return DB::transaction(function () use ($id, $data) {
            $announcement = BranchAnnouncement::find($id);
            
            if (!$announcement) {
                throw new ModelNotFoundException('Branch announcement not found');
            }

            // Validate branch exists if being updated
            if (isset($data['branch_id']) && !Branch::where('id', $data['branch_id'])->exists()) {
                throw new ModelNotFoundException('Branch not found');
            }

            $announcement->update($data);
            $announcement->load(['branch', 'creator']);

            return $announcement;
        });
    }

    /**
     * Delete a branch announcement with transaction.
     */
    public function deleteAnnouncement(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $announcement = BranchAnnouncement::find($id);
            
            if (!$announcement) {
                throw new ModelNotFoundException('Branch announcement not found');
            }

            // Hard delete the announcement
            return $announcement->delete();
        });
    }

    /**
     * Get active announcements for a specific branch.
     */
    public function getActiveAnnouncementsByBranch(string $branchId): Collection
    {
        return BranchAnnouncement::where('branch_id', $branchId)
            ->where('is_active', true)
            ->with(['branch', 'creator'])
            ->get();
    }

    /**
     * Bulk update announcement statuses with transaction.
     */
    public function bulkUpdateStatus(array $ids, bool $status): int
    {
        return DB::transaction(function () use ($ids, $status) {
            return BranchAnnouncement::whereIn('id', $ids)
                ->update(['is_active' => $status]);
        });
    }
}