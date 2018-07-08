<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ListOrdersOfShipperResource extends JsonResource
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
            'order_date' => $this->order_date,
            'order_total_price' => $this->telephone_number,
            'service_charge' => $this->telephone_number,
            'total' => $this->telephone_number,
            'seller' => [
                'seller_id' => $this->seller->seller_id,
                'shop_name' => $this->seller->shop_name,
                'shop_location' => $this->seller->shop_location
            ],
            'buyer' => [
                'buyer_id' => $this->buyer->buyer_id,
            ]
        ];
    }
}
