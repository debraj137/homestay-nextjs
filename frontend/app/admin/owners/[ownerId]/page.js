'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OwnerRoomsPage() {
  const { ownerId } = useParams();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/owner/${ownerId}/rooms`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setRooms(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch rooms');
      }
    }
    fetchRooms();
  }, [ownerId]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Properties of Owner</h1>
      {rooms.length === 0 ? (
        <p className="text-gray-600">No properties found for this owner.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Room Name</th>
                <th className="p-3 border">Max Adults</th>
                <th className="p-3 border">Max Children</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Price/Night</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="text-center">
                  <td className="p-3 border">{room.title}</td>
                  <td className="p-3 border">{room.maximumAllowedAdult}</td>
                  <td className="p-3 border">{room.maximumAllowedChild}</td>
                  <td className="p-3 border">
                    {room.location?.addressLine1}, {room.location?.city},{' '}
                    {room.location?.state}
                  </td>
                  <td className="p-3 border">₹{room.price}</td>
                  <td className="p-3 border">
                    {room.isApproved ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
