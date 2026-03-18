<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GoldItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_type',
        'company_id',
        'individual_name',
        'weight',
        'acidic_average',
        'karat_id',
        'unit_price',     
        'fee',              
        'photo',
        'barcode',
        'barcode_image',
        'purchase_date',
        'notes',
    ];

    protected $casts = [
        'weight' => 'decimal:3',
        'acidic_average' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'fee' => 'decimal:2',
        'purchase_date' => 'date',
        'sold_at' => 'datetime',
    ];

    // Relationships
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function karat()
    {
        return $this->belongsTo(Karat::class);
    }

    // Scopes
    public function scopeFromCompany($query)
    {
        return $query->where('source_type', 'company');
    }

    public function scopeFromIndividual($query)
    {
        return $query->where('source_type', 'individual');
    }

    public function scopeInStock($query)
    {
        return $query->where('status', 'in_stock');
    }

    // Helper methods
    public function isFromCompany()
    {
        return $this->source_type === 'company';
    }

    public function isFromIndividual()
    {
        return $this->source_type === 'individual';
    }

    public function getSourceNameAttribute()
    {
        if ($this->isFromCompany()) {
            return $this->company?->name ?? 'Unknown Company';
        }
        return $this->individual_name ?? 'Unknown Individual';
    }

    // Generate barcode before creating
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($item) {
            // Generate unique barcode
            $item->barcode = $item->generateBarcode();
        });
    }

    // Generate unique barcode
    protected function generateBarcode()
    {
        $prefix = 'GOLD';
        $date = now()->format('ymd');
        $random = str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        
        return $prefix . $date . $random;
    }


    // Add relationship
public function sale()
{
    return $this->hasOne(Sale::class);
}
 
 

}