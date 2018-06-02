<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProfileResource as ProfileResource;
use App\Http\Resources\ProfileCollection;
use App\Http\Requests\CreateProfileRequest;
use App\Profile;
use App\User;
use App\Role;

class ProfileController extends Controller
{
    public function profilesList($user_id)
    {
        $user = User::find($user_id);

        if (!$user)
            return response()->json(['message' => 'User not found'], 404);

        $profiles = Profile::with('role')->where('user_id', $user_id)->get();
        return ProfileResource::collection($profiles);
    }

    public function createProfile(CreateProfileRequest $request)
    {
        Profile::create($request->all());

        return response()->json(['message' => 'Profile created'], 201);
    }
}
