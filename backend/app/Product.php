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
        'product_image_1',
        'product_image_2',
        'product_image_3',
        'product_category_id',
        'seller_id',
    ];

    public function product_category()
    {
        return $this->belongsTo('App\ProductCategory', 'product_category_id', 'product_category_id');
    }

    public function seller()
    {
        return $this->belongsTo('App\Seller', 'seller_id', 'seller_id');
    }

    public function product_status()
    {
        return $this->belongsTo('App\ProductStatus', 'product_status_id', 'product_status_id');
    }

}
