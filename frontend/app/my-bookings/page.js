// 'use client';
// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { MapPin, Calendar, Users } from 'lucide-react';
// import Link from "next/link";
// import slugify from "slugify";

// export default function MyBookingsPage() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [bookingToCancel, setBookingToCancel] = useState(null);

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     async function fetchBookings() {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE}/bookings/user/${user.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//             },
//           }
//         );
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message);
//         setBookings(data);
//       } catch (err) {
//         toast.error(err.message || 'Failed to fetch bookings');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchBookings();
//   }, [user, router]);

//   async function handleCancelBooking(bookingId) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/${bookingId}/cancel`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       toast.success("Booking cancelled successfully!");

//       // Update local state so UI refreshes without reload
//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === bookingId ? { ...b, status: "cancelled" } : b
//         )
//       );
//     } catch (err) {
//       toast.error(err.message || "Failed to cancel booking");
//     }
//   }

//   function canCancelBooking(booking) {
//     const checkIn = new Date(booking.startAt || booking.checkInDate);
//     const diffHours = (checkIn - new Date()) / (1000 * 60 * 60);
//     return diffHours >= 24 && booking.status === "confirmed";
//   }

//   if (loading) return <p className="text-center py-8">Loading bookings...</p>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

//       {bookings.length === 0 ? (
//         <p className="text-gray-600">You don’t have any bookings yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {bookings.map((booking) => {
//             const room = booking.roomId || {};
//             const loc = room?.location || {};

//             // Booking date: prefer createdAt, fallback to ObjectId timestamp if createdAt missing
//             const bookingDate = booking.createdAt
//               ? new Date(booking.createdAt).toLocaleString()
//               : (() => {
//                 try {
//                   const ts = parseInt(booking._id.toString().substring(0, 8), 16) * 1000;
//                   return new Date(ts).toLocaleString();
//                 } catch (e) {
//                   return 'N/A';
//                 }
//               })();

//             // Determine amounts
//             // server may provide: subtotal, totalPrice (final), coupon.discountAmount
//             const finalAmount = Number(booking.totalPrice ?? 0);
//             const couponDiscount = Number(booking.coupon?.discountAmount ?? booking.coupon?.discountAmount === 0 ? booking.coupon.discountAmount : 0);
//             const subtotalFromServer = booking.subtotal ?? null;

//             // compute original amount (best-effort)
//             const originalAmount = subtotalFromServer !== null
//               ? Number(subtotalFromServer)
//               : (couponDiscount > 0 ? (finalAmount + couponDiscount) : finalAmount);

//             const savedAmount = originalAmount - finalAmount;
//             const couponCode = booking.coupon?.code || null;

//             return (
//               <div
//                 key={booking._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition"
//               >
//                 {/* Room Image */}
//                 {room?.images?.[0] ? (
//                   <Link
//                     href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
//                   >
//                     <img
//                       src={room.images[0]}
//                       alt={room.title}
//                       className="w-full h-40 object-cover"
//                     />
//                   </Link>
//                 ) : (
//                   <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
//                     No Image
//                   </div>
//                 )}

//                 {/* Details */}
//                 <div className="p-4">
//                   <div className="flex justify-between items-start gap-4">
//                     <div className="flex-1 min-w-0">
//                       <h2 className="text-lg font-semibold mb-1 truncate">
//                         <Link
//                           href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
//                           className="hover:text-red-500 transition-colors duration-200"
//                         >
//                           {room?.title}
//                         </Link>
//                       </h2>

//                       {/* Full Address */}
//                       <p className="flex items-start text-xs text-gray-600 mb-2">
//                         <MapPin className="h-3 w-3 mr-1 mt-0.5" />
//                         <span className="truncate">
//                           {loc.addressLine1 || ''}{loc.addressLine1 && ', '}
//                           {loc.addressLine2 || ''}{loc.addressLine2 && ', '}
//                           {loc.city || ''}, {loc.state || ''} {loc.pincode ? `- ${loc.pincode}` : ''}
//                         </span>
//                       </p>

