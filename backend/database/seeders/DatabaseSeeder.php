<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::where('email', 'enklajd.hodo@gmail.com')->delete();

        User::updateOrCreate(
            ['email' => 'pjesekembimimiri@gmail.com'],
            [
                'name' => 'Aldo Shima',
                'password' => Hash::make('PjeseMiri!'),
                'role' => 'admin',
                'phone' => '0692902694',
                'address' => 'Mëzez, Tiranë',
                'email_verified_at' => now(),
            ]
        );
    }
}