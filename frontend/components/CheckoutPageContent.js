// 'use client';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import toast from 'react-hot-toast';

// export default function CheckoutPageContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { user, loading: userLoading } = useAuth();

//   const bookingType = searchParams.get('bookingType') || 'full';
//   const roomId = searchParams.get('roomId');
//   const checkInDate = searchParams.get('checkInDate');
//   const checkOutDate = searchParams.get('checkOutDate');
//   const checkInTime = searchParams.get('checkInTime');
//   const hours = Number(searchParams.get('hours')) || null;
//   const adults = Number(searchParams.get('adults')) || 1;
//   const children = Number(searchParams.get('children')) || 0;

//   const [room, setRoom] = useState(null);
//   const [loadingRoom, setLoadingRoom] = useState(true);
//   const [paymentMethod, setPaymentMethod] = useState('card');
//   const [bookingLoading, setBookingLoading] = useState(false);

//   useEffect(() => {
//     if (!userLoading && !user) router.push('/login');
//   }, [user, userLoading, router]);

//   useEffect(() => {
//     async function fetchRoom() {
//       if (!roomId) return;
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message);
//         setRoom(data);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setLoadingRoom(false);
//       }
//     }
//     fetchRoom();
//   }, [roomId]);

//   if (loadingRoom || userLoading) return <p className="text-center mt-10">Loading...</p>;
//   if (!room) return <p className="text-center mt-10 text-red-600">Room not found.</p>;

//   // ✅ Pricing Logic (Updated for your new hourly formula)
//   const basePrice =
//     room.discountedPrice && room.discountedPrice < room.price
//       ? room.discountedPrice
//       : room.price;

//   let totalPrice = 0;

//   if (bookingType === 'hourly' && hours) {
//     // 🧮 Custom Hourly Formula
//     if (hours <= 3) {
//       totalPrice = basePrice / 4;
//     } else {
//       totalPrice = (basePrice / 4) + ((basePrice / 12) * (hours - 3));
//     }
//     totalPrice = Math.round(totalPrice);
//   } else {
//     // 🏨 Full-day stay pricing
//     const nights = Math.max(
//       1,
//       (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
//     );
//     totalPrice = basePrice * nights;
//   }

//   // ✅ Booking handler
//   async function handleBooking() {
//     setBookingLoading(true);
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           roomId,
//           checkInDate,
//           checkOutDate,
//           bookingType,
//           checkInTime,
//           hours,
//           numberOfAdult: adults,
//           numberOfChild: children,
//           totalPrice,
//           mobileNumber: user.mobileNumber,
//           status: 'confirmed',
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       toast.success('Booking confirmed!');
//       router.push('/my-bookings');
//     } catch (err) {
//       toast.error(err.message || 'Booking failed');
//     } finally {
//       setBookingLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded-lg shadow">
//       <h1 className="text-3xl font-bold mb-6">Checkout</h1>

//       {/* ✅ User Info (unchanged, retained as-is) */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-3">Your Information</h2>
//         <div className="bg-gray-100 p-4 rounded-md space-y-2">
//           <p><strong>Name:</strong> {user?.name}</p>
//           <p><strong>Email:</strong> {user?.email}</p>
//           <p><strong>Mobile:</strong> {user?.mobileNumber}</p>
//         </div>
//       </div>

//       {/* ✅ Booking Summary */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-3">Booking Summary</h2>
//         <div className="bg-gray-100 p-4 rounded-md space-y-2">
//           <p><strong>Room:</strong> {room.title}</p>
//           <p><strong>Mode:</strong> {bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}</p>
//           <p><strong>Check-In:</strong> {checkInDate} {checkInTime || ''}</p>
//           {bookingType === 'hourly' ? (
//             <p><strong>Duration:</strong> {hours} hours</p>
//           ) : (
//             <p><strong>Check-Out:</strong> {checkOutDate}</p>
//           )}
//           <p><strong>Adults:</strong> {adults}</p>
//           <p><strong>Children:</strong> {children}</p>
//           <p><strong>Total Price:</strong> ₹{totalPrice.toLocaleString('en-IN')}</p>
//         </div>
//       </div>

