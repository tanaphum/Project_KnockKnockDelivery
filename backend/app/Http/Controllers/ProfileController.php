<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource;
use App\Http\Resources\ProfileCollection;
use App\Http\Requests\CreateProfileRequest;
use App\Profile;
use App\User;
use App\Seller;
use App\Buyer;
use App\Deliver;

class ProfileController extends Controller
{
    private $profile;
    private $user;
    private $seller;
    private $buyer;
    private $deliver;

    public function __construct(Profile $profile, User $user, Seller $seller, Buyer $buyer, Deliver $deliver )
    {
        $this->profile = $profile;
        $this->user = $user;
        $this->seller = $seller;
        $this->buyer = $buyer;
        $this->deliver = $deliver;
    }

    public function getProfilesByUserId($user_id)
    {
        if($user_id <= 0)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }        
        
        $user = $this->user->find($user_id);
        
        if (!$user)
            return response()->json(['message' => 'User not found'], 404);

        $profiles = $this->profile->with('role')->where('user_id', $user_id)->get();
        return ProfileResource::collection($profiles);
    }

    public function createProfile(CreateProfileRequest $request)
    {
        $profiles = $this->profile->with('role')->where('user_id', $request->user_id)->get();
        $roleProfileCount = intval($profiles->where('role_id', $request->role_id)->count());

        if( $profiles->count() > 3 || $roleProfileCount > 1 )
        {
            return response()->json('Error', 500);
        }

        $profile = $this->profile->create($request->all());

        if(!$profile)
        {
            return response()->json('Error', 500);
        }

        return response()->json(
            [
                'message' => 'Successfully',
                'result' => $profile
            ],
            201
        );
    }

    public function deleteProfile(DeleteProfileRequest $request ,$profile_id)
    {
        if($profile_id <= 0)
        {
            return response()->json(['message' => 'Bad request'], 400 );
        }

        $role_id = $request->role_id;

        if($role_id === 2)
        {
            $seller = $this->seller->find($profile_id);

            if($seller === null)
            {
                return response()->json(['message' => 'Seller not found'], 404 );
            }

            $profile = $this->profile->find($profile_id);
            if($profile === null)
            {
                return response()->json(['message' => 'Profile not found'], 404 );
            }

            $seller->delete();
            $profile->delete();

            return response()->json(['message' => 'Successfully']); 
        }
        else if ($role_id === 3)
        {
            $buyer = $this->buyer->find($profile_id);

            if($buyer === null)
            {
                return response()->json(['message' => 'Buyer not found'], 404 );
            }

            $profile = $this->profile->find($profile_id);
            if($profile === null)
            {
                return response()->json(['message' => 'Profile not found'], 404 );
            }

            $buyer->delete();
            $profile->delete();

            return response()->json(['message' => 'Successfully']); 
        }
        else if($role_id === 4)
        {
            $deliver = $this->deliver->find($profile_id);

            if($deliver === null)
            {
                return response()->json(['message' => 'Deliver not found'], 404 );
            }

            $profile = $this->profile->find($profile_id);
            if($profile === null)
            {
                return response()->json(['message' => 'Profile not found'], 404 );
            }

            $deliver->delete();
            $profile->delete();

            return response()->json(['message' => 'Successfully']); 
        }
        else
        {
            return response()->json(['message' => 'Role not found']); 
        }
       
    }

}
