'use client';
import { useRouter } from 'next/navigation';
export default function FeaturedHomestays() {
  const router = useRouter();
  return (
    <section className="py-16 bg-gray-50 text-center">
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Featured Homestays
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Discover our handpicked selection of luxury accommodations
        </p>

        {/* Button */}
        <button className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition"
        onClick={() => router.push('/homestays')}>
          View All Homestays
        </button>
      </div>
    </section>
  );
}
