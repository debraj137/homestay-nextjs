// 'use client';
import slugify from "slugify";
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Filters from '@/components/Filters';
import BookingModal from '@/components/BookingModal';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Child component for each room card
function RoomCard({ room, city, checkInDate, checkOutDate, searchParams, onBookNow }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => setCurrentImage((prev) =>
    prev === room.images.length - 1 ? 0 : prev + 1
  );
  const prevImage = () => setCurrentImage((prev) =>
    prev === 0 ? room.images.length - 1 : prev - 1
  );

  const adults = searchParams.get('adults');
  const children = searchParams.get('children');

  // ✅ Build clean query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (checkInDate) params.append("checkInDate", checkInDate);
    if (checkOutDate) params.append("checkOutDate", checkOutDate);
    if (adults) params.append("adults", adults);
    if (children) params.append("children", children);
    return params.toString() ? `?${params.toString()}` : "";
  };
  const queryString = buildQueryString();

  // ✅ Handle Book Now click (fix double “?”)
  const handleBookNow = (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate || !adults || !children) {
      onBookNow(room);
      return;
    }
    const extraQS = queryString ? `&${queryString.substring(1)}` : '';
    window.location.href = `/checkout?roomId=${room._id}${extraQS}`;
  };

  // ✅ Discount handling
  const price = Number(room.price) || 0;
  const discountedPrice = Number(room.discountedPrice) || 0;
  const discountPercentage = room.discountPercentage
    ? Number(room.discountPercentage)
    : discountedPrice && discountedPrice < price
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  const hasDiscount = discountPercentage > 0 && discountedPrice < price;
  const savedAmount = hasDiscount ? price - discountedPrice : 0;

  return (
    <div
      key={room._id}
      className="flex flex-col md:flex-row bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
    >
      {/* 🖼️ Image Carousel */}
      <div className="relative w-full md:w-1/3 h-[268px] overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
        {room.images?.length > 0 ? (
          <img
            src={room.images[currentImage]}
            alt={room.title}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        {/* Carousel Arrows */}
        {room.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* ⭕ Rounded dots (carousel indicators) */}
        {room.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {room.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === currentImage ? "bg-white" : "bg-gray-400"}`}
              />
            ))}
          </div>
        )}

        {/* 🔴 Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* 🏷️ Details Section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            <a
              href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}${queryString}`}
              className="hover:text-red-500 transition-colors duration-200"
            >
              {room.title}
            </a>
          </h2>
          <p className="text-sm text-gray-500">
            {room.location?.city}, {room.location?.state}
          </p>

          {/* ⭐ Rating */}
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="ml-1 text-sm font-semibold">{room.averageRating ?? 0}</span>
            <span className="ml-1 text-xs text-gray-500">
              ({room.totalReviews ?? 0} reviews)
            </span>
          </div>

          {/* 💰 Price Section */}
          {hasDiscount ? (
            <div className="mt-3 flex items-baseline space-x-3">
              <p className="text-gray-400 line-through text-base">₹{price.toLocaleString('en-IN')}</p>
              <p className="text-red-600 font-bold text-lg">₹{discountedPrice.toLocaleString('en-IN')}</p>
              <span className="text-sm text-green-600 font-semibold">Save ₹{savedAmount.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <p className="text-red-600 font-bold text-lg mt-3">
              ₹{room.price.toLocaleString('en-IN')} <span className="text-sm text-gray-500">/ night</span>
            </p>
          )}

          {/* 🏡 Amenities */}
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {room.amenities.slice(0, 5).map((a, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs bg-gray-200 border border-gray-200 rounded-full text-gray-700"
                >
                  {a}
                </span>
              ))}
              {room.amenities.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{room.amenities.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* 🔘 Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleBookNow}
            className="flex-1 text-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
          >
            Book Now
          </button>
          <a
            href={`/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}${queryString}`}
            className="flex-1 text-center border border-gray-500 text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50 font-semibold"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}

// ✅ Main SearchPageContent Component
export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [propertyQuery, setPropertyQuery] = useState("");

  // ✅ Fetch rooms
  useEffect(() => {
    async function fetchInitial() {
      if (!city) {
        setRooms([]);
        return;
      }

      try {
        setLoading(true);
        const query = new URLSearchParams({ city });
        if (checkInDate) query.set('checkInDate', checkInDate);
        if (checkOutDate) query.set('checkOutDate', checkOutDate);
        if (adults) query.set('adults', adults);
        if (children) query.set('children', children);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/search?${query.toString()}`);
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

  // ✅ Filter apply
  async function handleFilterApply(filters) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxPrice: filters.maxPrice ?? null,
          amenities: filters.amenities ?? [],
          minRating: filters.minRating ?? null,
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

  // ✅ Property name filter
  const filteredRooms = useMemo(() => {
    if (!propertyQuery.trim()) return rooms;
    return rooms.filter((room) =>
      room.title.toLowerCase().includes(propertyQuery.toLowerCase())
    );
  }, [rooms, propertyQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-6 lg:pt-[54px] md:pt-[54px]">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Search By Property Name
          </label>
          <input
            type="text"
            placeholder="Enter property name..."
            value={propertyQuery}
            onChange={(e) => setPropertyQuery(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>

        <Filters onApply={handleFilterApply} />
      </div>

      {/* Results */}
      <div className="md:col-span-3">
        <h1 className="text-2xl font-bold mb-6">
          Stays in {city ?? 'Selected City'}{' '}
          {checkInDate && checkOutDate ? ` — ${checkInDate} to ${checkOutDate}` : ''}
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : filteredRooms.length === 0 ? (
          <p className="text-gray-600">No rooms available for your search.</p>
        ) : (
          <div className="space-y-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                city={city}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                searchParams={searchParams}
                onBookNow={(room) => setSelectedRoom(room)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
