<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SellerPhoto extends Model
{
    protected $primaryKey = 'seller_photo_id';

    protected $fillable = [
        'seller_id', 
        'seller_photo_filename'
    ];

    public $timestamps = false;
 
    public function seller()
    {
        return $this->belongsTo('App\Seller','seller_id', 'seller_id');
    }
}
