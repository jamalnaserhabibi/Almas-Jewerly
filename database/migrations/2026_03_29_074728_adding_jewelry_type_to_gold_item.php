<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gold_items', function (Blueprint $table) {
            $table->foreignId('jewelry_type_id')
                  ->after('karat_id')
                  ->constrained('jewelry_types')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('gold_items', function (Blueprint $table) {
            $table->dropForeign(['jewelry_type_id']);
            $table->dropColumn('jewelry_type_id');
        });
    }
};