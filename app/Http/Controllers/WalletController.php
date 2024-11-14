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
        return Inertia::render('Wallet', [
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

    // Deduct funds method
public function deductFunds(Request $request)
{
    $user = auth()->user();
    $amount = (float) $request->input('amount');

    // Load wallet to avoid the null error
    $user->load('wallet');

    // Check if the user has a wallet
    if (!$user->wallet) {
        return response()->json([
            'error' => 'No wallet found for the user'
        ], 404);
    }

    // Check if the wallet balance is sufficient
    if ($user->wallet->balance < $amount) {
        return response()->json([
            'error' => 'Insufficient funds in the wallet'
        ], 400);
    }

    // Deduct funds from the user's wallet
    $wallet = $user->wallet; // Access the related wallet model
    $wallet->balance -= $amount; // Deduct the amount directly
    $wallet->save(); // Save the changes

    return response()->json([
        'message' => 'Funds deducted successfully',
        'balance' => $wallet->balance
    ]);
}


    // WalletController.php
    // In WalletController.php
    public function getBalance(Request $request)
    {
        // Assuming you are returning the balance from the authenticated user's wallet
        $user = $request->user(); // Get authenticated user

        // Assuming the User model has a method to get the wallet balance
        return response()->json(['balance' => $user->wallet->balance]);
    }
}
