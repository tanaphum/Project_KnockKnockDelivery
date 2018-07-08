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
            'shop_name' => $this->shop_name,
            'shop_location' => $this->shop_location,
            'shop_latitude' => $this->shop_latitude,
            'shop_longitude' => $this->shop_longitude,
            'shop_logo_image' => "/storage/seller/".$this->shop_logo_image,
            'profile_status' => [
                'profile_status_id' => $this->profile_status->profile_status_id,
                'profile_status_name' => $this->profile_status->profile_status_name
            ],
            'profile_id' => $this->profile_id
        ];
    }
}
