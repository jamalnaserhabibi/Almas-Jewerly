<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gold_items', function (Blueprint $table) {
            // Make unit_price nullable and only used for individual items
            $table->decimal('unit_price', 12, 2)->nullable()->change();
            
            // Remove total_price if it exists (we don't need it)
            if (Schema::hasColumn('gold_items', 'total_price', 'status','sold_at')) {
                $table->dropColumn('total_price', 'status','sold_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('gold_items', function (Blueprint $table) {
            $table->decimal('unit_price', 12, 2)->nullable(false)->change();
            $table->decimal('total_price', 12, 2)->nullable();
        });
    }
};