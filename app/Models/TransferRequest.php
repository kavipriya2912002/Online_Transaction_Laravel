<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransferRequest extends Model
{
    use HasFactory;

    // Allow these fields to be mass assigned
    protected $fillable = [
        'from_account_number',
        'to_account_number',
        'amount',
        'status',
    ];

    // Specify a custom table name if needed
    // protected $table = 'your_table_name';

    // Disable timestamps if your table doesn't use them
    // public $timestamps = false;
}
