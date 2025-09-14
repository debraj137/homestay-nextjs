'use client';
import { Search, Star, Users } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-blue-600" />,
      title: 'Easy Booking',
      desc: 'Simple and secure booking process with instant confirmation',
      bg: 'bg-blue-100',
    },
    {
      icon: <Star className="h-6 w-6 text-green-600" />,
      title: 'Premium Quality',
      desc: 'Hand-selected luxury hotels with exceptional service standards',
      bg: 'bg-green-100',
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600" />,
      title: '24/7 Support',
      desc: 'Round-the-clock customer support for all your travel needs',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full ${f.bg} mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
