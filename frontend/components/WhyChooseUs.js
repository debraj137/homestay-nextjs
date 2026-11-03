'use client';

import { BadgeCheck, Headphones, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  {
    icon: BadgeCheck,
    title: 'Handpicked for comfort',
    description: 'A considered collection of stays for pilgrimages, family visits and quiet getaways.',
  },
  {
    icon: Sparkles,
    title: 'Stay your way',
    description: 'Choose a full-day stay or book only the hours that fit the rhythm of your journey.',
  },
  {
    icon: ShieldCheck,
    title: 'Clarity from search to stay',
    description: 'See the essentials—location, amenities and price—before you commit.',
  },
  {
    icon: Headphones,
    title: 'Here when plans change',
    description: 'Reach a real support team when you need a hand with your booking.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#fffaf4] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_2.15fr] lg:items-end">
          <div>
            <p className="eyebrow">The Awadh way</p>
            <h2 className="font-display mt-3 text-4xl font-semibold leading-tight text-[#30231d] sm:text-5xl">Made for meaningful journeys.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[#6e625b] sm:text-lg">
            Good travel feels easy. We keep the details clear, the choices thoughtful and the welcome close at hand.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-[#e8dbcd] bg-[#e8dbcd] sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <article key={title} className="bg-[#fffdf9] p-7 sm:p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f4eadc] text-[#a54528]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-[#30231d]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#706158]">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
