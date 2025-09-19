'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Users } from 'lucide-react';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchBookings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/bookings/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setBookings(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [user]);

  if (loading) return <p className="text-center py-8">Loading bookings...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">You don’t have any bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const room = booking.roomId;
            const loc = room?.location || {};
            return (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition"
              >
                {/* Room Image */}
                {room?.images?.[0] ? (
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Details */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1">{room?.title}</h2>

                  {/* Full Address */}
                  <p className="flex items-start text-xs text-gray-600 mb-2">
                    <MapPin className="h-3 w-3 mr-1 mt-0.5" />
                    <span>
                      {loc.addressLine1 || ''}{loc.addressLine1 && ', '}
                      {loc.addressLine2 || ''}{loc.addressLine2 && ', '}
                      {loc.city || ''}, {loc.state || ''} - {loc.pincode || ''}
                    </span>
                  </p>

                  {/* Dates */}
                  <p className="flex items-center text-xs text-gray-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(booking.checkInDate).toLocaleDateString()} →{' '}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </p>

                  {/* Guests */}
                  <p className="flex items-center text-xs text-gray-700">
                    <Users className="h-3 w-3 mr-1" />
                    {booking.numberOfAdult} Adults, {booking.numberOfChild} Children
                  </p>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      ₹{booking.totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