//       {/* ✅ Payment Section */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-3">Payment Method</h2>
//         <div className="space-y-2">
//           {['card', 'upi', 'payAtHotel'].map((method) => (
//             <label key={method} className="flex items-center space-x-2">
//               <input
//                 type="radio"
//                 name="payment"
//                 value={method}
//                 checked={paymentMethod === method}
//                 onChange={() => setPaymentMethod(method)}
//               />
//               <span>
//                 {method === 'card'
//                   ? 'Credit / Debit Card'
//                   : method === 'upi'
//                   ? 'UPI'
//                   : 'Pay at Hotel'}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* ✅ Confirm Button */}
//       <button
//         onClick={handleBooking}
//         disabled={bookingLoading}
//         className={`w-full px-6 py-3 rounded-lg font-semibold text-white ${
//           bookingLoading
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
//         }`}
//       >
//         {bookingLoading ? 'Processing...' : 'Confirm Booking'}
//       </button>
//     </div>
//   );
// }
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();

  const bookingType = searchParams.get('bookingType') || 'full';
  const roomId = searchParams.get('roomId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const checkInTime = searchParams.get('checkInTime');
  const hours = Number(searchParams.get('hours')) || null;
  const adults = Number(searchParams.get('adults')) || 1;
  const children = Number(searchParams.get('children')) || 0;

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) router.push('/login');
  }, [user, userLoading, router]);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) return;
      try {
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

  if (loadingRoom || userLoading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!room) return <p className="text-center mt-10 text-red-600">Room not found.</p>;

  // ✅ Pricing logic
  const basePrice =
    room.discountedPrice && room.discountedPrice < room.price
      ? room.discountedPrice
      : room.price;

  let totalPrice = 0;

  if (bookingType === 'hourly' && hours) {
    if (hours <= 3) {
      totalPrice = basePrice / 4;
    } else {
      totalPrice = basePrice / 4 + (basePrice / 12) * (hours - 3);
    }
    totalPrice = Math.round(totalPrice);
  } else {
    const nights = Math.max(
      1,
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    totalPrice = basePrice * nights;
  }

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
          bookingType,
          checkInTime,
          hours,
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Booking Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Booking Summary</h2>

          <div className="space-y-3 text-gray-700">
            <p><strong>Room:</strong> {room.title}</p>
            <p><strong>Mode:</strong> {bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}</p>
            <p><strong>Check-In:</strong> {checkInDate} {checkInTime && `(${checkInTime})`}</p>
            {bookingType === 'hourly' ? (
              <p><strong>Duration:</strong> {hours} hours</p>
            ) : (
              <p><strong>Check-Out:</strong> {checkOutDate}</p>
            )}
            <p><strong>Guests:</strong> {adults} Adults, {children} Children</p>
          </div>

          {/* Price Card */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl p-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total Amount</span>
              <span className="text-3xl font-bold text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Payment & User Info */}
        <div className="space-y-8">
          {/* User Info */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Your Information</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Mobile:</strong> {user?.mobileNumber}</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Select Payment Method</h2>

            <div className="space-y-3">
              {['card', 'upi', 'payAtHotel'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-all ${
                    paymentMethod === method
                      ? 'border-gray-800 bg-gray-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="accent-gray-800"
                    />
                    <span className="font-medium text-gray-800">
                      {method === 'card'
                        ? 'Credit / Debit Card'
                        : method === 'upi'
                        ? 'UPI (Google Pay, PhonePe, Paytm)'
                        : 'Pay at Hotel'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className={`w-full mt-6 py-3 rounded-lg font-semibold text-white text-lg transition-all ${
                bookingLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-900 shadow-md hover:shadow-lg cursor-pointer'
              }`}
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
