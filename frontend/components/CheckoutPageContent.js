// whole code again to redirect to login if not logged in
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();

  const roomId = searchParams.get('roomId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = Number(searchParams.get('adults')) || 1;
  const children = Number(searchParams.get('children')) || 0;

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingLoading, setBookingLoading] = useState(false);

  // ✅ Redirect to login if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) return;
      try {
        setLoadingRoom(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRoom(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingRoom(false);
      }
    }
    fetchRoom();
  }, [roomId]);

  if (loadingRoom || userLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!room) return <p className="text-center mt-10 text-red-600">Room not found.</p>;

  // const nights = Math.max(
  //   1,
  //   (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
  // );
  // const totalPrice = nights * room.price;
  // ✅ Safe local date parser
  const parseLocalDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return null;
    const parts = dateString.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    const [year, month, day] = parts;
    return new Date(year, month - 1, day);
  };

  // ✅ Calculate total nights safely
  let nights = 1; // default
  let checkIn = parseLocalDate(checkInDate);
  let checkOut = parseLocalDate(checkOutDate);

  if (checkIn && checkOut && checkOut > checkIn) {
    const diffDays = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    nights = Math.max(diffDays, 1);
  } else {
    checkIn = null;
    checkOut = null;
  }

  // ✅ Apply discount-aware pricing
  const roomPrice = room.discountedPrice || room.price;
  const totalPrice = nights * roomPrice;

  async function handleBooking() {
    setBookingLoading(true);
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
      setBookingLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* User Info */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Your Information</h2>
        <div className="bg-gray-100 p-4 rounded-md space-y-2">
          <p><strong>Full Name:</strong> {user?.name}</p>
          <p><strong>Email Address:</strong> {user?.email}</p>
          <p><strong>Mobile Number:</strong> {user?.mobileNumber}</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Booking Summary</h2>
        <div className="bg-gray-100 p-4 rounded-md space-y-2">
          <p><strong>Room:</strong> {room.title}</p>
          {/* <p><strong>Check-In:</strong> {new Date(checkInDate).toDateString()}</p>
          <p><strong>Check-Out:</strong> {new Date(checkOutDate).toDateString()}</p> */}
          <p>
            <strong>Check-In:</strong>{' '}
            {checkIn ? checkIn.toDateString() : <span className="text-gray-500">Not selected</span>}
          </p>
          <p>
            <strong>Check-Out:</strong>{' '}
            {checkOut ? checkOut.toDateString() : <span className="text-gray-500">Not selected</span>}
          </p>
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

      <button
        onClick={handleBooking}
        disabled={bookingLoading}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white ${bookingLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          }`}
      >
        {bookingLoading ? 'Processing...' : 'Confirm Booking'}
      </button>
    </div>
  );
}
