<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    protected $fillable = [
        'seller_name',
        'shop_name',
        'shop_location',
        'shop_type_id',
        'status_id',
        'profile_id'
    ];

    public function shoptype()
    {
        return $this->belongsTo('App\ShopType','shop_type_id', 'shop_type_id');
    }

    public function status()
    {
        return $this->belongsTo('App\Status','status_id', 'status_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Profile','profile_id', 'profile_id');
    }
}
