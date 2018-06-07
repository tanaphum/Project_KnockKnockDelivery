<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Buyer;
use App\Profile;
use App\Http\Resources\BuyerResource as BuyerResource;
use App\Http\Resources\BuyerCollection;

class BuyerController extends Controller
{
    private $buyer;
    private $profile;

    public function __construct(Buyer $buyer, Profile $profile)
    {
        $this->buyer = $buyer;
        $this->profile = $profile;
    }

    public function getBuyers()
    {
        $buyers = $this->buyer->all();

        return BuyerResource::collection($buyers);
    }

    public function getBuyerByProfileId($profile_id)
    {
        if($profile_id <= 0)
        {
            return response()->json('Bad Request', 400);
        }

        $buyer = $this->buyer->with('status')->where('profile_id', $profile_id)->get();
        if($buyer->isEmpty())
        {
            return response()->json('Seller not found', 404);
        }
    
        return Buyer::collection($buyer);
    }

    public function createBuyer(BuyerRequest $request)
    {
        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 2)->count();
        if($checkRole > 0)
        {
            return response()->json([
                'message' => 'this role already exists in your profiles'
            ], 400 );
        }

        $profile = new Profile();
        $profile->user_id = $request->user_id;
        $profile->role_id = 3;

        $profile->save();

        $buyer = new Buyer();
        $buyer->buyer_firstname = $request->buyer_firstname;
        $buyer->buyer_lastname = $request->buyer_lastname;
        $buyer->telephone_number = $request->telephone_number;
        $buyer->status_id = 1;
        $buyer->profile_id = $profile->profile_id;

        $buyer->save();

        return response()->json(
            [
                'message' => 'Successfully',
                'result' => $buyer
            ], 
            201
        );
    }

    public function updateBuyer($buyer_id ,Request $request)
    {
        if($buyer_id < 0)
        {
            return response()->json('Error', 400);
        }

        $buyer = Buyer::where('buyer_id',$buyer_id)->first();

        if(!$buyer)
        {
            return response()->json('Buyer not found', 404);
        }

        $buyer->buyer_firstname = $request->input('buyer_firstname');
        $buyer->buyer_lastname = $request->input('buyer_lastname');
        $buyer->telephone_number = $request->input('telephone_number');
        $buyer->status_id = $request->input('status_id');
        $buyer->save();

        return response()->json(
            [
                'message' => 'Successfully',
                'result' => $buyer
            ]
        );
    }
}


