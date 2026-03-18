<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Karat extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'purity',
    ];

    protected $casts = [
        'purity' => 'decimal:2',
    ];

   

    // Helper method to get formatted purity
    public function getFormattedPurityAttribute(): string
    {
        return $this->purity . '%';
    }
}