<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the table if it exists to start fresh
        Schema::dropIfExists('gold_items');
        
        Schema::create('gold_items', function (Blueprint $table) {
            $table->id();
            
            // Source type: 'company' or 'individual'
            $table->enum('source_type', ['company', 'individual']);
            
            // Foreign key to companies table
            $table->foreignId('company_id')
                  ->nullable()
                  ->constrained('companies')
                  ->nullOnDelete();
            
            // For individual purchases
            $table->string('individual_name')->nullable();
            
            // Item details
            $table->decimal('weight', 10, 3);
            $table->decimal('acidic_average', 5, 2)->nullable();
            
            // Foreign key to karats table
            $table->foreignId('karat_id')
                  ->constrained('karats')
                  ->restrictOnDelete();
            
            // Pricing
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total_price', 12, 2);
            $table->decimal('fee', 8, 2)->nullable();
            
            // Photo
            $table->string('photo')->nullable();
            
            // Barcode
            $table->string('barcode')->unique();
            $table->string('barcode_image')->nullable();
            
            // Date
            $table->date('purchase_date');
            
           
            $table->enum('status', ['in_stock', 'sold', 'returned'])->default('in_stock');
            
           
            $table->text('notes')->nullable();
           
            $table->timestamp('sold_at')->nullable();
            
            $table->timestamps();
            
         
            $table->index('purchase_date');
            $table->index('status');
            $table->index('barcode');
            $table->index('source_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gold_items');
    }
};