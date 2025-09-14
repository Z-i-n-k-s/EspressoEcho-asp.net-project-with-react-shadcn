<?php

// app/Services/BranchAnnouncementService.php
namespace App\Services;

use App\Models\BranchAnnouncement;
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
            $announcement = BranchAnnouncement::create($data);
            
            // You could add additional related operations here that need to be atomic
            // For example, logging the creation activity
            
            return $announcement;
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

            $announcement->update($data);
            $announcement->load(['branch', 'creator']);

            // You could add additional related operations here that need to be atomic
            // For example, logging the update activity

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

            // You could add additional related operations here that need to be atomic
            // For example, logging the deletion activity or cleaning up related records

            return $announcement->delete();
        });
    }

    /**
     * Get active announcements for a specific branch.
     */
    public function getActiveAnnouncementsByBranch(string $branchId): Collection
    {
        return DB::transaction(function () use ($branchId) {
            return BranchAnnouncement::where('branch_id', $branchId)
                ->where('is_active', true)
                ->with(['branch', 'creator'])
                ->get();
        });
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