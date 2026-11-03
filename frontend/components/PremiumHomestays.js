'use client';

import Image from 'next/image';
import Link from 'next/link';
import slugify from 'slugify';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Crown, Gem, MapPin, Medal, Star } from 'lucide-react';
import BookingModal from '@/components/BookingModal';

const categories = [
  { key: 'Gold', title: 'Gold stays', description: 'Comfortable, well-located stays for an easy arrival.', Icon: Medal, tone: 'bg-[#fbefd9] text-[#8a5215]', accent: 'text-[#8a5215]' },
  { key: 'Silver', title: 'Silver stays', description: 'Straightforward comfort with the essentials in place.', Icon: Crown, tone: 'bg-[#f0ebe5] text-[#64564b]', accent: 'text-[#64564b]' },
  { key: 'Diamond', title: 'Diamond stays', description: 'More room, more detail and a little more occasion.', Icon: Gem, tone: 'bg-[#f6e8e8] text-[#8d3b3c]', accent: 'text-[#8d3b3c]' },
];

function RoomCard({ room, category, onBookNow }) {
  const price = Number(room.price) || 0;
  const discount = Number(room.discount) || 0;
  const discountedPrice = discount > 0 ? Math.round(price - (price * discount) / 100) : price;
  const roomUrl = `/rooms/${slugify(`${room.title}-in-${room.location?.city || ''}`, { lower: true })}/${room._id}`;

  return (
    <article className="group overflow-hidden rounded-[1.35rem] border border-[#e8dbcd] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(63,36,21,.14)]">
      <Link href={roomUrl} className="relative block h-56 overflow-hidden bg-[#ead9c4]">
        {room.images?.[0] ? (
          <Image src={room.images[0]} alt={room.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#ead6bc,#b97a53)] text-sm font-semibold text-[#5d3725]">Photos coming soon</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
        {discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-[#a54528] px-3 py-1 text-xs font-bold text-white">Save {discount}%</span>}
        <span className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${category.tone}`}>
          <category.Icon className="h-3.5 w-3.5" aria-hidden="true" /> {category.key}
        </span>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-[#30231d]"><Link href={roomUrl} className="transition hover:text-[#a54528]">{room.title}</Link></h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#796b62]"><MapPin className="h-3.5 w-3.5 text-[#a54528]" aria-hidden="true" />{room.location?.city || 'India'}{room.location?.state ? `, ${room.location.state}` : ''}</p>
          </div>
          {Number(room.averageRating) > 0 && <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#fff3dc] px-2 py-1 text-xs font-bold text-[#7c531f]"><Star className="h-3 w-3 fill-current" />{Number(room.averageRating).toFixed(1)}</span>}
        </div>

        {room.amenities?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity) => <span key={amenity} className="rounded-full bg-[#f8f1e9] px-2.5 py-1 text-xs font-medium text-[#67574d]">{amenity}</span>)}
            {room.amenities.length > 3 && <span className="px-1 py-1 text-xs font-semibold text-[#86766c]">+{room.amenities.length - 3} more</span>}
          </div>
        )}

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-[#eee2d5] pt-4">
          <div>
            {discount > 0 && <p className="text-xs text-[#918076] line-through">₹{price.toLocaleString('en-IN')}</p>}
            <p className={`text-xl font-extrabold ${category.accent}`}>₹{discountedPrice.toLocaleString('en-IN')}<span className="ml-1 text-xs font-semibold text-[#796b62]">/ night</span></p>
          </div>
          <button type="button" onClick={() => onBookNow(room)} className="awadh-button px-4 py-2.5 text-sm">Book now</button>
        </div>
      </div>
    </article>
  );
}

export default function PremiumHomestays() {
  const [roomsByCategory, setRoomsByCategory] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const responses = await Promise.all(categories.map(async (category) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/category/${category.key}`);
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || `Could not load ${category.title}`);
          return [category.key, data];
        }));
        setRoomsByCategory(Object.fromEntries(responses));
      } catch (error) {
        toast.error(error.message || 'Failed to load stays');
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <section className="bg-[#fffaf4] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Handpicked stays</p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-[#30231d] sm:text-5xl">A place that feels right.</h2>
          </div>
          <Link href="/homestays" className="inline-flex items-center gap-2 text-sm font-bold text-[#a54528] transition hover:text-[#71301f]">View all homestays <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-12 space-y-16">
          {categories.map((category) => {
            const rooms = roomsByCategory[category.key] || [];
            return (
              <section key={category.key}>
                <div className="mb-6 flex items-end justify-between gap-5 border-b border-[#e8dbcd] pb-5">
                  <div className="flex items-start gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${category.tone}`}><category.Icon className="h-5 w-5" /></span>
                    <div>
                      <h3 className="text-xl font-bold text-[#30231d]">{category.title}</h3>
                      <p className="mt-1 text-sm text-[#796b62]">{category.description}</p>
                    </div>
                  </div>
                  {!loading && rooms.length > 0 && <span className="hidden text-sm font-semibold text-[#8b7567] sm:block">{rooms.length} available</span>}
                </div>

                {loading ? (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => <div key={item} className="h-[380px] animate-pulse rounded-[1.35rem] bg-[#f1e6d9]" />)}
                  </div>
                ) : rooms.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => <RoomCard key={room._id} room={room} category={category} onBookNow={setSelectedRoom} />)}
                  </div>
                ) : (
                  <div className="rounded-[1.2rem] border border-dashed border-[#d9c8b6] bg-white px-6 py-8 text-sm text-[#796b62]">New stays in this collection will appear here shortly.</div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {selectedRoom && <BookingModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </section>
  );
}
