<?php

// app/Models/InventoryTransfer.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransfer extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'from_branch_id',
        'to_branch_id',
        'requested_by',
        'approved_by',
        'received_by',
        'status',
        'reason',
        'requested_at',
        'approved_at',
        'completed_at',
        'rejection_reason',
        'inventory_deducted',
        'inventory_added',
    ];

    protected $casts = [
        'status' => 'string',
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
        'inventory_deducted' => 'boolean',
        'inventory_added' => 'boolean',
    ];

    // Relationships
    public function fromBranch()
    {
        return $this->belongsTo(Branch::class, 'from_branch_id');
    }

    public function toBranch()
    {
        return $this->belongsTo(Branch::class, 'to_branch_id');
    }

    public function requestedBy()
    {
        return $this->belongsTo(Employee::class, 'requested_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    public function receivedBy()
    {
        return $this->belongsTo(Employee::class, 'received_by');
    }

    public function items()
    {
        return $this->hasMany(InventoryTransferItem::class, 'transfer_id');
    }
}