//                       {/* Dates block separated into rows to avoid overlap */}
//                       <div className="text-xs text-gray-700 space-y-1 mb-2">
//                         <div className="flex items-center">
//                           <Calendar className="h-3 w-3 mr-2 text-gray-500" />
//                           {booking.bookingType === 'hourly' ? (
//                             <span className="truncate">
//                               {new Date(booking.checkInDate).toLocaleString()} → {new Date(booking.checkOutDate).toLocaleString()}
//                               {booking.durationHours ? ` (${booking.durationHours} hrs)` : ''}
//                             </span>
//                           ) : (
//                             <span>
//                               {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex items-center">
//                           <Calendar className="h-3 w-3 mr-2 text-gray-500" />
//                           <span className="text-gray-600">Booking date:</span>
//                           <span className="ml-2 font-medium text-gray-800 truncate">{bookingDate}</span>
//                         </div>
//                       </div>

//                       {/* Guests */}
//                       <p className="flex items-center text-xs text-gray-700 mb-3">
//                         <Users className="h-3 w-3 mr-2" />
//                         {booking.numberOfAdult} Adults, {booking.numberOfChild} Children
//                       </p>
//                     </div>

//                     {/* Price summary on right */}
//                     <div className="flex-shrink-0 text-right w-36">
//                       {/* Original amount (strike-through) */}
//                       {originalAmount > finalAmount && (
//                         <div className="text-sm text-gray-400 line-through">
//                           ₹{Number(originalAmount).toLocaleString('en-IN')}
//                         </div>
//                       )}

//                       {/* Final amount */}
//                       <div className="text-2xl font-bold text-indigo-600">
//                         ₹{Number(finalAmount).toLocaleString('en-IN')}
//                       </div>

//                       {/* You saved */}
//                       {savedAmount > 0 && (
//                         <div className="text-sm text-green-600 font-medium mt-1">
//                           You saved ₹{Number(savedAmount).toLocaleString('en-IN')}
//                         </div>
//                       )}

//                       {/* Coupon code */}
//                       {couponCode && (
//                         <div className="text-xs text-gray-600 mt-1">
//                           Coupon: <span className="font-medium text-gray-800">{couponCode}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Footer badges and actions */}
//                   <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
//                     <div className="flex items-center gap-2">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
//                           ? 'bg-green-100 text-green-700'
//                           : booking.status === 'cancelled'
//                             ? 'bg-gray-200 text-gray-600'
//                             : 'bg-red-100 text-red-700'
//                           }`}
//                       >
//                         {booking.status}
//                       </span>

//                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
//                         {booking.bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       {canCancelBooking(booking) && (
//                         <button
//                           onClick={() => {
//                             setBookingToCancel(booking._id);
//                             setShowCancelModal(true);
//                           }}
//                           className="text-xs font-semibold text-red-600 hover:underline"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       {/* <span className="text-sm font-bold text-indigo-600">
//                         ₹{finalAmount.toLocaleString('en-IN')}
//                       </span> */}
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       {/* Cancel Confirmation Modal */}
//       {showCancelModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center">
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">Cancel Booking?</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Are you sure you want to cancel this booking? This action cannot be undone.
//             </p>

//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
//               >
//                 No, Keep It
//               </button>
//               <button
//                 onClick={() => {
//                   handleCancelBooking(bookingToCancel);
//                   setShowCancelModal(false);
//                 }}
//                 className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition cursor-pointer"
//               >
//                 Yes, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Users } from 'lucide-react';
import Link from "next/link";
import slugify from "slugify";

