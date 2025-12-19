// 'use client';
// import { useState, useEffect } from 'react';

// export default function Filters({ onApply }) {
//   const [price, setPrice] = useState(2500);
//   const [selectedAmenities, setSelectedAmenities] = useState([]);
//   const [amenities, setAmenities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch distinct amenities
//   useEffect(() => {
//     async function fetchAmenities() {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/amenities`);
//         const data = await res.json();
//         setAmenities(Array.isArray(data) ? data : data.amenities || []);
//       } catch (err) {
//         console.error("Failed to fetch amenities", err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchAmenities();
//   }, []);

//   const handleAmenityChange = (e) => {
//     const value = e.target.value;
//     setSelectedAmenities((prev) =>
//       prev.includes(value)
//         ? prev.filter((a) => a !== value)
//         : [...prev, value]
//     );
//   };

//   const handleApply = () => {
//     onApply({ maxPrice: price, amenities: selectedAmenities });
//   };

//   return (
//     <aside className="w-full bg-white rounded-lg shadow-md p-4">
//       <h2 className="text-lg font-bold mb-4">Filters</h2>

//       {/* Price Filter */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-2">Price (₹)</label>
//         <input
//           type="range"
//           min="0"
//           max="2500"
//           value={price}
//           onChange={(e) => setPrice(Number(e.target.value))}
//           className="w-full accent-red-500"
//         />
//         <p className="text-sm text-gray-600 mt-1">Up to ₹{price}</p>
//       </div>

//       {/* Amenities */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-2">Amenities</label>
//         {loading ? (
//           <p className="text-gray-500">Loading amenities...</p>
//         ) : amenities.length === 0 ? (
//           <p className="text-gray-500">No amenities available</p>
//         ) : (
//           <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//             {amenities.map((item) => (
//               <label key={item} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   value={item}
//                   checked={selectedAmenities.includes(item)}
//                   onChange={handleAmenityChange}
//                   className="accent-red-500"
//                 />
//                 <span>{item}</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Apply Button */}
//       <button
//         onClick={handleApply}
//         className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
//       >
//         Apply Filters
//       </button>
//     </aside>
//   );
// }


'use client';
import { useState, useEffect } from 'react';

export default function Filters({ onApply }) {
  const [price, setPrice] = useState(2500);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState(null); // ⭐ new state
  const [nearbyArea, setNearbyArea] = useState("");
  // Fetch distinct amenities
  useEffect(() => {
    async function fetchAmenities() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/amenities`);
        const data = await res.json();
        setAmenities(Array.isArray(data) ? data : data.amenities || []);
      } catch (err) {
        console.error("Failed to fetch amenities", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAmenities();
  }, []);

  const handleAmenityChange = (e) => {
    const value = e.target.value;
    setSelectedAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply({ maxPrice: price, amenities: selectedAmenities, minRating, nearbyArea });
  };

  return (
    <aside className="w-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-4">Filters</h2>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Price (₹)</label>
        <input
          type="range"
          min="0"
          max="2500"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-gray-700"
        />
        <p className="text-sm text-gray-600 mt-1">Up to ₹{price}</p>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Amenities</label>
        {loading ? (
          <p className="text-gray-500">Loading amenities...</p>
        ) : amenities.length === 0 ? (
          <p className="text-gray-500">No amenities available</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            {amenities.map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={selectedAmenities.includes(item)}
                  onChange={handleAmenityChange}
                  className="accent-red-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Nearby Area
        </label>
        <input
          type="text"
          placeholder="e.g. Ram Mandir, Railway Station"
          value={nearbyArea}
          onChange={(e) => setNearbyArea(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>


      {/* ⭐ Minimum Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Minimum Rating</label>
        <select
          value={minRating || ""}
          onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
          className="w-full border rounded p-2"
        >
          <option value="">Any</option>
          <option value="1">1 ★ & above</option>
          <option value="2">2 ★ & above</option>
          <option value="3">3 ★ & above</option>
          <option value="4">4 ★ & above</option>
          <option value="5">5 ★ only</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full text-white py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 cursor-pointer"
      >
        Apply Filters
      </button>
    </aside>
  );
}
