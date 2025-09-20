'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import BookingModal from '@/components/BookingModal';
export default function RoomDetailsPage() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        async function fetchRoom() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch room details');
                setRoom(data);
                setMainImage(data.images?.[0] || null); // set default main image
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchRoom();
    }, [id]);

    if (loading) return <p className="text-gray-600">Loading...</p>;
    if (!room) return <p className="text-gray-600">Room not found</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{room.title}</h1>

            {/* Main Image */}
            {mainImage && (
                <img
                    src={mainImage}
                    alt={room.title}
                    className="w-full h-96 object-cover rounded-lg mb-6"
                />
            )}

            {/* Thumbnails */}
            <div className="flex space-x-2 mb-6">
                {room.images?.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`Room Image ${idx}`}
                        onClick={() => setMainImage(img)} // 👉 update main image on click
                        className={`w-24 h-24 object-cover rounded-lg border cursor-pointer transition 
              ${mainImage === img ? 'ring-2 ring-red-500' : 'hover:opacity-80'}`}
                    />
                ))}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6">{room.description}</p>

            {/* Details */}
            <div className="space-y-2 mb-6">
                <p><strong>Location:</strong> {room.location?.city}, {room.location?.state}</p>
                <p><strong>Price:</strong> ₹{room.price}</p>
                <p><strong>Amenities:</strong> {room.amenities?.join(', ') || 'N/A'}</p>
                <p><strong>Max Adult Allowed:</strong> {room.maximumAllowedAdult}</p>
                <p><strong>Max Child Allowed:</strong> {room.maximumAllowedChild}</p>
            </div>

            {/* Book Now */}
            <button className="cursor-pointer px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                onClick={() => setShowModal(true)}>
                Book Now
            </button>
            {/* Popup Modal */}
            {showModal && (
                <BookingModal room={room} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}
