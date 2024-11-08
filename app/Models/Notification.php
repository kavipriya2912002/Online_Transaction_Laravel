<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'from_account_number',
        'to_account_number',
        'amount',
        // Add any other fields you want to allow for mass assignment
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
