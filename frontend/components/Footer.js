'use client';

import Link from 'next/link';
import { Facebook, Headphones, Mail, MapPin } from 'lucide-react';

const exploreLinks = [
  ['Ayodhya', '/search?city=Ayodhya'],
  ['Varanasi', '/search?city=Varanasi'],
  ['Mathura', '/search?city=Mathura'],
  ['Vrindavan', '/search?city=Vrindavan'],
];

export default function Footer() {
  return (
    <footer className="bg-[#281914] text-[#eaded1]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.45fr_.8fr_.8fr_1.1fr] lg:px-8">
        <div>
          <p className="font-display text-3xl font-semibold text-[#fff8ef]">Awadh Hotels</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#cdbdaf]">Thoughtful stays for the places that call you back. Find room for your journey, your people and a slower morning.</p>
          <a href="https://www.facebook.com/profile.php?id=61583136273650" target="_blank" rel="noreferrer" className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#f0c17e] transition hover:border-[#f0c17e] hover:text-white" aria-label="Awadh Hotels on Facebook">
            <Facebook className="h-4 w-4" />
          </a>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e9b96f]">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {exploreLinks.map(([label, href]) => <li key={label}><Link href={href} className="transition hover:text-[#f0c17e]">Stays in {label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e9b96f]">Help</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link href="/help-center" className="transition hover:text-[#f0c17e]">Help centre</Link></li>
            <li><Link href="/faqs" className="transition hover:text-[#f0c17e]">Frequently asked questions</Link></li>
            <li><Link href="/cancellation-policy" className="transition hover:text-[#f0c17e]">Cancellation policy</Link></li>
            <li><Link href="/terms-and-conditions" className="transition hover:text-[#f0c17e]">Terms &amp; conditions</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#e9b96f]">Talk to us</h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3"><Headphones className="mt-0.5 h-4 w-4 shrink-0 text-[#e9b96f]" /><a href="tel:+919250538645" className="transition hover:text-[#f0c17e]">+91 92505 38645</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#e9b96f]" /><a href="mailto:contact@awadhdarsan.com" className="break-all transition hover:text-[#f0c17e]">contact@awadhdarsan.com</a></li>
            <li className="flex gap-3 text-[#cdbdaf]"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e9b96f]" />Serving Ayodhya and sacred destinations across North India.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#bba99a] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Awadh Hotels. All rights reserved.</span>
          <span>Made for journeys that matter.</span>
        </div>
      </div>
    </footer>
  );
}
