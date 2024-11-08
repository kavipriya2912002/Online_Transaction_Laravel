<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    
    public function handle(Request $request, Closure $next)
    {
       
    if (!Auth::check()) {
        dd('User not logged in');
    }

    if (!Auth::user()->is_admin) {
        dd('User is not admin');
    }

    return $next($request);
    }
}
