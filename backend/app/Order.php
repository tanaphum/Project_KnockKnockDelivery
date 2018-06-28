<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $primaryKey = 'order_id';

    protected $fillable = [
        'order_date',
        'total',
        'buyer_location',
        'order_status_id',
        'seller_id',
        'buyer_id',
    ];

    public $timestamps = false;

    public function seller()
    {
        return $this->belongsTo('App\Seller', 'seller_id', 'seller_id');
    }

    public function buyer()
    {
        return $this->belongsTo('App\Buyer', 'buyer_id', 'buyer_id');
    }

    public function deliver()
    {
        return $this->belongsTo('App\Seller', 'seller_id', 'seller_id');
    }
    
    public function orderStatus()
    {
        return $this->belongsTo('App\OrderStatus', 'order_status_id', 'order_status_id');
    }

    
}
