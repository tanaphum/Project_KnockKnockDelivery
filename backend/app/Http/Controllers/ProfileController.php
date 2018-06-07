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

class ProfileController extends Controller
{
    private $profile;
    private $user;

    public function __construct(Profile $profile, User $user)
    {
        $this->profile = $profile;
        $this->user = $user;
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


}
