<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\TransferRequest;


class AdminController extends Controller
{
    public function index()
    {
        // Fetch all transactions
        $transactions = Transfer::all();

        // Fetch notifications (assuming you have a Notification model)
        $notifications = Notification::all();

        // Return both transactions and notifications to the Inertia view
        return Inertia::render('Admin', [
            'transactions' => $transactions,
            'notifications' => $notifications
        ]);
    }

    public function showNotifications()
    {
        // Retrieve all notifications with the related user data
        $notifications = Notification::with('user')->get();

        return Inertia::render('Dashboard', ['notifications' => $notifications]);
    }



    public function notify(Request $request)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return response()->json(['error' => 'User is not authenticated'], 403);
        }

        Log::info('Authenticated user ID: ' . Auth::id());

        try {
            // Validate the incoming request data
            $validated = $request->validate([
                'fromAccountNumber' => 'required|string',
                'toAccountNumber' => 'required|string',
                'amount' => 'required|numeric',
            ]);

            // Insert the data directly into the database
            $notification = Notification::create([
                'user_id' => Auth::id(),  // Use the authenticated user's ID
                'from_account_number' => $validated['fromAccountNumber'],
                'to_account_number' => $validated['toAccountNumber'],
                'amount' => $validated['amount'],
            ]);

            return response()->json(['message' => 'Admin notified successfully']);
        } catch (\Exception $e) {
            Log::error('Failed to notify admin', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to notify admin: ' . $e->getMessage()], 500);
        }
    }








    public function verify($id)
    {
        $transfer = TransferRequest::find($id);
        if ($transfer) {
            $transfer->status = 'Verified';
            $transfer->save();
            return redirect()->back()->with('success', 'Transfer verified successfully');
        } else {
            return redirect()->back()->with('error', 'Transfer not found');
        }
    }


    public function indexTrans()
    {
        $pendingTransfers = TransferRequest::where('status', 'Pending')->get();
        return view('admin.transfers.index', compact('pendingTransfers'));
    }




    public function approve($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        // Update the status of the notification to approved
        $notification->status = 'approved'; // Assuming you have a 'status' field
        $notification->save();

        return response()->json(['message' => 'Transaction approved successfully']);
    }


    public function reject($id)
    {
        $notification = Notification::find($id);

        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        // Update the status of the notification to rejected
        $notification->status = 'rejected'; // Assuming you have a 'status' field
        $notification->save();

        return response()->json(['message' => 'Transaction rejected successfully']);
    }
}
