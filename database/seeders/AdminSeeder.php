<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'kavipriya2912002@gmail.com',
            'password' => bcrypt('adminpassword'), // Encrypt the password
            'is_admin' => true, // Manually set is_admin to true
        ]);
    }
}
