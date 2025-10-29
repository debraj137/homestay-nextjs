// 'use client';
// import slugify from "slugify";
// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import BookingModal from '@/components/BookingModal'; // ✅ import modal
// import Link from "next/link";

// export default function PremiumHomestays() {
//   const categories = [
//     {
//       key: 'Gold',
//       title: 'Gold Rooms',
//       icon: '🌟',
//       color: 'text-yellow-600',
//       underline: 'border-yellow-500',
//       badge: 'bg-yellow-100 text-yellow-700',
//       priceColor: 'text-yellow-600',
//       bookBtn: 'bg-yellow-500 hover:bg-yellow-600',
//       outlineBtn: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
//       tagBg: 'bg-yellow-50 text-yellow-700',
//     },
//     {
//       key: 'Silver',
//       title: 'Silver Rooms',
//       icon: '🥈',
//       color: 'text-gray-700',
//       underline: 'border-gray-400',
//       badge: 'bg-gray-200 text-gray-700',
//       priceColor: 'text-gray-700',
//       bookBtn: 'bg-gray-700 hover:bg-gray-800',
//       outlineBtn: 'border-gray-400 text-gray-700 hover:bg-gray-50',
//       tagBg: 'bg-gray-100 text-gray-700',
//     },
//     {
//       key: 'Diamond',
//       title: 'Diamond Rooms',
//       icon: '💎',
//       color: 'text-purple-700',
//       underline: 'border-purple-600',
//       badge: 'bg-purple-100 text-purple-700',
//       priceColor: 'text-purple-700',
//       bookBtn: 'bg-purple-600 hover:bg-purple-700',
//       outlineBtn: 'border-purple-600 text-purple-700 hover:bg-purple-50',
//       tagBg: 'bg-purple-50 text-purple-700',
//     },
//   ];

//   const [roomsByCategory, setRoomsByCategory] = useState({});
//   const [selectedRoom, setSelectedRoom] = useState(null); // ✅ track selected room

//   useEffect(() => {
//     async function fetchRooms() {
//       try {
//         const results = {};
//         for (const cat of categories) {
//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_BASE}/rooms/category/${cat.key}`
//           );
//           const data = await res.json();
//           if (!res.ok) throw new Error(data.message);
//           results[cat.key] = data;
//         }
//         setRoomsByCategory(results);
//       } catch (err) {
//         toast.error(err.message || 'Failed to load premium rooms');
//       }
//     }
//     fetchRooms();
//   }, []);

//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-6">
//         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
//           Our Premium Homestay
//         </h2>

//         {categories.map((cat) => (
//           <div key={cat.key} className="mb-12">
//             <h3
//               className={`text-xl font-semibold mb-6 flex items-center space-x-2 ${cat.color}`}
//             >
//               <span>{cat.icon}</span>
//               <span>{cat.title}</span>
//             </h3>
//             <div className={`w-24 border-b-4 ${cat.underline} mb-6`}></div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {roomsByCategory[cat.key]?.length > 0 ? (
//                 roomsByCategory[cat.key].map((room) => (
//                   <div
//                     key={room._id}
//                     className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
//                   >
//                     <img
//                       src={room.images?.[0] || '/default-room.jpg'}
//                       alt={room.title}
//                       className="w-full h-48 object-cover"
//                     />
//                     <div className="p-4 flex flex-col space-y-2">
//                       <div className="flex justify-between items-center">
//                         <h4 className="font-semibold text-lg text-gray-900 truncate leading-snug">
//                           <Link
//                             href={`/rooms/${slugify(room.title, { lower: true })}/${room._id}`}
//                             className="hover:text-red-500 transition-colors duration-200"
//                           >
//                             {room.title}
//                           </Link>
//                         </h4>
//                         <span
//                           className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.badge}`}
//                         >
//                           {cat.key.toUpperCase()}
//                         </span>
//                       </div>
//                       <p className="text-gray-500 text-sm">
//                         {room.location?.city}, {room.location?.state}
//                       </p>
//                       <p className={`font-bold ${cat.priceColor}`}>
//                         ₹{room.price}
//                         <span className="text-gray-600 text-sm font-normal">
//                           {' '}
//                           /night
//                         </span>
//                       </p>
//                       <div className="flex flex-wrap gap-2 text-xs">
//                         {room.amenities?.map((tag, idx) => (
//                           <span
//                             key={idx}
//                             className={`px-2 py-1 rounded-full ${cat.tagBg}`}
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                       <div className="flex justify-between mt-3 space-x-2">
//                         <button
//                           onClick={() => setSelectedRoom(room)} // ✅ open modal
//                           className={`flex-1 px-4 py-2 text-white text-sm font-semibold rounded-lg ${cat.bookBtn} cursor-pointer`}
//                         >
//                           Book Now
//                         </button>
//                         <a
//                           href={`/rooms/${slugify(room.title, { lower: true })}/${room._id}`}
//                           className={`flex-1 px-4 py-2 border text-sm font-semibold rounded-lg text-center ${cat.outlineBtn}`}
//                         >
//                           View Details
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No {cat.title} available.</p>
//               )}
//             </div>
//           </div>
//         ))}

