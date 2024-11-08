<?php

namespace App\Http;

use App\Http\Middleware\IsAdmin;
use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // Global middleware
    ];

    protected $routeMiddleware = [
        'is_admin' => IsAdmin::class, // Register your middleware here
    ];
}
