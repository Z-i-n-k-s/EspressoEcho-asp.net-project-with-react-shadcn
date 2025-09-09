<?php

// app/Models/UserRole.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table = 'user_roles';
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'role_id',
    ];

    // Composite primary key
    protected $primaryKey = ['user_id', 'role_id'];
    public $incrementing = false;

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}