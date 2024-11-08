<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('transfer_requests', function (Blueprint $table) {
        $table->id();
        $table->string('from_account_number');
        $table->string('to_account_number');
        $table->decimal('amount', 15, 2);
        $table->string('status')->default('Pending');

        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfer_requests');
    }
};
