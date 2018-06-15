<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return  [ 
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'product_description' => $this->product_description,
            'product_price' => $this->product_price,
            'category' => [
                'category_id' => $this->category->category_id,
                'category_name' => $this->category->category_name               
            ],
            'seller' => [
                'seller_id' => $this->seller->seller_id,
                'seller_name' => $this->seller->seller_name
            ],
            'product_status_id' => [
                'product_status_id' => $this->product_status->product_status_id,
                'product_status_name' => $this->product_status->product_status_name
            ]
        ];
    }
}
