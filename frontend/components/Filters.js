'use client';
import { useState } from 'react';

export default function Filters({ onApply }) {
  const [price, setPrice] = useState(2500);
  const [amenities, setAmenities] = useState([]);

  const handleAmenityChange = (e) => {
    const value = e.target.value;
    setAmenities((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    onApply({ price, amenities });
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
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
        />
        <p className="text-sm text-gray-600 mt-1">Up to ₹{price}</p>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Amenities</label>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          {['AC', 'Parking', 'Swimming Pool', 'Wifi', 'Fridge', 'Room Service', 'TV'].map(
            (item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={item}
                  checked={amenities.includes(item)}
                  onChange={handleAmenityChange}
                  className="accent-red-500"
                />
                <span>{item}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
      >
        Apply Filters
      </button>
    </aside>
  );
}
