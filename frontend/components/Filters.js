'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal, Star } from 'lucide-react';

export default function Filters({ onApply }) {
  const [price, setPrice] = useState(2500);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minRating, setMinRating] = useState(null);

  useEffect(() => {
    async function fetchAmenities() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/amenities`);
        const data = await response.json();
        setAmenities(Array.isArray(data) ? data : data.amenities || []);
      } catch (error) {
        console.error('Failed to fetch amenities', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAmenities();
  }, []);

  function toggleAmenity(value) {
    setSelectedAmenities((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  return (
    <aside className="surface-card rounded-[1.35rem] p-5 sm:p-6">
      <div className="flex items-center justify-between border-b border-[#eadfd3] pb-4">
        <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#a54528]" /><h2 className="font-display text-2xl font-semibold text-[#30231d]">Refine your stay</h2></div>
        <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Filters</span>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4"><label htmlFor="price" className="text-sm font-bold text-[#4a3a30]">Nightly budget</label><span className="text-sm font-extrabold text-[#a54528]">Up to ₹{price.toLocaleString('en-IN')}</span></div>
        <input id="price" type="range" min="0" max="2500" step="100" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="mt-4 w-full accent-[#a54528]" />
        <div className="mt-1 flex justify-between text-xs text-[#9a887c]"><span>₹0</span><span>₹2,500+</span></div>
      </div>

      <fieldset className="mt-7 border-t border-[#eadfd3] pt-6">
        <legend className="text-sm font-bold text-[#4a3a30]">Guest rating</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[null, 3, 4, 5].map((rating) => {
            const selected = minRating === rating;
            return <button key={rating ?? 'any'} type="button" onClick={() => setMinRating(rating)} className={`rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${selected ? 'border-[#a54528] bg-[#fff4e7] text-[#8d3b23]' : 'border-[#e4d6c7] bg-white text-[#68584e] hover:border-[#cda88e]'}`}>{rating ? <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-[#d49232] text-[#d49232]" />{rating}+ rated</span> : 'Any rating'}</button>;
          })}
        </div>
      </fieldset>

      <fieldset className="mt-7 border-t border-[#eadfd3] pt-6">
        <legend className="text-sm font-bold text-[#4a3a30]">Amenities</legend>
        {loading ? <p className="mt-3 text-sm text-[#8b7567]">Loading amenities…</p> : amenities.length === 0 ? <p className="mt-3 text-sm text-[#8b7567]">Amenities are not available yet.</p> : <div className="mt-3 flex flex-wrap gap-2">{amenities.map((amenity) => <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} aria-pressed={selectedAmenities.includes(amenity)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedAmenities.includes(amenity) ? 'border-[#a54528] bg-[#fff0df] text-[#8d3b23]' : 'border-[#e6d8c9] bg-white text-[#69594e] hover:border-[#cda88e]'}`}>{amenity}</button>)}</div>}
      </fieldset>

      <button type="button" onClick={() => onApply({ maxPrice: price, amenities: selectedAmenities, minRating })} className="awadh-button mt-7 w-full px-5 py-3 text-sm">Show matching stays</button>
    </aside>
  );
}
