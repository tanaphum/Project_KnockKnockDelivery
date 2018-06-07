<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SellerResource extends JsonResource
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
            'seller_id' => $this->seller_id,
            'seller_name' => $this->seller_name,
            'shop_name' => $this->shop_name,
            'shop_location' => $this->shop_location,
            'shop_type' => [
                'shop_type_id' => $this->shoptype->shop_type_id,
                'shop_type_name' => $this->shoptype->shop_type_name
            ],
            'status' => [
                'status_id' => $this->status->status_id,
                'status_name' => $this->status->status_name
            ],
            'profile_id' => $this->profile_id
        ];
    }
}
