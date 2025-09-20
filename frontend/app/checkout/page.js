'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useAuth();

  const roomId = searchParams.get('roomId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = Number(searchParams.get('adults')) || 1;
  const children = Number(searchParams.get('children')) || 0;

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingLoading, setBookingLoading] = useState(false); // ✅ loader for confirm button

  // Fetch room details
  useEffect(() => {
    if (!roomId) {
      toast.error('Room ID missing');
      router.push('/');
      return;
    }

    async function fetchRoom() {
      try {
        setLoadingRoom(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Room not found');
        setRoom(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load room details');
      } finally {
        setLoadingRoom(false);
      }
    }

    fetchRoom();
  }, [roomId, router]);

  if (loadingRoom || userLoading) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  if (!room) {
    return <p className="text-center mt-10 text-red-600">Room not found.</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-600">Please login to continue booking.</p>;
  }

  // ✅ Calculate nights safely
  const nights = Math.max(
    1,
    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = nights * room.price;

  async function handleBooking() {
    setBookingLoading(true); // ✅ start loader
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: user.id,
          roomId,
          checkInDate,
          checkOutDate,
          numberOfAdult: adults,
          numberOfChild: children,
          totalPrice,
          mobileNumber: user.mobileNumber,
          status: 'confirmed',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Booking confirmed!');
      router.push('/my-bookings');
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false); // ✅ stop loader
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* User Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Your Information</h2>
        <div className="bg-gray-100 p-4 rounded-md space-y-2">
          <p><strong>Full Name:</strong> {user.name}</p>
          <p><strong>Email Address:</strong> {user.email}</p>
          <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Booking Summary</h2>
        <div className="bg-gray-100 p-4 rounded-md space-y-2">
          <p><strong>Room:</strong> {room.title}</p>
          <p><strong>Check-In:</strong> {new Date(checkInDate).toDateString()}</p>
          <p><strong>Check-Out:</strong> {new Date(checkOutDate).toDateString()}</p>
          <p><strong>Adults:</strong> {adults}</p>
          <p><strong>Children:</strong> {children}</p>
          <p><strong>Total Nights:</strong> {nights}</p>
          <p><strong>Total Price:</strong> ₹{totalPrice}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
        <div className="space-y-2">
          {['card', 'upi', 'payAtHotel'].map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              <span>
                {method === 'card'
                  ? 'Credit / Debit Card'
                  : method === 'upi'
                  ? 'UPI'
                  : 'Pay at Hotel'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleBooking}
        disabled={bookingLoading} // ✅ disable while loading
        className={`px-6 py-3 rounded-lg font-semibold w-full ${
          bookingLoading
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
        }`}
      >
        {bookingLoading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </div>
  );
}
