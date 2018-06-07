<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ShopType extends Model
{
    protected $primaryKey = 'shop_type_id';
    
    protected $fillable = [
        'shop_type_id',
        'shop_type_name'
    ];

    public function sellers()
    {
        return $this->hasMany('App\ShopType', 'shop_type_id', 'shop_type_id');
    }

}
