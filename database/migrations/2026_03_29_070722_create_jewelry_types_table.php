<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jewelry_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('info')->nullable();
            $table->timestamps();
        });

        
        DB::table('jewelry_types')->insert([
            ['name' => 'Necklace سیت', 'info' => 'A piece of jewelry worn around the neck', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ring انگشتر', 'info' => 'A circular band worn on the finger', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Earrings گشواره', 'info' => 'Jewelry worn on the earlobes', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bracelet دستبند', 'info' => 'An ornamental band worn around the wrist', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Pendant لاکت', 'info' => 'A hanging piece of jewelry worn on a chain', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Anklet پای زیب', 'info' => 'Jewelry worn around the ankle', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Tiara تاج', 'info' => 'A jeweled ornamental crown worn by women', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('jewelry_types');
    }
};