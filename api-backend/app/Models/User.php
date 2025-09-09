<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, SoftDeletes;

    protected $table = 'users';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'email',
        'password_hash',
        'full_name',
        'status',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'status' => 'string',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Relationships
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    public function managedBranch()
    {
        return $this->hasOne(Branch::class, 'manager_id', 'id');
    }

    public function employee()
    {
        return $this->hasOne(Employee::class, 'user_id', 'id');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'user_id', 'id');
    }

    public function createdProducts()
    {
        return $this->hasMany(Product::class, 'created_by', 'id');
    }

    public function createdToppings()
    {
        return $this->hasMany(Topping::class, 'created_by', 'id');
    }

    public function createdPromotions()
    {
        return $this->hasMany(Promotion::class, 'created_by', 'id');
    }

    public function feedbackReplies()
    {
        return $this->hasMany(FeedbackReply::class, 'responder_id', 'id');
    }

    public function removedReviews()
    {
        return $this->hasMany(ProductReview::class, 'removed_by', 'id');
    }
}