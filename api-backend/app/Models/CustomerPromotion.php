<?php

// app/Models/CustomerPromotion.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerPromotion extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'promo_id',
        'status',
        'assigned_by',
        'assigned_at',
        'used_at',
        'order_id',
    ];

    protected $casts = [
        'status' => 'string',
        'assigned_by' => 'string',
        'assigned_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class, 'promo_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}