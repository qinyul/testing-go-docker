<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\EnsureGatewayRequest;

Route::middleware(EnsureGatewayRequest::class)->group(function(){
    Route::post('login',[AuthController::class,'login']);
    Route::middleware('auth:sanctum')->prefix('users')->group(function(){
        Route::resource('/',UserController::Class);
    });
});

