'use client';
import { useEffect, useState } from 'react';
import Filters from '@/components/Filters'; // reuse existing Filters component
import toast from 'react-hot-toast';

export default function HomestaysPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial fetch: all approved homestays
  useEffect(() => {
    async function fetchRooms() {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRooms(data.filter((room) => room.isApproved));
      } catch (err) {
        toast.error(err.message || 'Failed to load homestays');
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  // Handle "Apply Filters"
  async function handleFilterApply(filters) {
    try {
      setLoading(true);
      const body = {
        maxPrice: filters.maxPrice ?? null,
        amenities: filters.amenities ?? [],
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Only approved rooms
      setRooms(data.filter((room) => room.isApproved));
    } catch (err) {
      toast.error(err.message || 'Failed to apply filters');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filters Sidebar */}
      <div className="md:col-span-1">
        <Filters onApply={handleFilterApply} />
      </div>

      {/* Rooms List */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-6">All Homestays</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-600">No homestays available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="flex flex-col bg-white rounded-lg shadow hover:shadow-lg overflow-hidden border"
              >
                {/* Image */}
                {room.images?.[0] ? (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-lg font-bold">{room.title}</h2>
                    <p className="text-sm text-gray-500">
                      {room.location?.city}, {room.location?.state}
                    </p>
                    <p className="text-red-600 font-bold mt-2">
                      ₹{room.price} / night
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                      {room.amenities?.slice(0, 5).map((a, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 border rounded bg-gray-100"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex space-x-2">
                    <a
                      href={`/rooms/${room._id}`}
                      className="flex-1 text-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      View Details
                    </a>
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
