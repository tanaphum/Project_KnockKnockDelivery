<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BuyerResource extends JsonResource
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
            'buyer_id' => $this->buyer_id,
            'buyer_address' => $this->buyer_address,
            'profile_status' => [
                'profile_status_id' => $this->profile_status->profile_status_id,
                'profile_status_name' => $this->profile_status->profile_status_name
            ],
            'profile_id' => $this->profile_id
        ];
    }
}
