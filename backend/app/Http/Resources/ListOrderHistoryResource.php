<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ListOrderHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        if(strlen(trim($this->payment_transfer_slip)) == 0){
            return [
                'order_id' => $this->order_id,
                'order_status' => $this->order_status,
                'payment_transfer_slip' => null,
                'updated_at' => $this->updated_at->format('Y-m-d')
            ];
        }else{
            return [
                'order_id' => $this->order_id,
                'order_status' => $this->order_status,
                'payment_transfer_slip' => "/storage/payment_transfer_slip/".$this->payment_transfer_slip,
                'updated_at' => $this->updated_at->format('Y-m-d')
            ];
        }

    }
}
