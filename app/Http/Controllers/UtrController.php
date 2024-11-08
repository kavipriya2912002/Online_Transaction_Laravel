<?php

namespace App\Http\Controllers;

use App\Models\Utr;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UtrController extends Controller
{

    public function create()
    {
        return inertia('UtrUpload'); // Adjust the path as necessary
    }

    public function showUtrUpload()
{
    return Inertia::render('UtrUpload');
}

public function store(Request $request)
{
    if (!Auth::check()) {
        return response()->json(['error' => 'User is not authenticated'], 403);
    }

    Log::info('Authenticated user ID: ' . Auth::id());
    // Validate the request
    $request->validate([
        'utr_file' => 'required|file|mimes:jpg,png,pdf|max:2048', // Example validation
         // Ensure the user_id exists in the users table
    ]);

    // Handle the file upload
    $path = $request->file('utr_file')->store('utrs'); // Save in the 'utrs' directory

    // Save the file path and user_id to the database
    Utr::create([
        'user_id' => Auth::id(),
        'file_path' => $path,
         // Store the user ID
    ]);

    return redirect()->route('dashboard')->with('success', 'UTR uploaded successfully!');
}

    //
    public function index()
    {
        $utrs = Utr::all(); // Fetch all uploaded UTR records
        return inertia('UtrIndex', ['utrs' => $utrs]); // Adjust path as necessary
    }
}
