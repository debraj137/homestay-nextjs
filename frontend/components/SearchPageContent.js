'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Filters from '@/components/Filters';
import BookingModal from '@/components/BookingModal';
import toast from 'react-hot-toast';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults');
  console.log("Adults:", adults);
  const children = searchParams.get('children');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    async function fetchInitial() {
      if (!city || !checkInDate || !checkOutDate) {
        setRooms([]);
        return;
      }
      try {
        setLoading(true);
        const query = new URLSearchParams({ city, checkInDate, checkOutDate, adults, children });
        console.log("Fetching with query:", query.toString());
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/rooms/search?${query.toString()}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch rooms');
        setRooms(data);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch rooms');
      } finally {
        setLoading(false);
      }
    }

    fetchInitial();
  }, [city, checkInDate, checkOutDate, adults, children]);

  async function handleFilterApply(filters) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxPrice: filters.maxPrice ?? null,
          amenities: filters.amenities ?? [],
          city,
          checkInDate,
          checkOutDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to apply filters');
      setRooms(data);
    } catch (err) {
      toast.error(err.message || 'Failed to apply filters');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Filters onApply={handleFilterApply} />
      </div>

      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-4">
          Stays in {city ?? 'Selected City'}{' '}
          {checkInDate && checkOutDate ? ` — ${checkInDate} to ${checkOutDate}` : ''}
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-600">No rooms available for your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="flex flex-col md:flex-row bg-white rounded-lg shadow overflow-hidden border">
                {room.images?.[0] ? (
                  <img src={room.images[0]} alt={room.title} className="w-full md:w-1/3 h-56 object-cover" />
                ) : (
                  <div className="w-full md:w-1/3 h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold">{room.title}</h2>
                    <p className="text-sm text-gray-500">{room.location?.city}, {room.location?.state}</p>
                    <p className="text-red-600 font-bold mt-2">₹{room.price} / night</p>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {/* <button onClick={() => setSelectedRoom(room)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Book Now
                    </button> */}
                    {/* ✅ Direct to checkout */}
                    <a
                      href={`/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}`}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Book Now
                    </a>
                    <a href={`/rooms/${room._id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${searchParams.get('adults')}&children=${searchParams.get('children')}`}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRoom && (
        <BookingModal room={selectedRoom} checkInDate={checkInDate} checkOutDate={checkOutDate} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}
