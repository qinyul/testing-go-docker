<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureGatewayRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedToken = env('ACCESS_TOKEN');
        if (!$request->header("x-forwarded-authorization") || 
            $allowedToken !== $request->header("x-forwarded-authorization")){
            return response()->json(['error' => 'Unauthorized Access'],403);
        }
        return $next($request);
    }
}
