<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $primaryKey = 'product_id';

    protected $fillable = [
        'product_name',
        'product_description',
        'product_price',
        'unit_in_stock',
        'product_available',
        'product_category_id',
        // 'seller_id'
    ];

    public function category()
    {
        return $this->belongsTo('App\Category', 'product_category_id', 'category_id');
    }

    public function seller()
    {
        return $this->belongsTo('App\Seller', 'seller_id', 'seller_id');
    }

}
