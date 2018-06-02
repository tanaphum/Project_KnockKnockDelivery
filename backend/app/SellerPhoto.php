<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SellerPhoto extends Model
{
    protected $fillable = [
        'seller_id', 
        'seller_photo_filename'
    ];
 
    public function seller()
    {
        return $this->belongsTo('App\Seller','seller_id', 'seller_id');
    }
}
