// 'use client';
// import slugify from "slugify"; 
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Filters from '@/components/Filters';
// import BookingModal from '@/components/BookingModal';
// import toast from 'react-hot-toast';
// import { ChevronLeft, ChevronRight } from "lucide-react"; // icons

// // ✅ Child component for each room card
// function RoomCard({ room, city, checkInDate, checkOutDate, searchParams }) {
//   const [currentImage, setCurrentImage] = useState(0);

//   const nextImage = () => {
//     setCurrentImage((prev) =>
//       prev === room.images.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImage((prev) =>
//       prev === 0 ? room.images.length - 1 : prev - 1
//     );
//   };

//   return (
//     <div
//       key={room._id}
//       className="flex flex-col md:flex-row bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
//     >
//       {/* Image Carousel */}
//       <div className="relative w-full md:w-1/3 h-[268px]">
//         {room.images?.length > 0 ? (
//           <img
//             src={room.images[currentImage]}
//             alt={room.title}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
//             No Image
//           </div>
//         )}

//         {/* Arrows */}
//         {room.images?.length > 1 && (
//           <>
//             <button
//               onClick={prevImage}
//               className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={nextImage}
//               className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </>
//         )}

//         {/* Dots */}
//         {room.images?.length > 1 && (
//           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
//             {room.images.map((_, idx) => (
//               <span
//                 key={idx}
//                 className={`w-2 h-2 rounded-full ${
//                   idx === currentImage ? "bg-white" : "bg-gray-400"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Details */}
//       <div className="flex-1 p-5 flex flex-col justify-between">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">
//             {room.title}
//           </h2>
//           <p className="text-sm text-gray-500">
//             {room.location?.city}, {room.location?.state}
//           </p>

//           {/* ⭐ Rating */}
//           <div className="flex items-center mt-2">
//             <span className="text-yellow-500 text-lg">★</span>
//             <span className="ml-1 text-sm font-semibold">
//               {room.averageRating ?? 0}
//             </span>
//             <span className="ml-1 text-xs text-gray-500">
//               ({room.totalReviews ?? 0} reviews)
//             </span>
//           </div>

//           {/* Price */}
//           <p className="text-red-600 font-bold text-lg mt-3">
//             ₹{room.price}{' '}
//             <span className="text-sm text-gray-500">/ night</span>
//           </p>

