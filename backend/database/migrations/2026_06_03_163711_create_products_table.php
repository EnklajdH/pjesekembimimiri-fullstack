<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('title');
            $table->string('slug')->unique();

            $table->string('model');

            $table->decimal('price', 10, 2);
            $table->string('currency')->default('EUR');

            $table->integer('stock')->default(1);

            $table->string('condition')->default('E përdorur origjinale');
            $table->string('origin')->default('Gjermani');
            $table->string('oem')->nullable();

            $table->enum('status', ['active', 'hidden', 'sold'])->default('active');

            $table->string('image')->nullable();
            $table->longText('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};