<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BuyerRequest extends FormRequest
{
    protected $rules = [
        'buyer_firstname' => 'required',
        'buyer_lastname' => 'required',
        'telephone_number' => 'required',
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
