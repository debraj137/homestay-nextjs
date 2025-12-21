'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRooms() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/rooms`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch rooms');

                setRooms(data);
            } catch (err) {
                toast.error(err.message || 'Error loading rooms');
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">All Rooms</h1>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Room Name</th>
                            <th className="p-3 text-left">Max Adults</th>
                            <th className="p-3 text-left">Max Children</th>
                            <th className="p-3 text-left">Address</th>
                            <th className="p-3 text-left">Price / Night</th>
                            <th className="p-3 text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    Loading rooms...
                                </td>
                            </tr>
                        ) : rooms.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    No rooms found
                                </td>
                            </tr>
                        ) : (
                            rooms.map((room) => (
                                <tr key={room._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium">{room.title}</td>

                                    <td className="p-3">{room.maximumAllowedAdult}</td>

                                    <td className="p-3">{room.maximumAllowedChild}</td>

                                    <td className="p-3 text-sm text-gray-600">
                                        {room.location?.addressLine1},
                                        {room.location?.city},
                                        {room.location?.state}
                                    </td>

                                    <td className="p-3">
                                        {room.discount > 0 ? (
                                            <div className="flex flex-col">
                                                <span className="text-gray-400 line-through text-sm">
                                                    ₹{room.price.toLocaleString('en-IN')}
                                                </span>

                                                <span className="font-semibold text-green-700">
                                                    ₹{Math.round(room.price * (1 - room.discount / 100)).toLocaleString('en-IN')}
                                                </span>

                                                <span className="text-xs text-green-600">
                                                    Save ₹
                                                    {Math.round((room.price * room.discount) / 100).toLocaleString('en-IN')}
                                                    {' '}({room.discount}% OFF)
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="font-semibold">
                                                ₹{room.price.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </td>


                                    <td className="p-3">
                                        <a
                                            href={`/admin/book-for-guest?roomId=${room._id}`}
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            Book for Guest
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
