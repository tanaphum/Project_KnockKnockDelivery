<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    public $primaryKey = 'seller_id';

    protected $fillable = [
        'shop_name',
        'shop_location',
        'shop_logo_image',
        'shop_latitude',
        'shop_longitude',
    ];

    public $timestamps = false;

    public function profile_status()
    {
        return $this->belongsTo('App\ProfileStatus','profile_status_id', 'profile_status_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Profile','profile_id', 'profile_id');
    }
}
