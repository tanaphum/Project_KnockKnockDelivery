<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductPhoto extends Model
{
    public $primaryKey = 'product_photos_id';

    protected $fillable = [
        'product_photos_filename',
        'product_id'
    ];

    public $timestamps = false;

    public function products()
    {
        return $this->hasMany('App\Product', 'product_id', 'product_id');
    }
    
}
