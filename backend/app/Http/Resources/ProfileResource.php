<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // return parent::toArray($request);
        return  [ 
            'profile_id' => $this->profile_id,
            'user_id' => $this->user_id,
            'role' => [
                'role_id' => $this->role->role_id,
                'role_name' => $this->role->role_name,
            ]
        ];
    }
}