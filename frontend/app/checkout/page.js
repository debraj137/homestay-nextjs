'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const roomId = searchParams.get('roomId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = Number(searchParams.get('adults'));
  const children = Number(searchParams.get('children'));

  const [room, setRoom] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Fetch room details
  useEffect(() => {
    if (!roomId) return;
    async function fetchRoom() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRoom(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load room details');
      }
    }
    fetchRoom();
  }, [roomId]);

  if (!room || !user) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  // Calculate total nights
  const nights =
    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);

  // Calculate price
  const totalPrice = nights * room.price;

  async function handleBooking() {
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
          mobileNumber: user.mobileNumber || 'N/A',
          status: 'confirmed',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Booking confirmed!');
      router.push('/my-bookings'); // redirect user to booking history
    } catch (err) {
      toast.error(err.message || 'Booking failed');
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
          <p><strong>Mobile Number:</strong> {user.mobileNumber || 'N/A'}</p>
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
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
            />
            <span>Credit / Debit Card</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={() => setPaymentMethod('upi')}
            />
            <span>UPI</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="payAtHotel"
              checked={paymentMethod === 'payAtHotel'}
              onChange={() => setPaymentMethod('payAtHotel')}
            />
            <span>Pay at Hotel</span>
          </label>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleBooking}
        className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
      >
        Confirm Booking
      </button>
    </div>
  );
}