export default function MyBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchBookings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/bookings/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBookings(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user, router]);

  async function handleCancelBooking(bookingId) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Booking cancelled successfully!");

      // Update local state so UI refreshes without reload
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      toast.error(err.message || "Failed to cancel booking");
    }
  }

  function canCancelBooking(booking) {
    const checkIn = new Date(booking.startAt || booking.checkInDate);
    const diffHours = (checkIn - new Date()) / (1000 * 60 * 60);
    return diffHours >= 24 && booking.status === "confirmed";
  }

  if (loading) return <p className="text-center py-8">Loading bookings...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">You don’t have any bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const room = booking.roomId || {};
            const loc = room?.location || {};

            // Booking date: prefer createdAt, fallback to ObjectId timestamp if createdAt missing
            const bookingDate = booking.createdAt
              ? new Date(booking.createdAt).toLocaleString()
              : (() => {
                try {
                  const ts = parseInt(booking._id.toString().substring(0, 8), 16) * 1000;
                  return new Date(ts).toLocaleString();
                } catch (e) {
                  return 'N/A';
                }
              })();

            // Determine amounts
            // Amounts coming DIRECTLY from server
            const actualAmount = Number(booking.subtotal ?? booking.totalPrice ?? 0);
            const finalAmount = Number(booking.totalPrice ?? 0);

            const roomDiscountAmount = Number(booking.roomDiscountAmount ?? 0);
            const couponDiscountAmount = Number(booking.coupon?.discountAmount ?? 0);

            const savedAmount = roomDiscountAmount + couponDiscountAmount;
            const couponCode = booking.coupon?.code || null;

            const hasDiscount = savedAmount > 0;


            return (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition"
              >
                {/* Room Image */}
                {room?.images?.[0] ? (
                  <Link
                    href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
                  >
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-40 object-cover"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold mb-1 truncate">
                        <Link
                          href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
                          className="hover:text-red-500 transition-colors duration-200"
                        >
                          {room?.title}
                        </Link>
                      </h2>

                      {/* Full Address */}
                      <p className="flex items-start text-xs text-gray-600 mb-2">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                        <span className="truncate">
                          {loc.addressLine1 || ''}{loc.addressLine1 && ', '}
                          {loc.addressLine2 || ''}{loc.addressLine2 && ', '}
                          {loc.city || ''}, {loc.state || ''} {loc.pincode ? `- ${loc.pincode}` : ''}
                        </span>
                      </p>

                      {/* Dates block separated into rows to avoid overlap */}
                      <div className="text-xs text-gray-700 space-y-1 mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2 text-gray-500" />
                          {booking.bookingType === 'hourly' ? (
                            <span className="truncate">
                              {new Date(booking.checkInDate).toLocaleString()} → {new Date(booking.checkOutDate).toLocaleString()}
                              {booking.durationHours ? ` (${booking.durationHours} hrs)` : ''}
                            </span>
                          ) : (
                            <span>
                              {new Date(booking.checkInDate).toLocaleDateString()} → {new Date(booking.checkOutDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="text-gray-600">Booking date:</span>
                          <span className="ml-2 font-medium text-gray-800 truncate">{bookingDate}</span>
                        </div>
                      </div>

                      {/* Guests */}
                      <p className="flex items-center text-xs text-gray-700 mb-3">
                        <Users className="h-3 w-3 mr-2" />
                        {booking.numberOfAdult} Adults, {booking.numberOfChild} Children
                      </p>
                    </div>

                    {/* Price summary on right */}
                    <div className="flex-shrink-0 text-right w-36">
                      {/* Original amount (strike-through) */}
                      {hasDiscount && (
                        <div className="text-sm text-gray-400 line-through">
                          ₹{actualAmount.toLocaleString('en-IN')}
                        </div>
                      )}

                      {/* Final amount */}
                      <div className="text-2xl font-bold text-indigo-600">
                        ₹{Number(finalAmount).toLocaleString('en-IN')}
                      </div>

                      {/* You saved */}
                      {savedAmount > 0 && (
                        <div className="text-sm text-green-600 font-medium mt-1">
                          You saved ₹{savedAmount.toLocaleString('en-IN')}
                        </div>
                      )}

                      {/* Coupon code */}
                      {couponCode && (
                        <div className="text-xs text-gray-600 mt-1">
                          Coupon: <span className="font-medium text-gray-800">{couponCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer badges and actions */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'cancelled'
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {booking.status}
                      </span>

                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {booking.bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {canCancelBooking(booking) && (
                        <button
                          onClick={() => {
                            setBookingToCancel(booking._id);
                            setShowCancelModal(true);
                          }}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                      {/* <span className="text-sm font-bold text-indigo-600">
                        ₹{finalAmount.toLocaleString('en-IN')}
                      </span> */}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Cancel Booking?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={() => {
                  handleCancelBooking(bookingToCancel);
                  setShowCancelModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white transition cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
