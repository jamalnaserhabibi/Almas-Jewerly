<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Add this for inserting records

return new class extends Migration
{
    public function up(): void
    {
        // Create the table
        Schema::create('karats', function (Blueprint $table) {
            $table->id();
            $table->string('name');  
            $table->decimal('purity', 5, 2);  
            $table->timestamps();
        });

        
        DB::table('karats')->insert([
            [
                'name' => '24K',
                'purity' => 99.99,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '22K',
                'purity' => 91.67,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '21K',
                'purity' => 87.50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '18K',
                'purity' => 75.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => '14K',
                'purity' => 58.33,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('karats');
    }
};