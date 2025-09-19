<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $accessToken = $request->bearerToken();

        if (!$accessToken) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Access token not provided'
            ], 401);
        }

        try {
            // Attempt to authenticate the user using the access token
            $user = JWTAuth::setToken($accessToken)->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error'   => true,
                    'message' => 'User not found'
                ], 401);
            }

            // Set the user object and userId attribute for controller usage
            $request->attributes->set('user', $user);
            $request->attributes->set('userId', $user->UserID);

            return $next($request);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Access token expired'
            ], 401);
        } catch (TokenInvalidException | JWTException $e) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Invalid access token'
            ], 401);
        }
    }
}
