<?php

namespace App\Http\Controllers;

use App\Http\Resources\DeliverResource as DeliverResource;
use App\Http\Requests\DeliverRequest;
use App\Profile;
use App\Deliver;
use App\User;

class DeliverController extends Controller
{
    private $deliver;
    private $profile;
    private $user;

    public function __construct(Deliver $deliver, Profile $profile, User $user)
    {
        $this->deliver = $deliver;
        $this->profile = $profile;
        $this->user = $user;
    }

    public function getDelivers()
    {
        $delivers = $this->deliver->all();

        return DeliverResource::collection($delivers);
    }

    public function getDeliverByProfileId($profile_id)
    {
        if($profile_id <= 0)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }

        $deliver = $this->deliver->with('profile_status','profile')->where('profile_id', $profile_id)->get();
        if($deliver->isEmpty())
        {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        return DeliverResource::collection($deliver);
    }

    public function createDeliver(DeliverRequest $request)
    {
        $user = $this->user->find($request->user_id);
        if($user === null)
        {
            return response()->json([
                'message' => 'User not found'
            ], 404 );
        }
        
        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 4)->count();
        if($checkRole > 0)
        {
            return response()->json([
                'message' => 'this role already exists in your profiles'
            ], 400 );
        }

        $profile = new Profile();
        $profile->user_id = $request->user_id;
        $profile->role_id = 4;

        $profile->save();

        $deliver = new Deliver();
        $deliver->deliver_firstname = $request->deliver_firstname;
        $deliver->deliver_lastname = $request->deliver_lastname;
        $deliver->dateOfBirth = date($request->dateOfBirth);
        $deliver->telephone_number = $request->telephone_number;
        $deliver->profile_status_id = 1;
        $deliver->profile_id = $profile->profile_id;

        $saveDeliver = $deliver->save();
        if(!$saveDeliver)
        {
            $profile->delete();
            return response()->json(['message' =>'Bad Request'], 400);
        }
        else
        {
            $saveDeliver;
        }

        return response()->json([
            'message' => 'Successfully',
            'result' => $deliver
        ]);
    }

    public function updateDeliver(DeliverRequest $request, $deliver_id)
    {
        $deliver = $this->deliver->where('deliver_id', $deliver_id)->first();

        if($deliver->count() == 0)
        {
            return response()->json(['message'=>'Deliver not found'], 404);
        }

        $deliver->deliver_firstname = $request->deliver_firstname;
        $deliver->deliver_lastname = $request->deliver_lastname;
        $deliver->dateOfBirth = date($request->dateOfBirth);
        $deliver->telephone_number = $request->telephone_number;
        if ($request->profile_status_id == null)
        {
            $deliver->profile_status_id = 1;
        }
        else
        {
            $deliver->profile_status_id = $request->profile_status_id;
        }

        $deliver->save();

        return response()->json([
            'message' => 'Successfully',
            'result' => $deliver
        ]);
    }

}
