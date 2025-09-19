<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'name',
        'address',
        'contact_phone',
        'manager_id',
        'status',
    ];

    protected $casts = [
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        
    ];

    // Relationships
    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(BranchAnnouncement::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'branch_categories');
    }

    public function inventory(): HasMany
    {
        return $this->hasMany(BranchInventory::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function offlineOrders(): HasMany
    {
        return $this->hasMany(OfflineOrder::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    public function productReviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function transfersFrom(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'from_branch_id');
    }

    public function transfersTo(): HasMany
    {
        return $this->hasMany(InventoryTransfer::class, 'to_branch_id');
    }

    // public function adjustments(): HasMany
    // {
    //     return $this->hasMany(InventoryAdjustment::class);
    // }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeWithManager($query)
    {
        return $query->with('manager');
    }
}