//         {/* ✅ Booking Modal */}
//         {selectedRoom && (
//           <BookingModal
//             room={selectedRoom}
//             onClose={() => setSelectedRoom(null)}
//           />
//         )}
//       </div>
//     </section>
//   );
// }


'use client';
import slugify from "slugify";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BookingModal from '@/components/BookingModal';
import Link from "next/link";

export default function PremiumHomestays() {
  const categories = [
    {
      key: 'Gold',
      title: 'Gold Rooms',
      icon: '🌟',
      color: 'text-yellow-700',
      // color: 'text-green-600',
      saveColor: 'text-green-600',
      underline: 'border-yellow-500',
      // badge: 'bg-yellow-100 text-yellow-800',
      badge: 'bg-gray-200 text-gray-700',
      // priceColor: 'text-yellow-700',
      priceColor: 'text-red-600',
      // bookBtn: 'bg-yellow-500 hover:bg-yellow-600',
      bookBtn: 'bg-gray-700 hover:bg-gray-800',
      // outlineBtn: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
      outlineBtn: 'border-gray-400 text-gray-700 hover:bg-gray-50',
      // tagBg: 'bg-yellow-50 text-yellow-700',
      tagBg: 'bg-gray-100 text-gray-700',
      discountBadge: 'bg-yellow-500 text-white',
    },
    {
      key: 'Silver',
      title: 'Silver Rooms',
      icon: '🥈',
      color: 'text-gray-700',
      // color: 'text-green-600',
      saveColor: 'text-green-600',
      underline: 'border-gray-400',
      badge: 'bg-gray-200 text-gray-700',
      priceColor: 'text-red-600',
      bookBtn: 'bg-gray-700 hover:bg-gray-800',
      outlineBtn: 'border-gray-400 text-gray-700 hover:bg-gray-50',
      tagBg: 'bg-gray-100 text-gray-700',
      discountBadge: 'bg-gray-600 text-white',
    },
    {
      key: 'Diamond',
      title: 'Diamond Rooms',
      icon: '💎',
      color: 'text-purple-700',
      // color: 'text-green-600',
      saveColor: 'text-green-600',
      underline: 'border-purple-600',
      // badge: 'bg-purple-100 text-purple-700',
      badge: 'bg-gray-200 text-gray-700',
      // priceColor: 'text-purple-700',
      priceColor: 'text-red-600',
      // bookBtn: 'bg-purple-600 hover:bg-purple-700',
      bookBtn: 'bg-gray-700 hover:bg-gray-800',
      // outlineBtn: 'border-purple-600 text-purple-700 hover:bg-purple-50',
      outlineBtn: 'border-gray-400 text-gray-700 hover:bg-gray-50',
      // tagBg: 'bg-purple-50 text-purple-700',
      tagBg: 'bg-gray-100 text-gray-700',
      discountBadge: 'bg-purple-600 text-white',
    },
  ];

  const [roomsByCategory, setRoomsByCategory] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ✅ Fetch category-wise rooms safely
  useEffect(() => {
    async function fetchRooms() {
      try {
        const results = {};
        for (const cat of categories) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/category/${cat.key}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);

          results[cat.key] = data.map((room) => {
            const price = Number(room.price) || 0;
            const discount = Number(room.discount) || 0;
            const discountedPrice =
              discount > 0 ? Math.round(price - (price * discount) / 100) : price;
            const savedAmount = discount > 0 ? price - discountedPrice : 0;
            return { ...room, discountedPrice, savedAmount, discountPercentage: discount };
          });
        }
        setRoomsByCategory(results);
      } catch (err) {
        toast.error(err.message || 'Failed to load premium rooms');
      }
    }
    fetchRooms();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
          Our Premium Homestay
        </h2>

        {categories.map((cat) => (
          <div key={cat.key} className="mb-12">
            <h3
              className={`text-xl font-semibold mb-6 flex items-center space-x-2 ${cat.color}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.title}</span>
            </h3>
            <div className={`w-24 border-b-4 ${cat.underline} mb-6`}></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {roomsByCategory[cat.key]?.length > 0 ? (
                roomsByCategory[cat.key].map((room) => {
                  const hasDiscount = room.discountPercentage > 0;
                  const price = Number(room.price) || 0;
                  const discountedPrice = Number(room.discountedPrice) || price;
                  const savedAmount = Number(room.savedAmount) || 0;

                  return (
                    <div
                      key={room._id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200"
                    >
                      {/* Image + Themed Discount Badge */}
                      <div className="relative">
                        <Link
                          href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
                          className="block group"
                        >
                          <img
                            src={room.images?.[0] || '/default-room.jpg'}
                            alt={room.title}
                            className="w-full h-48 object-cover"
                          />
                          {hasDiscount && (
                            <div
                              className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md"
                            >
                              {room.discountPercentage}% OFF
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Room Info */}
                      <div className="p-4 flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-lg text-gray-900 truncate leading-snug">
                            <Link
                              href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
                              className="hover:text-red-500 transition-colors duration-200"
                            >
                              {room.title}
                            </Link>
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${cat.badge}`}
                          >
                            {cat.key.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">
                          {room.location?.city}, {room.location?.state}
                        </p>

                        {/* 💰 Themed Inline Price Row */}
                        {hasDiscount ? (
                          <div className="mt-2 flex flex-wrap items-baseline gap-2">
                            <p className="text-gray-400 line-through text-sm">
                              ₹{price.toLocaleString('en-IN')}
                            </p>
                            <p className={`font-bold text-lg ${cat.priceColor}`}>
                              ₹{discountedPrice.toLocaleString('en-IN')}
                              <span className="text-sm text-red-600"> / night</span>
                            </p>
                            <p className={`text-sm font-semibold ${cat.saveColor}`}>
                              Save ₹{savedAmount.toLocaleString('en-IN')}
                            </p>
                          </div>
                        ) : (
                          <p className={`font-bold ${cat.priceColor}`}>
                            ₹{price.toLocaleString('en-IN')}
                            <span className="text-red-600 text-sm font-normal">
                              {' '}
                              / night
                            </span>
                          </p>
                        )}

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 text-xs mt-2">
                          {room.amenities?.slice(0, 5).map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded-full ${cat.tagBg}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between mt-3 space-x-2">
                          <button
                            onClick={() => setSelectedRoom(room)}
                            className={`flex-1 px-4 py-2 text-white text-sm font-semibold rounded-lg ${cat.bookBtn} cursor-pointer`}
                          >
                            Book Now
                          </button>
                          <a
                            href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`}
                            className={`flex-1 px-4 py-2 border text-sm font-semibold rounded-lg text-center ${cat.outlineBtn}`}
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No {cat.title} available.</p>
              )}
            </div>
          </div>
        ))}

        {/* ✅ Booking Modal */}
        {selectedRoom && (
          <BookingModal
            room={selectedRoom}
            onClose={() => setSelectedRoom(null)}
          />
        )}
      </div>
    </section>
  );
}
