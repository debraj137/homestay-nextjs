// 'use client';
// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Filters from '@/components/Filters';
// import toast from 'react-hot-toast';

// export default function RoomListPage() {
//   const [rooms, setRooms] = useState([]);
//   const [filters, setFilters] = useState({});
//   const searchParams = useSearchParams();

//   const city = searchParams.get('city');
//   const checkInDate = searchParams.get('checkInDate');
//   const checkOutDate = searchParams.get('checkOutDate');

//   useEffect(() => {
//     if (!city || !checkInDate || !checkOutDate) return;

//     async function fetchRooms() {
//       try {
//         const query = new URLSearchParams({
//           city,
//           checkInDate,
//           checkOutDate,
//           ...(filters.price ? { maxPrice: filters.price } : {}),
//           ...(filters.amenities?.length > 0
//             ? { amenities: filters.amenities.join(',') }
//             : {}),
//         });

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE}/rooms/search?${query.toString()}`
//         );
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message);

//         setRooms(data);
//       } catch (err) {
//         toast.error(err.message || 'Failed to fetch rooms');
//       }
//     }

//     fetchRooms();
//   }, [city, checkInDate, checkOutDate, filters]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* Filters Sidebar */}
//       <div className="md:col-span-1">
//         <Filters onApply={setFilters} />
//       </div>

//       {/* Room Listings */}
//       <div className="md:col-span-3 space-y-6">
//         {rooms.length === 0 ? (
//           <p className="text-gray-600">No rooms available for your search.</p>
//         ) : (
//           rooms.map((room) => (
//             <div
//               key={room._id}
//               className="flex flex-col md:flex-row bg-white rounded-lg shadow overflow-hidden border"
//             >
//               {/* Image */}
//               {room.images?.[0] ? (
//                 <img
//                   src={room.images[0]}
//                   alt={room.title}
//                   className="w-full md:w-1/3 h-48 object-cover"
//                 />
//               ) : (
//                 <div className="w-full md:w-1/3 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
//                   No Image
//                 </div>
//               )}

//               {/* Details */}
//               <div className="flex-1 p-4 flex flex-col justify-between">
//                 <div>
//                   <h2 className="text-lg font-bold">{room.title}</h2>
//                   <p className="text-sm text-gray-500">
//                     {room.location?.city}, {room.location?.state}
//                   </p>
//                   <p className="text-red-600 font-bold mt-2">
//                     ₹{room.price} / night
//                   </p>
//                   {/* Amenities */}
//                   <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
//                     {room.amenities?.map((a, idx) => (
//                       <span
//                         key={idx}
//                         className="px-2 py-1 border rounded bg-gray-100"
//                       >
//                         {a}
//                       </span>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="mt-4 flex space-x-2">
//                   <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
//                     Book Now
//                   </button>
//                   <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }






// app/search/page.js
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Filters from '@/components/Filters';
import toast from 'react-hot-toast';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial fetch (city + dates)
  useEffect(() => {
    async function fetchInitial() {
      if (!city || !checkInDate || !checkOutDate) {
        setRooms([]); // nothing to search
        return;
      }
      try {
        setLoading(true);
        const query = new URLSearchParams({
          city,
          checkInDate,
          checkOutDate,
        });
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
  }, [city, checkInDate, checkOutDate]);

  // This function is called when Filters -> Apply Filters is clicked
  async function handleFilterApply(filters) {
    // filters expected shape: { price, amenities }
    try {
      setLoading(true);
      const body = {
        maxPrice: filters.maxPrice ?? null,
        amenities: filters.amenities ?? [],
      };

      // include city/dates so backend can apply combined filtering if implemented
      if (city) body.city = city;
      if (checkInDate) body.checkInDate = checkInDate;
      if (checkOutDate) body.checkOutDate = checkOutDate;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters sidebar */}
      <div className="md:col-span-1">
        <Filters onApply={handleFilterApply} />
      </div>

      {/* Results */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-4">
          Stays in {city ?? 'Selected City'} {checkInDate && checkOutDate ? ` — ${checkInDate} to ${checkOutDate}` : ''}
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-600">No rooms available for your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="flex flex-col md:flex-row bg-white rounded-lg shadow overflow-hidden border">
                {room.images?.[0] ? (
                  <img src={room.images[0]} alt={room.title} className="w-full md:w-1/3 h-48 object-cover" />
                ) : (
                  <div className="w-full md:w-1/3 h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{room.title}</h2>
                    <p className="text-sm text-gray-500">{room.location?.city}, {room.location?.state}</p>
                    <p className="text-red-600 font-bold mt-2">₹{room.price} / night</p>

                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                      {(room.amenities || []).slice(0, 6).map((a, idx) => (
                        <span key={idx} className="px-2 py-1 border rounded bg-gray-100">{a}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Book Now</button>
                    <a href={`/rooms/${room._id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`} className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">View Details</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