//           {/* Amenities */}
//           {room.amenities?.length > 0 && (
//             <div className="flex flex-wrap gap-2 mt-3">
//               {room.amenities.slice(0, 5).map((a, idx) => (
//                 <span
//                   key={idx}
//                   className="px-3 py-1 text-xs bg-gray-200 border border-gray-200 rounded-full text-gray-700"
//                 >
//                   {a}
//                 </span>
//               ))}
//               {room.amenities.length > 5 && (
//                 <span className="text-xs text-gray-500">
//                   +{room.amenities.length - 5} more
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="mt-5 flex flex-col sm:flex-row gap-3">
//           <a
//             href={`/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}`}
//             className="flex-1 text-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
//           >
//             Book Now
//           </a>
//           <a
//             href={`/rooms/${slugify(room.title, { lower: true })}/${room._id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}`}
//             className="flex-1 text-center border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 font-semibold"
//           >
//             View Details
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function SearchPageContent() {
//   const searchParams = useSearchParams();
//   const city = searchParams.get('city');
//   const checkInDate = searchParams.get('checkInDate');
//   const checkOutDate = searchParams.get('checkOutDate');
//   const adults = searchParams.get('adults');
//   const children = searchParams.get('children');

//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedRoom, setSelectedRoom] = useState(null);

//   useEffect(() => {
//     async function fetchInitial() {
//       if (!city || !checkInDate || !checkOutDate) {
//         setRooms([]);
//         return;
//       }
//       try {
//         setLoading(true);
//         const query = new URLSearchParams({ city, checkInDate, checkOutDate, adults, children });
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE}/rooms/search?${query.toString()}`
//         );
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Failed to fetch rooms');
//         setRooms(data);
//       } catch (err) {
//         toast.error(err.message || 'Failed to fetch rooms');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchInitial();
//   }, [city, checkInDate, checkOutDate, adults, children]);

//   async function handleFilterApply(filters) {
//     try {
//       setLoading(true);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           maxPrice: filters.maxPrice ?? null,
//           amenities: filters.amenities ?? [],
//           minRating: filters.minRating ?? null,
//           city,
//           checkInDate,
//           checkOutDate,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to apply filters');
//       setRooms(data);
//     } catch (err) {
//       toast.error(err.message || 'Failed to apply filters');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* Sidebar */}
//       <div className="md:col-span-1">
//         <Filters onApply={handleFilterApply} />
//       </div>

//       {/* Results */}
//       <div className="md:col-span-3">
//         <h1 className="text-2xl font-bold mb-6">
//           Stays in {city ?? 'Selected City'}{' '}
//           {checkInDate && checkOutDate ? ` — ${checkInDate} to ${checkOutDate}` : ''}
//         </h1>

//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : rooms.length === 0 ? (
//           <p className="text-gray-600">No rooms available for your search.</p>
//         ) : (
//           <div className="space-y-6">
//             {rooms.map((room) => (
//               <RoomCard
//                 key={room._id}
//                 room={room}
//                 city={city}
//                 checkInDate={checkInDate}
//                 checkOutDate={checkOutDate}
//                 searchParams={searchParams}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {selectedRoom && (
//         <BookingModal
//           room={selectedRoom}
//           checkInDate={checkInDate}
//           checkOutDate={checkOutDate}
//           onClose={() => setSelectedRoom(null)}
//         />
//       )}
//     </div>
//   );
// }

'use client';
import slugify from "slugify"; 
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Filters from '@/components/Filters';
import BookingModal from '@/components/BookingModal';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from "lucide-react"; // icons

// ✅ Child component for each room card
function RoomCard({ room, city, checkInDate, checkOutDate, searchParams }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === room.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  return (
    <div
      key={room._id}
      className="flex flex-col md:flex-row bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
    >
      {/* Image Carousel */}
      <div className="relative w-full md:w-1/3 h-[268px]">
        {room.images?.length > 0 ? (
          <img
            src={room.images[currentImage]}
            alt={room.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {/* Arrows */}
        {room.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        {room.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {room.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentImage ? "bg-white" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {room.title}
          </h2>
          <p className="text-sm text-gray-500">
            {room.location?.city}, {room.location?.state}
          </p>

          {/* ⭐ Rating */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="ml-1 text-sm font-semibold">
              {room.averageRating ?? 0}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({room.totalReviews ?? 0} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-red-600 font-bold text-lg mt-3">
            ₹{room.price}{' '}
            <span className="text-sm text-gray-500">/ night</span>
          </p>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {room.amenities.slice(0, 5).map((a, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs bg-gray-200 border border-gray-200 rounded-full text-gray-700"
                >
                  {a}
                </span>
              ))}
              {room.amenities.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{room.amenities.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a
            href={`/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}`}
            className="flex-1 text-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
          >
            Book Now
          </a>
          <a
            href={`/rooms/${slugify(room.title, { lower: true })}/${room._id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}`}
            className="flex-1 text-center border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 font-semibold"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ✅ New state for property search
  const [propertyQuery, setPropertyQuery] = useState("");

  useEffect(() => {
    async function fetchInitial() {
      if (!city || !checkInDate || !checkOutDate) {
        setRooms([]);
        return;
      }
      try {
        setLoading(true);
        const query = new URLSearchParams({ city, checkInDate, checkOutDate, adults, children });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/rooms/search?${query.toString()}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch rooms');
        setRooms(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    }

    fetchInitial();
  }, [city, checkInDate, checkOutDate, adults, children]);

  async function handleFilterApply(filters) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxPrice: filters.maxPrice ?? null,
          amenities: filters.amenities ?? [],
          minRating: filters.minRating ?? null,
          city,
          checkInDate,
          checkOutDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to apply filters');
      setRooms(data);
    } catch (err) {
      toast.error(err.message || 'Failed to apply filters');
    } finally {
      setLoading(false);
    }
  }

  // ✅ Filtered rooms by propertyQuery
  const filteredRooms = useMemo(() => {
    if (!propertyQuery.trim()) return rooms;
    return rooms.filter((room) =>
      room.title.toLowerCase().includes(propertyQuery.toLowerCase())
    );
  }, [rooms, propertyQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-6 lg:pt-[54px] md:pt-[54px]">
        {/* ✅ Property name search input above Filters */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Search By Property Name
          </label>
          <input
            type="text"
            placeholder="Enter property name..."
            value={propertyQuery}
            onChange={(e) => setPropertyQuery(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        {/* Filters component */}
        <Filters onApply={handleFilterApply} />
      </div>

      {/* Results */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-6">
          Stays in {city ?? 'Selected City'}{' '}
          {checkInDate && checkOutDate ? ` — ${checkInDate} to ${checkOutDate}` : ''}
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-gray-600">No rooms available for your search.</p>
        ) : (
          <div className="space-y-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                city={city}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                searchParams={searchParams}
              />
            ))}
          </div>
        )}
      </div>

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
