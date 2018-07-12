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
            'seller' => [
                'seller_id' => $this->seller->seller_id,
                'shop_name' => $this->seller->shop_name,
                'shop_location' => $this->seller->shop_location,
                'shop_logo_image' => "/storage/seller/".$this->seller->shop_logo_image
            ],
            'product_category' => [
                'product_category_id' => $this->product_category->product_category_id,
                'product_category_name' => $this->product_category->product_category_name
            ],
            'product_status' => [
                'product_status_id' => $this->product_status->product_status_id,
                'product_status_name' => $this->product_status->product_status_name
            ],
            'product_image_1' => "/storage/product/".$this->product_image_1,
            'product_image_2' => "/storage/product/".$this->product_image_2,
            'product_image_3' => "/storage/product/".$this->product_image_3,
        ];
    }
}
