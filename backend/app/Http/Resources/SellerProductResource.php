<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SellerProductResource extends JsonResource
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
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_description' => $this->product_description,
            'product_price' => $this->product_price,
            'unit_in_stock' => $this->unit_in_stock,
            'category' => [
                'category_id' => $this->category->category_id,
                'category_name' => $this->category->category_name               
            ],
            'product_status_id' => [
                'product_status_id' => $this->product_status->product_status_id,
                'product_status_name' => $this->product_status->product_status_name
            ]
        ];
    }
}
