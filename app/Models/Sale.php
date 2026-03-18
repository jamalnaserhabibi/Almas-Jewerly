<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'gold_item_id',
        'customer_id',
        'unit_price',
        'sale_date',
        'notes',
        'sold_by',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'sale_date' => 'date',
    ];

    // Relationships
    public function goldItem()
    {
        return $this->belongsTo(GoldItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'sold_by');
    }
}