<?php
namespace App\Http\Controllers;

use App\Models\Transfer;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index()
    {
        // Fetch transfers for the authenticated user
        $transfers = Transfer::where('user_id', Auth::id())->get();
        
        // Return the transfers data as a JSON response
        return Inertia::render('Profile/TransferDetails', [
            'transfers' => $transfers,
        ]);
    }
    



    public function store(Request $request)
    {
        
        // Validate the request
        $request->validate([
            'receiverBankAccountNumber' => 'required|string|max:255',
            'receiverBankName' => 'required|string|max:255',
            'receiverAccountHolderName' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ]);

        // Create a new transfer entry
        Transfer::create([
            'user_id' => Auth::id(), // Store the authenticated user's ID
            'receiver_bank_account_number' => $request->receiverBankAccountNumber,
            'receiver_bank_name' => $request->receiverBankName,
            'receiver_account_holder_name' => $request->receiverAccountHolderName,
            'amount' => $request->amount,
        ]);

        // Redirect or respond as necessary
        return redirect()->route('dashboard')->with('success', 'Transfer completed successfully!');
    }
}
