// 'use client';
// import { useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';

// export default function BookingModal({ room, onClose }) {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // ✅ Dates from Banner.js search
//   const checkInDate = searchParams.get('checkInDate');
//   const checkOutDate = searchParams.get('checkOutDate');

//   const [adults, setAdults] = useState(1);
//   const [children, setChildren] = useState(0);
//   const [error, setError] = useState('');

//   // ✅ Validation function
//   const validateGuests = (adultsCount, childrenCount) => {
//     if (
//       adultsCount > room.maximumAllowedAdult ||
//       childrenCount > room.maximumAllowedChild
//     ) {
//       setError(
//         `Number of guests exceeds the room’s capacity (${room.maximumAllowedAdult} adults & ${room.maximumAllowedChild} children).`
//       );
//     } else {
//       setError('');
//     }
//   };

//   const handleAdultsChange = (value) => {
//     const newAdults = Number(value);
//     setAdults(newAdults);
//     validateGuests(newAdults, children);
//   };

//   const handleChildrenChange = (value) => {
//     const newChildren = Number(value);
//     setChildren(newChildren);
//     validateGuests(adults, newChildren);
//   };

//   const handleCheckout = () => {
//     if (error) return; // stop if validation fails

//     // ✅ Redirect to checkout with all booking details
//     router.push(
//       `/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`
//     );

//     onClose(); // close modal after proceeding
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//         >
//           ✕
//         </button>

//         <h2 className="text-xl font-bold mb-4">Book {room.title}</h2>

//         {/* Adults Input */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Adults*</label>
//           <input
//             type="number"
//             value={adults}
//             onChange={(e) => handleAdultsChange(e.target.value)}
//             min="1"
//             className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
//           />
//         </div>

//         {/* Children Input */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium mb-1">Children*</label>
//           <input
//             type="number"
//             value={children}
//             onChange={(e) => handleChildrenChange(e.target.value)}
//             min="0"
//             className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
//           />
//         </div>

//         {/* Error Message */}
//         {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//         {/* Checkout Button */}
//         <button
//           onClick={handleCheckout}
//           disabled={!!error || !checkInDate || !checkOutDate}
//           className={`w-full py-2 rounded-lg font-semibold ${
//             error
//               ? 'bg-gray-400 text-white cursor-not-allowed'
//               : 'bg-red-500 text-white hover:bg-red-600'
//           }`}
//         >
//           Proceed To Checkout
//         </button>
//       </div>
//     </div>
//   );
// }












'use client';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BookingModal({ room, onClose, checkInDate: propCheckInDate, checkOutDate: propCheckOutDate }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Use props if passed, otherwise fallback to URL params
  const checkInDate = propCheckInDate || searchParams.get('checkInDate');
  const checkOutDate = propCheckOutDate || searchParams.get('checkOutDate');

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState('');

  // ✅ Validation function
  const validateGuests = (adultsCount, childrenCount) => {
    if (
      adultsCount > room.maximumAllowedAdult ||
      childrenCount > room.maximumAllowedChild
    ) {
      setError(
        `Number of guests exceeds the room’s capacity (${room.maximumAllowedAdult} adults & ${room.maximumAllowedChild} children).`
      );
    } else {
      setError('');
    }
  };

  const handleAdultsChange = (value) => {
    const newAdults = Number(value);
    setAdults(newAdults);
    validateGuests(newAdults, children);
  };

  const handleChildrenChange = (value) => {
    const newChildren = Number(value);
    setChildren(newChildren);
    validateGuests(adults, newChildren);
  };

  const handleCheckout = () => {
    if (error) return; // stop if validation fails

    // ✅ Redirect to checkout with all booking details
    router.push(
      `/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`
    );

    onClose(); // close modal after proceeding
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Book {room.title}</h2>

        {/* Adults Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Adults*</label>
          <input
            type="number"
            value={adults}
            onChange={(e) => handleAdultsChange(e.target.value)}
            min="1"
            className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Children Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Children*</label>
          <input
            type="number"
            value={children}
            onChange={(e) => handleChildrenChange(e.target.value)}
            min="0"
            className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={!!error || !checkInDate || !checkOutDate}
          className={`w-full py-2 rounded-lg font-semibold ${
            error
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}

