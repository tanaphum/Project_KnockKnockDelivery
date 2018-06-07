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
            'buyer_firstname' => $this->buyer_firstname,
            'buyer_lastname' => $this->buyer_lastname,
            'telephone_number' => $this->telephone_number,
            'status' => [
                'status_id' => $this->status->status_id,
                'status_name' => $this->status->status_name
            ],
            'profile_id' => $this->profile_id
        ];
    }
}
