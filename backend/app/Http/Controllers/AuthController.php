<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;

class AuthController extends Controller
{
    private $user;

    public function __construct(User $user)
    {
        $this->middleware('auth:api', ['except' => ['login', 'signup', 'logout']]);
        $this->user = $user;
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Wrong email or password'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function signup(Request $request)
    {
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
            'identity_no' => 'required|size:13',
            'telephone_number' => 'required|min:9|max:10',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|max:20|confirmed'
        ]);

        $this->user->create($request->all());
        return $this->login($request);
    }


    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function editUser(Request $request, $user_id)
    {
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
            'identity_no' => 'required|size:13',
            'telephone_number' => 'required|min:9|max:10',
        ]);

        $user = $this->user->where('user_id', $user_id)->first();
        if($user === null)
        {
            return response()->json(['message' => 'User not found'],400);
        }

        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->identity_no = $request->identity_no;
        $user->telephone_number = $request->telephone_number;

        $user->save();
        return response()->json([
            'user' => $user
        ],200);;
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60 * 24,
            'user' => auth()->user()
        ]);
    }
}
