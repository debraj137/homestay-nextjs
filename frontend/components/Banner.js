'use client';

import Image from 'next/image';
import { CheckCircle2, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

const SearchBox = dynamic(() => import('@/components/SearchBox'), {
  ssr: false,
  loading: () => <div className="mt-10 h-52 w-full rounded-[2rem] bg-white/80 shadow-2xl animate-pulse" />,
});

export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden bg-[#241b17]">
      <Image
        src="/hero.webp"
        alt="Illuminated temple on the banks of the Sarayu in Ayodhya"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,14,10,.9)_0%,rgba(25,15,10,.68)_43%,rgba(22,14,10,.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(20,12,8,.58),transparent)]" />

      <div className="relative mx-auto flex min-h-[780px] max-w-7xl flex-col justify-center px-4 pb-16 pt-20 sm:px-6 lg:min-h-[760px] lg:px-8">
        <div className="max-w-3xl text-white">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f6ce91]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Stay close to the story
          </div>
          <h1 className="font-display max-w-2xl text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
            Sacred places. <span className="text-[#f2c27d]">Thoughtful stays.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-100/90 sm:text-lg">
            Discover homely, handpicked stays for your journey through Ayodhya, Varanasi, Mathura and beyond.
          </p>
        </div>

        <SearchBox />

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
          {['Flexible full-day and hourly stays', 'Clear pricing, no surprises', 'Local support when you need it'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#f2c27d]" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
