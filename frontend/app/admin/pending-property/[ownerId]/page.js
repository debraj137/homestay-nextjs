'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PendingRoomsPage() {
  const params = useParams();
  const ownerId = params.ownerId;
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/pending-rooms/${ownerId}`);
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        toast.error('Failed to load rooms');
      }
    }
    fetchRooms();
  }, [ownerId]);

  async function handleApproval(roomId, action) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/room/${roomId}/approval`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setRooms((prev) => prev.filter((r) => r._id !== roomId)); // remove from list
      toast.success(`Room ${action}d successfully`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white rounded-xl shadow-md p-4 border">
            <img src={room.images?.[0] || '/placeholder.jpg'} alt={room.title} className="w-full h-40 object-cover rounded-lg" />
            <h2 className="text-lg font-semibold mt-3">{room.title}</h2>
            <p className="text-gray-500">{room.location?.city}, {room.location?.state}</p>
            <p className="text-red-600 font-bold mt-2">₹{room.price}/night</p>
            <div className="flex space-x-2 mt-4">
              <button onClick={() => handleApproval(room._id, 'approve')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">Approve</button>
              <button onClick={() => handleApproval(room._id, 'reject')} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
