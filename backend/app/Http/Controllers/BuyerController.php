<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Buyer;
use App\Profile;
use App\User;
use App\Http\Resources\BuyerResource as BuyerResource;
use App\Http\Resources\BuyerCollection;
use App\Http\Requests\BuyerRequest;

class BuyerController extends Controller
{
    private $buyer;
    private $profile;
    private $user;

    public function __construct(Buyer $buyer, Profile $profile, User $user)
    {
        $this->buyer = $buyer;
        $this->profile = $profile;
        $this->user = $user;
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

        $buyer = $this->buyer->with('profile_status')->where('profile_id', $profile_id)->get();
        if($buyer->isEmpty())
        {
            return response()->json(['message' => 'Buyer not found'], 404);
        }
    
        return BuyerResource::collection($buyer);
    }

    public function createBuyer(BuyerRequest $request)
    {
        $user = $this->user->find($request->user_id);
        if($user === null)
        {
            return response()->json([
                'message' => 'User not found'
            ], 404 );
        }

        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 3)->count();
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
        $buyer->profile_status_id = 1;
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

    public function updateBuyer(BuyerRequest $request, $buyer_id)
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

        $buyer->buyer_firstname = $request->buyer_firstname;
        $buyer->buyer_lastname = $request->buyer_lastname;
        $buyer->telephone_number = $request->telephone_number;
        
        if ($request->profile_status_id == null)
        {
            $buyer->profile_status_id = 1;
        }
        else
        {
            $buyer->profile_status_id = $request->profile_status_id;
        }

        $buyer->save();

        return response()->json(
            [
                'message' => 'Successfully',
                'result' => $buyer
            ]
        );
    }
}


