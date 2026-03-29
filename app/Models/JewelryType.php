<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JewelryType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'info',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Relationship with GoldItem 
    public function goldItems()
    {
        return $this->hasMany(GoldItem::class);
    }
}