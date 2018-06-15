<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductStatus extends Model
{
    public $primaryKey = 'product_status_id';
    protected $fillable = [
        'product_status_id',
        'product_status_name'
    ];
}
