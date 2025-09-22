'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function Banner() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  // ✅ Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split('T')[0];

  function handleSubmit(e) {
    e.preventDefault();
    if (!city || !checkInDate || !checkOutDate) return;

    // redirect to search page with query params
    router.push(
      `/search?city=${encodeURIComponent(city)}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
    );
  }

  return (
    <section
      className="relative h-[70vh] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-4">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          🕉️ Divine Destinations, Homely Stays
        </h1>

        <p className="text-lg md:text-xl mb-6">
          Enjoy the serenity of Ayodhya, the majesty of Agra, and the divinity
          of Varanasi — all with homely comfort
        </p>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 md:flex-row items-center max-w-3xl mx-auto bg-white rounded-lg overflow-hidden shadow-md p-2 md:p-0"
        >
          {/* City Dropdown */}
          <select
            className="flex-grow px-3 py-2 text-gray-800 border-none focus:outline-none w-full md:w-1/3 text-sm md:text-base"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a city
            </option>
            <option value="Ayodhya">Ayodhya</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Varanasi">Varanasi</option>
          </select>

          {/* Check-in Date */}
          <input
            type="date"
            placeholder="Check-in"
            min={today} // ✅ prevent past dates
            className="px-3 py-2 text-gray-800 border-t md:border-t-0 md:border-l w-full md:w-1/4 focus:outline-none text-sm md:text-base"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />

          {/* Check-out Date */}
          <input
            type="date"
            placeholder="Check-out"
            className="px-3 py-2 text-gray-800 border-t md:border-t-0 md:border-l w-full md:w-1/4 focus:outline-none text-sm md:text-base"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || today} // ✅ prevent before check-in date
            required
          />

          {/* Search Button */}
          <button
            type="submit"
            className="cursor-pointer px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-600 flex items-center space-x-2 w-full md:w-auto justify-center text-sm md:text-base"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </section>
  );
}

