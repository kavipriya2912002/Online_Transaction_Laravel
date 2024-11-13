<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WalletController extends Controller
{
    public function show()
    {
        $user = auth()->user();

    // Eager load the user's wallet to avoid N+1 queries
    $user->load('wallet');
        // Render the Wallet page (which corresponds to 'Wallet.jsx')
        return Inertia::render('Wallet',[
            'user' => $user,
            'walletBalance' => $user->wallet ? $user->wallet->balance : 0, // Provide the balance or 0 if no wallet
        ]);
    }

   // Add funds method
public function addFunds(Request $request)
{
    $user = auth()->user();
    $amount = (float) $request->input('amount');
    
    // Load wallet to avoid the null error
    $user->load('wallet'); 

    // Check if the user has a wallet, if not, create one
    if (!$user->wallet) {
        $user->wallet()->create([
            'balance' => 0.00,  // Initialize with zero balance
        ]);
    }

    // Add funds to the user's wallet
    $wallet = $user->wallet; // Access the related wallet model
    $wallet->balance += $amount; // Modify the balance directly
    $wallet->save(); // Save the changes

    return response()->json([
        'message' => 'Funds added successfully',
        'balance' => $wallet->balance
    ]);
}

    

}
