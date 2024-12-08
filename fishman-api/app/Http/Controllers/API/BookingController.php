<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::where('user_id', $request->user()->id)->get();
        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $booking = $this->createBooking($request);
        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking]);
    }

    public function bookTable(Request $request)
    {
        $booking = $this->createBooking($request);
        return response()->json(['message' => 'Table booked successfully', 'booking' => $booking]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'date' => 'required|date',
            'time' => 'required',
            'guests' => 'required|integer|min:1',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update($validated);

        return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking]);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }

    private function createBooking(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:20',
            'date' => 'required|date',
            'time' => 'required',
            'guests' => 'required|integer|min:1',
        ]);

        return Booking::create([
            'user_id' => $request->user()->id,
            'username' => $validated['username'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'guests' => $validated['guests'],
        ]);
    }
}
