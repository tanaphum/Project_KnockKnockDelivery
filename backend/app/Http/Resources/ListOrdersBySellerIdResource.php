<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\OrderDetail;

class ListOrdersBySellerIdResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'order_id' => $this->order_id,
            'receiver_firstname' => $this->receiver_firstname,
            'receiver_lastname' => $this->receiver_lastname,
            'receiver_location' => $this->receiver_location,
            'receiver_latitude' => $this->receiver_latitude,
            'receiver_longitude' => $this->receiver_longitude,
            'service_charge' => $this->service_charge,
            'order_total_price' => $this->order_total_price,
            'created_at' => $this->created_at->format('Y-m-d'),
            'seller' => [
                'seller_id' => $this->seller->seller_id,
                'shop_name' => $this->seller->shop_name,
                'shop_location' => $this->seller->shop_location,
                'shop_latitude' => $this->seller->shop_latitude,
                'shop_longitude' => $this->seller->shop_longitude
            ],
            'buyer' => [
                'buyer_id' => $this->buyer->buyer_id,
            ],
            'order_details' => OrderDetail::getOrderDetailsByOrderId($this->order_id)
        ];
    }
}
