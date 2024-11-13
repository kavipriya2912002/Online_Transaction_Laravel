<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\UtrController;
use App\Http\Controllers\WalletController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/transfer', [TransferController::class, 'index'])->name('transfer.page');
Route::post('/transfers', [TransferController::class, 'store'])->name('transfers.submit');
Route::get('/user-transactions', [TransferController::class, 'getUserTransactions'])->name('transfers.getUserTransactions');
Route::middleware('auth')->group(function () {
    Route::get('/wallet', [WalletController::class, 'show'])->name('wallet');
    Route::post('/wallet', [WalletController::class, 'addFunds'])->name('wallet.addFunds');
});

Route::post('/bank-details', [BankAccountController::class, 'store'])->name('bank-details.submit');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/transactions/{id}/approve', [AdminController::class, 'approve'])->name('admin.approve');
    Route::post('/transactions/{id}/reject', [AdminController::class, 'reject'])->name('admin.reject');
});

Route::middleware(['auth'])->group(function () {
    //     Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/notifications', [AdminController::class, 'notify'])->name('admin.notify');
    Route::get('/dashboard', [AdminController::class, 'showNotifications'])->name('dashboard');
   
    //     Route::post('/transactions/{id}/approve', [AdminController::class, 'approve'])->name('admin.approve');
    //     Route::post('/transactions/{id}/reject', [AdminController::class, 'reject'])->name('admin.reject');

});


Route::middleware('auth')->group(function () {
    Route::get('utr-upload', [UtrController::class, 'create'])->name('utr.upload');
    Route::get('utr-upload', [UtrController::class, 'showUtrUpload'])->name('utr.upload');
    Route::post('utr-upload', [UtrController::class, 'store'])->name('utr.store');
});




require __DIR__ . '/auth.php';
require __DIR__ . '/admin-auth.php';
