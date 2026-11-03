// 'use client';
// import Link from "next/link"; 
// import slugify from "slugify"; 
// import { useEffect, useState } from 'react';
// import Filters from '@/components/Filters'; // reuse existing Filters component
// import toast from 'react-hot-toast';

// export default function HomestaysPage() {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Initial fetch: all approved homestays
//   useEffect(() => {
//     async function fetchRooms() {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message);
//         setRooms(data.filter((room) => room.isApproved));
//       } catch (err) {
//         toast.error(err.message || 'Failed to load homestays');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchRooms();
//   }, []);

//   // Handle "Apply Filters"
//   async function handleFilterApply(filters) {
//     try {
//       setLoading(true);
//       const body = {
//         maxPrice: filters.maxPrice ?? null,
//         amenities: filters.amenities ?? [],
//         minRating: filters.minRating ?? null, // ⭐ added
//       };
//       console.log("Filter body:", body);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       // ✅ Only approved rooms
//       setRooms(data.filter((room) => room.isApproved));
//     } catch (err) {
//       toast.error(err.message || 'Failed to apply filters');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
//       {/* Filters Sidebar */}
//       <div className="md:col-span-1">
//         <Filters onApply={handleFilterApply} />
//       </div>

//       {/* Rooms List */}
//       <div className="md:col-span-3">
//         <h1 className="text-2xl font-bold mb-6">All Homestays</h1>

//         {loading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : rooms.length === 0 ? (
//           <p className="text-gray-600">No homestays available.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {rooms.map((room) => (
//               <div
//                 key={room._id}
//                 className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border"
//               >
//                 {/* Image */}
//                 {room.images?.[0] ? (
//                   <img
//                     src={room.images[0]}
//                     alt={room.title}
//                     className="w-full h-48 object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
//                     No Image
//                   </div>
//                 )}

//                 {/* Details */}
//                 <div className="p-4 flex flex-col justify-between flex-1">
//                   <div>
//                     <h2 className="text-lg font-bold">
//                       <Link href={`/rooms/${slugify(room.title, { lower: true })}/${room._id}`} className="hover:underline hover:text-red-600">
//                         {room.title}
//                       </Link>
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {room.location?.city}, {room.location?.state}
//                     </p>
//                     <p className="text-red-600 font-bold mt-2">
//                       ₹{room.price} / night
//                     </p>
//                     <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
//                       {room.amenities?.slice(0, 5).map((a, idx) => (
//                         <span
//                           key={idx}
//                           className="px-2 py-1 border rounded bg-gray-100"
//                         >
//                           {a}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="mt-4 flex space-x-2">
//                     <a
//                       href={`/rooms/${slugify(room.title, { lower: true })}/${room._id}`}
//                       className="flex-1 text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                     >
//                       View Details
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';
import Link from "next/link";
import slugify from "slugify";
import { useEffect, useState } from 'react';
import Filters from '@/components/Filters';
import toast from 'react-hot-toast';

