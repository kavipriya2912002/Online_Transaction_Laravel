<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    use HasFactory;

    // Define the table associated with the model (optional if table name is plural of model name)
    protected $table = 'transfers';

    // Specify which attributes are mass assignable
    protected $fillable = [
        'user_id', // Foreign key for the user making the transfer
        'receiver_bank_account_number', // Receiver's bank account number
        'receiver_bank_name', // Receiver's bank name
        'receiver_account_holder_name', // Receiver's account holder name
        'amount', // Amount being transferred
    ];

    // Define relationships (if necessary)
    
    /**
     * Get the user that owns the transfer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
