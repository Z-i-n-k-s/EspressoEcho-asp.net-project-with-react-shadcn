<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; // <-- Add this

class User extends Authenticatable implements JWTSubject // <-- Implement JWTSubject
{
    use HasFactory, Notifiable, HasUuids;

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

    // Relationships (unchanged)
    public function roles() { return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id'); }
    public function managedBranch() { return $this->hasOne(Branch::class, 'manager_id', 'id'); }
    public function employee() { return $this->hasOne(Employee::class, 'user_id', 'id'); }
    public function customer() { return $this->hasOne(Customer::class, 'user_id', 'id'); }
    public function createdProducts() { return $this->hasMany(Product::class, 'created_by', 'id'); }
    public function createdToppings() { return $this->hasMany(Topping::class, 'created_by', 'id'); }
    public function createdPromotions() { return $this->hasMany(Promotion::class, 'created_by', 'id'); }
    public function feedbackReplies() { return $this->hasMany(FeedbackReply::class, 'responder_id', 'id'); }
    public function removedReviews() { return $this->hasMany(ProductReview::class, 'removed_by', 'id'); }

    // JWT methods (required)
    public function getJWTIdentifier()
    {
        return $this->getKey(); // usually the primary key 'id'
    }

    public function getJWTCustomClaims()
    {
        return []; // any extra custom claims
    }
}
