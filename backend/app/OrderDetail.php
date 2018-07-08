<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    public $primaryKey = 'order_detail_id';

    protected $fillable = [
        'product_id',
        'unit_of_product',
        'order_id'
    ];
}
