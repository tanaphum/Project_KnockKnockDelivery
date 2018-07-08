<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $primaryKey = 'order_id';

    protected $fillable = [
        'receiver_firstname',
        'receiver_lastname',
        'receiver_location',
        'receiver_latitude',
        'receiver_longitude',
        'order_date',
        'order_total_price',
        'service_charge',
        'total',
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

    public function shipper()
    {
        return $this->belongsTo('App\Shipper', 'shipper_id', 'shipper_id');
    }

    public function order_status()
    {
        return $this->belongsTo('App\OrderStatus', 'order_status_id', 'order_status_id');
    }


}
