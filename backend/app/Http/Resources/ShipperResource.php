<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ShipperResource extends JsonResource
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
            'shipper_id' => $this->shipper_id,
            'bank_account' => [
                'bank_account_id' => $this->bank_account->bank_account_id,
                'bank_account_name' => $this->bank_account->bank_account_name
            ],
            'bank_account_no' => $this->bank_account_no,
            'shipper_transfer_slip' => "/storage/shipper/".$this->shipper_transfer_slip,
            'profile_status' => [
                'profile_status_id' => $this->profile_status->profile_status_id,
                'profile_status_name' => $this->profile_status->profile_status_name
            ],
            'profile_id' => $this->profile_id
        ];
    }
}
