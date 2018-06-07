<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliverResource extends JsonResource
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
            'deliver_id' => $this->deliver_id,
            'deliver_firstname' => $this->deliver_firstname,
            'deliver_lastname' => $this->deliver_lastname,
            'birthOfDate' => $this->birthOfDate,
            'telephone_number' => $this->telephone_number,
            'status' => [
                'status_id' => $this->status->status_id,
                'status_name' => $this->status->status_name
            ],
            'profile_id' => $this->profile_id
        ];
    }
}
