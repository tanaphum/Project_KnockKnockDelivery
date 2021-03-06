<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SellerRequest extends FormRequest
{
    protected $rules = [
        'seller_name' => 'required',
        'shop_name' => 'required',
        'shop_location' => 'required',
        'shop_type_id' => 'required',
//        'shop_latitude' => 'required',
//        'shop_longitude' => 'required',
        // 'seller_photos' => 'required|array',
        // 'seller_photos.*' => 'required|image|mimes:jpeg,bmp,png|max:7000'
    ];
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        switch ($this->method()) {
            case 'POST':
                return $this->getPostRules();
            case 'PUT':
                return $this->getPutRules();
            default:
                return $this->rules;
        }
    }

    private function getPostRules()
    {
        $rules = $this->rules;

        //เปลี่ยนหรือเพิ่มกฎสำหรับเมธอด Post     
        $rules['user_id'] =  'required';
        return $rules;
    }
    
    private function getPutRules()
    {
        return $this->rules;
    }
    
}
    
