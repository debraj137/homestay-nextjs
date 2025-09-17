'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ListedPropertyPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        async function fetchRooms() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/rooms/owner/${user.id}`,
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

        fetchRooms();
    }, [user, router]);

    function handleAddRoom() {
        router.push('/add-room'); // 👉 separate Add Room page (or modal if you prefer)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Rooms Listed By Owner</h1>
                <button
                    onClick={handleAddRoom}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    + Add Room
                </button>
            </div>

            {rooms.length === 0 ? (
                <p className="text-gray-600">No rooms listed yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden border"
                        >
                            {/* Room image */}
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

                            {/* Room details */}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">{room.title}</h2>
                                <p className="text-sm text-gray-500">{room.location?.addressLine1}</p>
                                <p className="text-red-600 font-bold mt-2">
                                    ₹{room.price}/night
                                </p>

                                {/* Action buttons */}
                                <div className="flex items-center justify-between mt-4 space-x-2">
                                    <button
                                        onClick={() => router.push(`/update-room/${room._id}`)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
                                    >
                                        Update Room
                                    </button>
                                    {room.isApproved ? (
                                        <button
                                            disabled
                                            className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium"
                                        >
                                            Approved
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium"
                                        >
                                            Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
