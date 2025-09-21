<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory, HasUuids;

    // Disable automatic timestamps as we're managing them manually
    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'order_type',
        'order_status',
        'subtotal',
        'discount_amount',
        'total_amount',
        'default_address',
        'delivery_address',
        'special_instructions',
        'promo_code_used',
        'placed_at',
        'confirmed_at',
        'prepared_at',
        'completed_at',
        'cancelled_at',
        'handled_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'default_address' => 'boolean',
        'placed_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'prepared_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function handledBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'handled_by');
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'promo_code_used', 'code');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function deliveryAssignment(): HasOne
    {
        return $this->hasOne(DeliveryAssignment::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class)->where('order_type', 'online');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereNotIn('order_status', ['cancelled']);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('order_status', $status);
    }

    public function scopeByCustomer($query, $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('placed_at', '>=', now()->subDays($days));
    }

    public function getIsActiveAttribute(): bool
    {
        return !in_array($this->order_status, ['cancelled', 'delivered']);
    }

    public function getCanBeCancelledAttribute(): bool
    {
        return !in_array($this->order_status, ['on_the_way', 'delivered', 'cancelled']);
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->order_status, ['on_the_way', 'delivered', 'cancelled']);
    }

    public function canUpdateStatus(string $newStatus, string $employeeId): bool
    {
        $employee = Employee::with('user.roles')->find($employeeId);
        if (!$employee) return false;

        $employeeRoles = $employee->user->roles->pluck('name')->toArray();

        $allowedTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['preparing', 'cancelled'],
            'preparing' => ['ready_for_delivery', 'cancelled'],
            'ready_for_delivery' => ['on_the_way', 'cancelled'],
            'on_the_way' => ['delivered'],
            'delivered' => [],
            'cancelled' => []
        ];

        $allowedRoles = [
            'pending' => ['cashier'],
            'confirmed' => ['cashier'],
            'preparing' => ['cashier'],
            'ready_for_delivery' => ['cashier'],
            'on_the_way' => ['staff'],
            'delivered' => ['staff'],
            'cancelled' => ['cashier']
        ];

        // Check if transition is allowed
        if (!in_array($newStatus, $allowedTransitions[$this->order_status])) {
            return false;
        }

        // Check if employee has required role
        if (empty(array_intersect($employeeRoles, $allowedRoles[$newStatus]))) {
            return false;
        }

        return true;
    }

    public function getStatusHistoryAttribute(): array
    {
        $history = [];

        if ($this->placed_at) $history[] = ['status' => 'placed', 'at' => $this->placed_at];
        if ($this->confirmed_at) $history[] = ['status' => 'confirmed', 'at' => $this->confirmed_at];
        if ($this->prepared_at) $history[] = ['status' => 'preparing', 'at' => $this->prepared_at];
        if ($this->completed_at) $history[] = ['status' => 'delivered', 'at' => $this->completed_at];
        if ($this->cancelled_at) $history[] = ['status' => 'cancelled', 'at' => $this->cancelled_at];

        // Add delivery assignment status if exists
        if ($this->deliveryAssignment) {
            $history[] = ['status' => 'delivery_assigned', 'at' => $this->deliveryAssignment->assigned_at];
            if ($this->deliveryAssignment->started_at) $history[] = ['status' => 'delivery_started', 'at' => $this->deliveryAssignment->started_at];
            if ($this->deliveryAssignment->completed_at) $history[] = ['status' => 'delivery_completed', 'at' => $this->deliveryAssignment->completed_at];
        }

        return $history;
    }

    public function canBeCancelledByCustomer(): bool
    {
        $placedAt = \Carbon\Carbon::parse($this->placed_at);
        $now = \Carbon\Carbon::now();

        return $now->diffInMinutes($placedAt) <= 30 &&
            in_array($this->order_status, ['pending', 'confirmed']);
    }

    public function canBeCancelledByCashier(): bool
    {
        return !in_array($this->order_status, ['delivered', 'cancelled']);
    }

    public function getCancellationEligibilityAttribute(): array
    {
        return [
            'customer' => $this->canBeCancelledByCustomer(),
            'cashier' => $this->canBeCancelledByCashier(),
            'reason' => $this->getCancellationReason()
        ];
    }

    private function getCancellationReason(): string
    {
        if ($this->order_status === 'delivered') {
            return 'Order has already been delivered';
        }

        if ($this->order_status === 'cancelled') {
            return 'Order is already cancelled';
        }

        if ($this->order_status === 'on_the_way') {
            return 'Order is already on the way for delivery';
        }

        $placedAt = \Carbon\Carbon::parse($this->placed_at);
        $now = \Carbon\Carbon::now();

        if ($now->diffInMinutes($placedAt) > 30 && in_array($this->order_status, ['pending', 'confirmed'])) {
            return 'Orders can only be cancelled within 30 minutes of placement';
        }

        return 'Order can be cancelled';
    }
}