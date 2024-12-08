<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ItemController;
use App\Http\Controllers\API\BookingController;
use App\Http\Controllers\API\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum'])->group(function () {
    Route::get('profile', [AuthController::class, 'profile']);
    Route::put('profile', [AuthController::class, 'updateProfile']);
    Route::delete('profile', [AuthController::class, 'deleteProfile']);
    Route::post('add-item', [ItemController::class, 'store']);
    Route::put('items/{id}', [ItemController::class, 'update']);
    Route::delete('items/{id}', [ItemController::class, 'destroy']);
    Route::get('menu', [ItemController::class, 'index']);

    Route::post('book-table', [BookingController::class, 'bookTable']);
    Route::get('my-bookings', [BookingController::class, 'index']);
    Route::put('bookings/{id}', [BookingController::class, 'update']);
    Route::delete('bookings/{id}', [BookingController::class, 'destroy']);
});

Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'admin'])->group(function () {
    Route::get('users', [AdminController::class, 'getAllUsers']);
    Route::get('bookings', [AdminController::class, 'getAllBookings']);
    Route::put('users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
    Route::put('bookings/{id}', [AdminController::class, 'updateBooking']);
    Route::delete('bookings/{id}', [AdminController::class, 'deleteBooking']);
});
