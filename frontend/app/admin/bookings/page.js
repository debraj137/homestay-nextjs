'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/admin/bookings`,
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
      }
    }
    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg shadow">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Room Title</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Booked By</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Check-in</th>
              <th className="p-3 text-left">Check-out</th>
              <th className="p-3 text-left">Adult</th>
              <th className="p-3 text-left">Child</th>
              <th className="p-3 text-left">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3">{b.roomId?.title}</td>
                  <td className="p-3">
                    {b.roomId?.location?.addressLine1},{' '}
                    {b.roomId?.location?.city},{' '}
                    {b.roomId?.location?.state} -{' '}
                    {b.roomId?.location?.pincode}
                  </td>
                  <td className="p-3">{b.userId?.name}</td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3">
                    {new Date(b.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">{b.numberOfAdult}</td>
                  <td className="p-3">{b.numberOfChild}</td>
                  <td className="p-3">₹{b.totalPrice}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
