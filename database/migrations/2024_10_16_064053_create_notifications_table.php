<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('notifications', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id'); // Add user_id to track which user performed the transaction
        $table->string('from_account_number');
        $table->string('to_account_number');
        $table->decimal('amount', 10, 2);
        $table->string('status')->default('pending');
        $table->timestamps();

        // Foreign key constraint linking to the users table
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });
}



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
