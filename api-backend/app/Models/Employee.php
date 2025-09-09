<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'branch_id',
        'role',
        'hire_date',
        'created_by',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'role' => 'string',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function handledOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'handled_by');
    }

    public function offlineOrders(): HasMany
    {
        return $this->hasMany(OfflineOrder::class, 'cashier_id');
    }

    public function inventoryUpdates(): HasMany
    {
        return $this->hasMany(BranchInventory::class, 'last_updated_by');
    }

    public function requestedTransfers(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'requested_by');
    }

    public function approvedTransfers(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'approved_by');
    }

    public function receivedTransfers(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'received_by');
    }

    public function deliveryAssignments(): HasMany
    {
        return $this->hasMany(DeliveryAssignment::class, 'staff_id');
    }

    public function assignedDeliveries(): HasMany
    {
        return $this->hasMany(DeliveryAssignment::class, 'assigned_by');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'collected_by');
    }

    public function branchAnnouncements(): HasMany
    {
        return $this->hasMany(BranchAnnouncement::class, 'created_by');
    }
}