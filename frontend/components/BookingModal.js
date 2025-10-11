// 'use client';
// import { useState } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';

// export default function BookingModal({ room, onClose }) {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // ✅ Try to read dates from URL
//   const initialCheckIn = searchParams.get('checkInDate') || '';
//   const initialCheckOut = searchParams.get('checkOutDate') || '';

//   const [step, setStep] = useState(initialCheckIn && initialCheckOut ? 'guests' : 'dates');
//   const [checkInDate, setCheckInDate] = useState(initialCheckIn);
//   const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);

//   const [adults, setAdults] = useState(1);
//   const [children, setChildren] = useState(0);
//   const [error, setError] = useState('');
//     // ✅ Get today's date in yyyy-mm-dd format
//   const today = new Date().toISOString().split('T')[0];

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

//   const handleNextStep = () => {
//     if (!checkInDate || !checkOutDate) return;
//     setStep('guests');
//   };

//   const handleCheckout = () => {
//     if (error) return;

//     router.push(
//       `/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`
//     );
//     onClose();
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

//         {step === 'dates' && (
//           <>
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Check-In Date*</label>
//               <input
//                 type="date"
//                 min={today} // ✅ prevent past dates
//                 value={checkInDate}
//                 onChange={(e) => setCheckInDate(e.target.value)}
//                 className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Check-Out Date*</label>
//               <input
//                 type="date"
//                 value={checkOutDate}
//                 onChange={(e) => setCheckOutDate(e.target.value)}
//                  min={checkInDate || today} // ✅ prevent before check-in date
//                 className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
//               />
//             </div>

//             <button
//               onClick={handleNextStep}
//               className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 cursor-pointer"
//             >
//               Next
//             </button>
//           </>
//         )}

//         {step === 'guests' && (
//           <>
//             {/* Adults Input */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Adults*</label>
//               <input
//                 type="number"
//                 value={adults}
//                 onChange={(e) => handleAdultsChange(e.target.value)}
//                 min="1"
//                 className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
//               />
//             </div>

//             {/* Children Input */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium mb-1">Children*</label>
//               <input
//                 type="number"
//                 value={children}
//                 onChange={(e) => handleChildrenChange(e.target.value)}
//                 min="0"
//                 className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
//               />
//             </div>

//             {/* Error Message */}
//             {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//             {/* Checkout Button */}
//             <button
//               onClick={handleCheckout}
//               disabled={!!error || !checkInDate || !checkOutDate}
//               className={`w-full py-2 rounded-lg font-semibold ${
//                 error
//                   ? 'bg-gray-400 text-white cursor-not-allowed'
//                   : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
//               }`}
//             >
//               Proceed To Checkout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import { Plus, Minus } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function BookingModal({ room, onClose }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Initialize from URL or fallback to today → tomorrow
  const initialStart = searchParams.get('checkInDate')
    ? new Date(searchParams.get('checkInDate'))
    : new Date();
  const initialEnd = searchParams.get('checkOutDate')
    ? new Date(searchParams.get('checkOutDate'))
    : addDays(new Date(), 1);

  const [dateRange, setDateRange] = useState([
    { startDate: initialStart, endDate: initialEnd, key: 'selection' },
  ]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarRef = useRef(null);

  // ✅ Close calendar if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  // ✅ Validation
  useEffect(() => {
    if (
      adults > room.maximumAllowedAdult ||
      children > room.maximumAllowedChild
    ) {
      setError(
        `Exceeds room capacity (${room.maximumAllowedAdult} adults & ${room.maximumAllowedChild} children)`
      );
    } else {
      setError('');
    }
  }, [adults, children, room]);

  const handleCheckout = () => {
    if (error) return;
    const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd');
    const endDate = format(dateRange[0].endDate, 'yyyy-MM-dd');

    router.push(
      `/checkout?roomId=${room._id}&checkInDate=${startDate}&checkOutDate=${endDate}&adults=${adults}&children=${children}`
    );
    onClose();
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

        {/* Date Picker */}
        <div className="mb-4 relative" ref={calendarRef}>
          <label className="block text-sm font-medium mb-1">Dates</label>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-3 py-2 border rounded text-left bg-gray-100"
          >
            {`${format(dateRange[0].startDate, 'dd/MM/yyyy')} → ${format(
              dateRange[0].endDate,
              'dd/MM/yyyy'
            )}`}
          </button>
          {showCalendar && (
            <div className="mt-4 w-full">
              <div className="bg-white shadow-lg rounded p-2 w-full sm:w-[340px] mx-auto">
                <DateRange
                  ranges={dateRange}
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  minDate={new Date()}
                  className="text-black w-full"
                />
                {/* ✅ Done Button Below Calendar */}
                <div className="p-2 text-right">
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Adults & Children */}
        <div className="flex gap-2 mb-4">
          {/* Adults */}
          <div className="flex flex-col w-1/2">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Adults
            </label>
            <div className="flex items-center justify-between border rounded px-2 h-[44px]">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="px-2 text-gray-600 hover:text-black"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(adults + 1)}
                className="px-2 text-gray-600 hover:text-black"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex flex-col w-1/2">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Children
            </label>
            <div className="flex items-center justify-between border rounded px-2 h-[44px]">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="px-2 text-gray-600 hover:text-black"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(children + 1)}
                className="px-2 text-gray-600 hover:text-black"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {/* Checkout */}
        <button
          onClick={handleCheckout}
          disabled={!!error}
          className={`w-full py-2 rounded-lg font-semibold ${error
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gray-700 hover:bg-gray-800 text-white cursor-pointer'
            }`}
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
