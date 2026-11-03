'use client';

import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';

const destinations = [
  { city: 'Ayodhya', note: 'A stay for darshan, celebrations and unhurried mornings.', tone: 'from-[#4d1f1b] via-[#76301e] to-[#b95e30]' },
  { city: 'Varanasi', note: 'Wake close to the ghats and the living rhythm of the city.', tone: 'from-[#482720] via-[#775037] to-[#ba8a55]' },
  { city: 'Mathura & Vrindavan', note: 'Rest between temple visits, family time and sacred streets.', tone: 'from-[#4a3527] via-[#7f5b3c] to-[#bc9163]' },
];

export default function FeaturedHomestays() {
  return (
    <section className="bg-[#302018] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e7b66f]">Begin with a place</p>
            <h2 className="font-display mt-3 text-4xl font-semibold text-[#fff8ef] sm:text-5xl">Find your way there.</h2>
          </div>
          <Link href="/homestays" className="inline-flex items-center gap-2 text-sm font-bold text-[#f4c57f] transition hover:text-white">
            Browse every stay <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.city}
              href={`/search?city=${encodeURIComponent(destination.city === 'Mathura & Vrindavan' ? 'Mathura' : destination.city)}`}
              className={`group relative min-h-[250px] overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${destination.tone} p-7 transition duration-300 hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border border-white/10" />
              <div className="absolute -bottom-28 -left-16 h-52 w-52 rounded-full border border-white/10" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-xs font-bold text-white/90">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Explore
                </span>
                <div>
                  <h3 className="font-display text-3xl font-semibold text-white">{destination.city}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">{destination.note}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#ffcf8c]">See stays <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
