<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'order_type',
        'payment_method',
        'amount',
        'status',
        'transaction_id',
        'collected_by',
        'payment_date',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
    ];

    // Relationships
    public function order(): MorphTo
    {
        return $this->morphTo('order', 'order_type', 'order_id');
    }

    public function onlineOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id')->where('order_type', 'online');
    }

    public function offlineOrder(): BelongsTo
    {
        return $this->belongsTo(OfflineOrder::class, 'order_id')->where('order_type', 'offline');
    }

    public function collectedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'collected_by');
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeByOrderType($query, $type)
    {
        return $query->where('order_type', $type);
    }

    // Accessors
    public function getFormattedAmountAttribute()
    {
        return number_format($this->amount, 2);
    }

    public function getIsCompletedAttribute()
    {
        return $this->status === 'completed';
    }
}