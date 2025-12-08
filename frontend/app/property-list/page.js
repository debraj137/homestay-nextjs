'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PropertyListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchApprovedRooms() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/rooms/owner/${user.id}/approved`,
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
        toast.error(err.message || 'Failed to fetch rooms');
      }
    }

    fetchApprovedRooms();
  }, [user, router]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Rooms</h1>

      {rooms.length === 0 ? (
        <p className="text-gray-600">No approved rooms available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border">Room Name</th>
                <th className="px-4 py-2 border">Max Allowed Adult</th>
                <th className="px-4 py-2 border">Max Allowed Child</th>
                <th className="px-4 py-2 border">Price</th>
                {/* <th className="px-4 py-2 border">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{room.title}</td>
                  <td className="px-4 py-2 border">{room.maximumAllowedAdult}</td>
                  <td className="px-4 py-2 border">{room.maximumAllowedChild}</td>
                  <td className="px-4 py-2 border">₹{room.price}</td>
                  {/* <td className="px-4 py-2 border">
                    <Link
                      href={`/bookings/${room._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Bookings
                    </Link>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
