<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OfflineOrder extends Model
{
    use HasFactory, HasUuids;
     public $timestamps = false; 

    protected $fillable = [
        'branch_id',
        'cashier_id',
        'total_amount',
        'payment_method',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    // Relationships
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'cashier_id');
    }

    public function offlineOrderItems(): HasMany
    {
        return $this->hasMany(OfflineOrderItem::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class, 'order_id')->where('order_type', 'offline');
    }

    // Scopes
    public function scopeByBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }

    public function scopeByCashier($query, $cashierId)
    {
        return $query->where('cashier_id', $cashierId);
    }

    public function scopeByPaymentMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    // Accessors
    public function getFormattedTotalAmountAttribute()
    {
        return number_format($this->total_amount, 2);
    }
}