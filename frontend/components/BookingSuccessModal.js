// 'use client';

// export default function BookingSuccessModal({ booking, room, onClose }) {
//   if (!booking) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">

//         <h2 className="text-2xl font-bold text-green-700 mb-3 text-center">
//           Booking Confirmed 🎉
//         </h2>

//         <p className="text-center text-gray-700 mb-4">
//           Your booking is successful.  
//           <strong>Please check your email</strong> for the confirmation details.
//         </p>

//         <div className="space-y-2 text-gray-700 border p-4 rounded-lg">
//           <p><strong>Room:</strong> {room?.title}</p>
//           <p><strong>Booking ID:</strong> {booking?._id}</p>
//           <p><strong>Check-in:</strong> {booking?.checkInDate?.slice(0, 10)}</p>
//           <p><strong>Check-out:</strong> {booking?.checkOutDate?.slice(0, 10)}</p>
//           <p><strong>Total Paid:</strong> ₹{booking?.totalPrice}</p>

//           {booking?.coupon?.code && (
//             <p className="text-green-700">
//               <strong>Coupon Used:</strong> {booking.coupon.code}  
//               ({booking.coupon.discountAmount} OFF)
//             </p>
//           )}
//         </div>

//         <button
//           onClick={onClose}
//           className="w-full mt-5 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-semibold cursor-pointer"
//         >
//           Go to My Bookings
//         </button>
//       </div>
//     </div>
//   );
// }
'use client';
import React from 'react';

export default function BookingSuccessModal({ booking, room, userEmail, open = false, onClose, onGoToBookings }) {
  if (!open || !booking) return null;

  // choose display dates
  const displayCheckIn = booking.startAt ? new Date(booking.startAt).toLocaleString() : (booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '');
  const displayCheckOut = booking.endAt ? new Date(booking.endAt).toLocaleString() : (booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-700 mb-3 text-center">Booking Confirmed 🎉</h2>

        <p className="text-center text-gray-700 mb-4">
          Your booking is successful. <strong>Please check your email</strong> for the confirmation details.
          {userEmail ? <> (sent to <strong>{userEmail}</strong>)</> : null}
        </p>

        <div className="space-y-2 text-gray-700 border p-4 rounded-lg">
          <p><strong>Room:</strong> {room?.title || '—'}</p>
          <p><strong>Booking ID:</strong> {booking?._id || booking?.id || '—'}</p>
          <p><strong>Check-in:</strong> {displayCheckIn}</p>
          <p><strong>Check-out:</strong> {displayCheckOut}</p>
          <p><strong>Guests:</strong> {booking?.numberOfAdult ?? '—'} Adults, {booking?.numberOfChild ?? '—'} Children</p>
          <p><strong>Total Paid:</strong> ₹{(booking?.totalPrice ?? '').toLocaleString ? (booking.totalPrice).toLocaleString('en-IN') : booking?.totalPrice}</p>

          {booking?.coupon?.code && (
            <p className="text-green-700">
              <strong>Coupon Used:</strong> {booking.coupon.code} ({booking.coupon.discountAmount ?? booking.coupon.discountValue} OFF)
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <button
            onClick={onGoToBookings}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-semibold"
          >
            Go to My Bookings
          </button>

          <button
            onClick={onClose}
            className="w-full border rounded-lg py-2 hover:bg-gray-50"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}
