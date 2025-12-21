'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function BookForGuestPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const roomId = searchParams.get('roomId');

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    // Guest info
    const [guest, setGuest] = useState({
        name: '',
        email: '',
        mobileNumber: '',
    });

    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Booking info
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const [submitting, setSubmitting] = useState(false);

    const handleGuestSearch = async (value) => {
        setGuest({ ...guest, name: value });

        if (value.length < 2) {
            setSearchResults([]);
            return;
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE}/admin/users/search?q=${value}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        const data = await res.json();
        setSearchResults(data);
    };


    // 1️⃣ Fetch room details
    useEffect(() => {
        async function fetchRoom() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setRoom(data);
            } catch (err) {
                toast.error(err.message || 'Failed to load room');
            } finally {
                setLoading(false);
            }
        }

        if (roomId) fetchRoom();
    }, [roomId]);

    // 2️⃣ Create booking
    const handleBookGuest = async () => {
        if (!guest.name || !guest.email || !guest.mobileNumber) {
            toast.error('Guest name, email and mobile are required');
            return;
        }

        if (!checkInDate || !checkOutDate) {
            toast.error('Check-in and check-out dates are required');
            return;
        }

        try {
            setSubmitting(true); //disable button
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE}/admin/book-for-guest`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        roomId,
                        userId: selectedUserId, // null if new user
                        guest,
                        checkInDate,
                        checkOutDate,
                        numberOfAdult: adults,
                        numberOfChild: children,
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success('Booking created successfully');
            router.push('/admin/bookings');
        } catch (err) {
            toast.error(err.message || 'Failed to create booking');
            setSubmitting(false); //re-enable on error
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Book Room for Guest</h1>

            {room && (
                <div className="p-4 border rounded bg-gray-50">
                    <p className="font-semibold">{room.title}</p>
                    <p className="text-sm text-gray-600">
                        {room.location?.addressLine1}, {room.location?.city}
                    </p>
                </div>
            )}

            {/* Guest Details */}
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Guest Name"
                    className="w-full border p-2 rounded"
                    value={guest.name}
                    onChange={(e) => handleGuestSearch(e.target.value)}
                />
                {searchResults.length > 0 && (
                    <div className="border rounded bg-white shadow mt-1 max-h-48 overflow-auto">
                        {searchResults.map((u) => (
                            <div
                                key={u._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setGuest({
                                        name: u.name,
                                        email: u.email,
                                        mobileNumber: u.mobileNumber || '',
                                    });
                                    setSelectedUserId(u._id);
                                    setSearchResults([]);
                                }}
                            >
                                <p className="font-medium">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                        ))}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Guest Email"
                    className="w-full border p-2 rounded"
                    value={guest.email}
                    onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Guest Mobile Number"
                    className="w-full border p-2 rounded"
                    value={guest.mobileNumber}
                    onChange={(e) => setGuest({ ...guest, mobileNumber: e.target.value })}
                />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                />
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                />
            </div>

            {/* Guests */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="number"
                    min="1"
                    placeholder="Adults"
                    className="border p-2 rounded"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                />
                <input
                    type="number"
                    min="0"
                    placeholder="Children"
                    className="border p-2 rounded"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                />
            </div>

            <button
                onClick={handleBookGuest}
                disabled={submitting}
                className={`w-full py-2 rounded text-white 
                            ${submitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-700 hover:bg-gray-800 cursor-pointer'
                    }`}
            >
                Confirm Booking
            </button>
        </div>
    );
}
