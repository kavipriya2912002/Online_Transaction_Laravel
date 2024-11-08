<?php
// app/Http/Controllers/BankAccountController.php
// app/Http/Controllers/BankAccountController.php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BankAccountController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'bankAccountNumber' => 'required|string|max:255',
            'bankName' => 'required|string|max:255',
            'accountHolderName' => 'required|string|max:255',
        ]);

        $existingAccount = BankAccount::where('bank_account_number', $request->bankAccountNumber)->first();

        if ($existingAccount) {
            // Redirect to the transfer page with an error message
            return redirect()->route('dashboard')->with('error', 'The account number already exists.');
        }

        // Create bank account entry
        BankAccount::create([
            'user_id' => Auth::id(), // Store the authenticated user's ID
            'bank_account_number' => $request->bankAccountNumber,
            'bank_name' => $request->bankName,
            'account_holder_name' => $request->accountHolderName,
        ]);

        // Redirect back with success message
        return redirect()->route('dashboard')->with('success', 'Bank account details saved successfully!');
    }
}
