<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\BuyerRequest;
use App\Http\Resources\BuyerResource as BuyerResource;
use App\Profile;
use App\User;
use App\Buyer;

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

    public function getBuyerByProfileId($profile_id)
    {
        if ($profile_id <= 0) {
            return response()->json('Bad Request', 400);
        }

        $buyer = $this->buyer->with('profile_status')->where('profile_id', $profile_id)->get();
        if ($buyer->isEmpty()) {
            return response()->json(['message' => 'Buyer not found'], 404);
        }

        return BuyerResource::collection($buyer);
    }

    public function createBuyer(Request $request)
    {
        $this->validate($request, [
            'buyer_address' => 'required|max:199',
            'user_id' => 'required',
        ]);

        $user = $this->user->find($request->user_id);
        if ($user === null) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 3)->count();
        if ($checkRole > 0) {
            return response()->json([
                'message' => 'this role already exists in your profiles',
            ], 400);
        }

        $profile = new Profile;
        $profile->user_id = $request->user_id;
        $profile->role_id = 3;

        $profile->save();

        $buyer = new Buyer;
        $buyer->buyer_address = $request->buyer_address;
        $buyer->profile_status_id = 1;
        $buyer->profile_id = $profile->profile_id;

        $saveBuyer = $buyer->save();
        if (!$saveBuyer) {
            $profile->delete();
            return response()->json(['message' => 'Bad Request'], 400);
        } else {
            $saveBuyer;
        }

        return response()->json(['result' => $buyer]);
    }

    public function updateBuyer(Request $request, $buyer_id)
    {
        $this->validate($request, [
            'buyer_address' => 'required|max:199'
        ]);

        $buyer = $this->buyer->where('buyer_id', $buyer_id)->first();
        if ($buyer === null) {
            return response()->json(['message' => 'Buyer not found'], 404);
        }

        $buyer->buyer_address = $request->buyer_address;

        $buyer->save();

        return response()->json(['result' => $buyer]);
    }
}
