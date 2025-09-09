<?php

// app/Models/Customer.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'phone',
        'default_delivery_address',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function promotions()
    {
        return $this->hasMany(CustomerPromotion::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    public function productReviews()
    {
        return $this->hasMany(ProductReview::class);
    }
}