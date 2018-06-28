<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
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
            'admin_id' => $this->admin_id,
            'admin_firstname' => $this->admin_firstname,
            'admin_lastname' => $this->admin_lastname,
            'telephone_number' => $this->telephone_number,
            'user_id' => $this->user_id
        ];
    }
}
