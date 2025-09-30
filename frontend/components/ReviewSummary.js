// "use client";
// import { useEffect, useState } from "react";

// function ReviewSummary({ roomId }) {
//     const [summary, setSummary] = useState(null);

//     useEffect(() => {
//         async function fetchSummary() {
//             try {
//                 const res = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_BASE}/reviews/summary/${roomId}`,
//                     { cache: "no-store" } // ✅ prevents Next.js from trying SSR cache
//                 );

//                 if (!res.ok) throw new Error("Failed to fetch summary");

//                 const data = await res.json();
//                 setSummary(data);
//             } catch (err) {
//                 console.error("❌ Error fetching summary:", err.message);
//             }
//         }
//         if (roomId) fetchSummary();
//     }, [roomId]);

//     if (!summary) return null;

//     const { averageRating, totalReviews, breakdown } = summary;

//     return (
//         <div className="bg-white border rounded-lg shadow-sm p-6 mt-8">
//             <h2 className="text-xl font-bold mb-2">Guest reviews</h2>

//             {/* Average Rating */}
//             <div className="flex items-center gap-2 mb-4">
//                 <span className="text-3xl font-bold">{averageRating}</span>
//                 <span className="text-yellow-500">★</span>
//                 <span className="text-gray-600">out of 5</span>
//             </div>
//             <p className="text-gray-600 mb-6">{totalReviews} guest reviews</p>

//             {/* Breakdown */}
//             {Object.entries(breakdown)
//                 .sort(([a], [b]) => b - a) // 5 → 1
//                 .map(([star, count]) => {
//                     const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
//                     return (
//                         <div key={star} className="flex items-center mb-2">
//                             <span className="w-12 text-sm">{star} star</span>
//                             <div className="flex-1 h-3 bg-gray-200 rounded mx-2">
//                                 <div
//                                     className="h-3 bg-orange-500 rounded"
//                                     style={{ width: `${percentage}%` }}
//                                 />
//                             </div>
//                             <span className="text-sm text-gray-600">{percentage}%</span>
//                         </div>
//                     );
//                 })}
//         </div>
//     );
// }

// export default ReviewSummary;
"use client";
import { useEffect, useState } from "react";

function ReviewSummary({ roomId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/reviews/summary/${roomId}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Failed to fetch summary");

        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("❌ Error fetching summary:", err.message);
      }
    }
    if (roomId) fetchSummary();
  }, [roomId]);

  if (!summary) return null;

  const { averageRating, totalReviews, breakdown } = summary;

  return (
    <div className="bg-gray-50 rounded-2xl shadow-sm p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Guest Reviews</h2>

      {/* Top Section */}
      <div className="flex items-center gap-6 mb-8">
        {/* Circle Badge */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-400 text-white text-3xl font-bold shadow-md">
          {averageRating}
        </div>

        {/* Stars + Count */}
        <div>
          <div className="flex items-center mb-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <svg
                key={idx}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={idx < Math.round(averageRating) ? "#facc15" : "#e5e7eb"}
                className="w-6 h-6"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.176 0l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.517-4.674z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            Based on {totalReviews} guest reviews
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        {Object.entries(breakdown)
          .sort(([a], [b]) => b - a)
          .map(([star, count]) => {
            const percentage = totalReviews
              ? Math.round((count / totalReviews) * 100)
              : 0;
            return (
              <div key={star} className="flex items-center">
                <span className="w-14 text-sm text-gray-700 font-medium">
                  {star} star
                </span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full mx-3 overflow-hidden">
                  <div
                    className="h-4 bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{percentage}%</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ReviewSummary;
