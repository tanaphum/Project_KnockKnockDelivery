<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShopType extends Model
{
    protected $fillable = [
        'shop_type_name'
    ];

    public function sellers()
    {
        return $this->hasMany('App\Seller', 'shop_type_id', 'shop_type_id');
    }

}