export default function HomestaysPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all approved homestays (with discount calculation)
  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        // ✅ compute discountedPrice dynamically using "discount"
        const processed = data
          .filter((room) => room.isApproved)
          .map((room) => {
            const price = Number(room.price) || 0;
            const discount = Number(room.discount) || 0;
            const discountedPrice =
              discount > 0 ? Math.round(price - (price * discount) / 100) : price;
            return { ...room, discountedPrice };
          });

        setRooms(processed);
      } catch (err) {
        toast.error(err.message || 'Failed to load homestays');
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  // ✅ Handle filters (also compute discounted prices)
  async function handleFilterApply(filters) {
    try {
      setLoading(true);
      const body = {
        maxPrice: filters.maxPrice ?? null,
        amenities: filters.amenities ?? [],
        minRating: filters.minRating ?? null,
        nearbyArea: filters.nearbyArea ?? null,
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const processed = data
        .filter((room) => room.isApproved)
        .map((room) => {
          const price = Number(room.price) || 0;
          const discount = Number(room.discount) || 0;
          const discountedPrice =
            discount > 0 ? Math.round(price - (price * discount) / 100) : price;
          return { ...room, discountedPrice };
        });

      setRooms(processed);
    } catch (err) {
      toast.error(err.message || 'Failed to apply filters');
    } finally {
      setLoading(false);
    }
  }

  // return (
  //   <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
  //     {/* Sidebar Filters */}
  //     <div className="md:col-span-1">
  //       <Filters onApply={handleFilterApply} />
  //     </div>

  //     {/* Room Cards */}
  //     <div className="md:col-span-3">
  //       <h1 className="text-2xl font-bold mb-6">All Homestays</h1>

  //       {loading ? (
  //         <p className="text-gray-600">Loading...</p>
  //       ) : rooms.length === 0 ? (
  //         <p className="text-gray-600">No homestays available.</p>
  //       ) : (
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {rooms.map((room) => {
  //             const price = room.price || 0;
  //             const discount = room.discount || 0;
  //             const discountedPrice = room.discountedPrice || price;
  //             const hasDiscount = discount > 0;
  //             const savedAmount = hasDiscount ? price - discountedPrice : 0;

  //             return (
  //               <div
  //                 key={room._id}
  //                 className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border border-gray-200 transition"
  //               >
  //                 {/* Image + Discount Badge */}
  //                 <div className="relative">
  //                   {room.images?.[0] ? (
  //                     <img
  //                       src={room.images[0]}
  //                       alt={room.title}
  //                       className="w-full h-48 object-cover"
  //                     />
  //                   ) : (
  //                     <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
  //                       No Image
  //                     </div>
  //                   )}

  //                   {hasDiscount && (
  //                     <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
  //                       {discount}% OFF
  //                     </div>
  //                   )}
  //                 </div>

  //                 {/* Details */}
  //                 <div className="p-4 flex flex-col justify-between flex-1">
  //                   <div>
  //                     <h2 className="text-lg font-bold text-gray-900">
  //                       <Link
  //                         href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
  //                         className="hover:underline hover:text-red-600"
  //                       >
  //                         {room.title}
  //                       </Link>
  //                     </h2>
  //                     <p className="text-sm text-gray-500">
  //                       {room.location?.city}, {room.location?.state}
  //                     </p>

  //                     {/* 💰 Price Display (all in one line) */}
  //                     {hasDiscount ? (
  //                       <div className="mt-2 flex flex-wrap items-baseline gap-2">
  //                         <p className="text-gray-400 line-through text-sm">
  //                           ₹{price.toLocaleString('en-IN')}
  //                         </p>
  //                         <p className="text-red-600 font-bold text-lg">
  //                           ₹{discountedPrice.toLocaleString('en-IN')}
  //                           <span className="text-sm text-gray-500"> / night</span>
  //                         </p>
  //                         <p className="text-green-600 text-sm font-semibold">
  //                           Save ₹{savedAmount.toLocaleString('en-IN')}
  //                         </p>
  //                       </div>
  //                     ) : (
  //                       <p className="text-red-600 font-bold mt-2">
  //                         ₹{price.toLocaleString('en-IN')}
  //                         <span className="text-sm text-gray-500"> / night</span>
  //                       </p>
  //                     )}


  //                     {/* Amenities */}
  //                     <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
  //                       {room.amenities?.slice(0, 5).map((a, idx) => (
  //                         <span
  //                           key={idx}
  //                           className="px-2 py-1 border rounded bg-gray-100"
  //                         >
  //                           {a}
  //                         </span>
  //                       ))}
  //                       {room.amenities?.length > 5 && (
  //                         <span className="text-gray-400">
  //                           +{room.amenities.length - 5} more
  //                         </span>
  //                       )}
  //                     </div>
  //                   </div>

  //                   {/* View Details Button */}
  //                   <div className="mt-4 flex space-x-2">
  //                     <a
  //                       href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
  //                       className="flex-1 text-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer transition"
  //                     >
  //                       View Details
  //                     </a>
  //                   </div>
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  
return (
  <main className="min-h-screen bg-[#faf7f2]">
    {/* Page Header */}
    <section className="bg-[#302019] text-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <p className="text-sm uppercase tracking-[0.25em] text-[#d9a77b] mb-3">
          Discover your stay
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Explore Homestays
        </h1>
        <p className="mt-3 text-[#e6d7ca] max-w-2xl">
          Find comfortable stays, beautiful spaces and memorable
          experiences for your next journey.
        </p>
      </div>
    </section>

    {/* Main Content */}
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#eadfd3] p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-lg font-bold text-[#38251d] mb-5">
              Refine your search
            </h2>
            <Filters onApply={handleFilterApply} />
          </div>
        </aside>

        {/* Homestay Listings */}
        <div className="lg:col-span-3">

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#38251d]">
                Available Homestays
              </h2>
              <p className="text-sm text-[#88776c] mt-1">
                Discover a stay that feels like home.
              </p>
            </div>

            {!loading && (
              <span className="text-sm text-[#8b7467]">
                {rooms.length} properties found
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-[#eee5dc]" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-[#eee5dc] rounded w-3/4" />
                    <div className="h-4 bg-[#eee5dc] rounded w-1/2" />
                    <div className="h-8 bg-[#eee5dc] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#eadfd3] p-12 text-center">
              <div className="text-4xl mb-4">⌂</div>
              <h3 className="text-xl font-bold text-[#38251d]">
                No homestays found
              </h3>
              <p className="text-[#88776c] mt-2">
                Try changing your filters to discover more properties.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rooms.map((room) => {
                const price = Number(room.price) || 0;
                const discount = Number(room.discount) || 0;
                const discountedPrice =
                  room.discountedPrice ?? price;
                const hasDiscount = discount > 0;
                const savedAmount = price - discountedPrice;

                const roomUrl = `/rooms/${slugify(
                  `${room.title}-in-${room.location?.city || ''}`,
                  { lower: true }
                )}/${room._id}`;

                return (
                  <article
                    key={room._id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#eadfd3] shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <Link href={roomUrl} className="block relative overflow-hidden">
                      {room.images?.[0] ? (
                        <img
                          src={room.images[0]}
                          alt={room.title}
                          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-60 bg-[#eee5dc] flex items-center justify-center text-[#8b7467]">
                          No Image Available
                        </div>
                      )}

                      {hasDiscount && (
                        <span className="absolute top-4 left-4 bg-[#a84629] text-white text-xs font-semibold px-3 py-2 rounded-full shadow">
                          {discount}% OFF
                        </span>
                      )}

                      <span className="absolute bottom-4 right-4 bg-white/95 text-[#493126] text-xs font-semibold px-3 py-2 rounded-full">
                        Homestay
                      </span>
                    </Link>

                    {/* Details */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#38251d] group-hover:text-[#a84629] transition-colors">
                        <Link href={roomUrl}>
                          {room.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-[#88776c] mt-2 flex items-center gap-2">
                        <span>📍</span>
                        {room.location?.city}
                        {room.location?.state
                          ? `, ${room.location.state}`
                          : ''}
                      </p>

                      {/* Price */}
                      <div className="mt-5 pt-4 border-t border-[#eee5dc]">
                        {hasDiscount ? (
                          <>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm line-through text-[#a99b91]">
                                ₹{price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xl font-bold text-[#a84629]">
                                ₹{discountedPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm text-[#65865c] font-semibold">
                                Save ₹{savedAmount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-[#a84629]">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        )}

                        <span className="text-sm text-[#88776c] ml-1">
                          / night
                        </span>
                      </div>

                      {/* Amenities */}
                      {room.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {room.amenities.slice(0, 4).map((amenity, index) => (
                            <span
                              key={index}
                              className="text-xs text-[#765d4e] bg-[#f7f0e8] border border-[#eee2d6] px-3 py-2 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}

                          {room.amenities.length > 4 && (
                            <span className="text-xs text-[#a84629] px-2 py-2">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action */}
                      <Link
                        href={roomUrl}
                        className="mt-5 flex items-center justify-center w-full bg-[#512a1d] hover:bg-[#a84629] text-white font-semibold py-3 rounded-xl transition-colors"
                      >
                        View Property Details
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  </main>
);

}
