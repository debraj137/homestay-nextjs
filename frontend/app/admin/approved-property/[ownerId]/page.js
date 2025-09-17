'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ApprovedRoomsPage() {
  const { ownerId } = useParams();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_BASE}/admin/owner/${ownerId}?isApproved=true`,
         `${process.env.NEXT_PUBLIC_API_BASE}/admin/approved-rooms/${ownerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRooms(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch approved rooms');
      }
    }
    fetchRooms();
  }, [ownerId]);

  async function handleCategoryChange(roomId, newCategory) {
    try {
      const res = await fetch(
        // `${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}/category`,
        `${process.env.NEXT_PUBLIC_API_BASE}/admin/room/${roomId}/category`,
        {
        //   method: 'PATCH',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ category: newCategory }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Category updated!');
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, category: newCategory } : room
        )
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update category');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Approved Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-xl shadow-md overflow-hidden border"
          >
            {/* Room Image */}
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

            {/* Room Details */}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{room.title}</h2>
              <p className="text-sm text-gray-500">
                {room.location?.city}, {room.location?.state}
              </p>
              <p className="text-red-600 font-bold mt-2">
                ₹{room.price}/night
              </p>

              {/* Dropdown for Category */}
              <select
                value={room.category}
                onChange={(e) =>
                  handleCategoryChange(room._id, e.target.value)
                }
                className="mt-3 w-full border rounded-lg p-2"
              >
                <option value="Normal">Normal</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Diamond">Diamond</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
