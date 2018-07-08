<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderQRcodeResource extends JsonResource
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
            'shipper_id' => $this->shipper_id,
            'buyer_id' => $this->buyer_id,
            'order_status' => [
                'order_status_id' => $this->order_statuses->order_status_id,
                'order_status_name' => $this->order_statuses->order_status_name
            ],
        ];
    }
}
