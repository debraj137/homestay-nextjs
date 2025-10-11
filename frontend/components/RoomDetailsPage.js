// 'use client';
// import { useEffect, useState } from 'react';
// import { useParams, useSearchParams, useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import BookingModal from '@/components/BookingModal';
// import ReviewForm from '@/components/ReviewForm';
// import ReviewSummary from '@/components/ReviewSummary';

// export default function RoomDetailsPage() {
//   const { id } = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [room, setRoom] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [mainImage, setMainImage] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // ✅ read query params
//   const checkInDate = searchParams.get('checkInDate');
//   const checkOutDate = searchParams.get('checkOutDate');
//   const adults = searchParams.get('adults');
//   const children = searchParams.get('children');

//   // ✅ Fetch room + reviews
//   useEffect(() => {
//     async function fetchRoomAndReviews() {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || 'Failed to fetch room details');
//         setRoom(data);
//         setMainImage(data.images?.[0] || null);

//         const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${id}`);
//         const reviewsData = await reviewsRes.json();
//         if (!reviewsRes.ok) throw new Error(reviewsData.message || 'Failed to fetch reviews');
//         setReviews(reviewsData);
//       } catch (err) {
//         toast.error(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (id) fetchRoomAndReviews();
//   }, [id]);

//   if (loading) return <p className="text-gray-600">Loading...</p>;
//   if (!room) return <p className="text-gray-600">Room not found</p>;

//   function handleBookNow() {
//     if (checkInDate && checkOutDate && adults && children) {
//       // ✅ navigate directly to checkout
//       router.push(
//         `/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`
//       );
//     } else {
//       // ✅ open modal if no query params
//       setShowModal(true);
//     }
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">{room.title}</h1>

//       {/* Main Image */}
//       {mainImage && (
//         <img
//           src={mainImage}
//           alt={room.title}
//           className="w-full h-96 object-cover rounded-lg mb-6"
//         />
//       )}

//       {/* Thumbnails */}
//       <div className="flex space-x-2 mb-6">
//         {room.images?.map((img, idx) => (
//           <img
//             key={idx}
//             src={img}
//             alt={`Room Image ${idx}`}
//             onClick={() => setMainImage(img)}
//             className={`w-24 h-24 object-cover rounded-lg border cursor-pointer transition 
//               ${mainImage === img ? 'ring-2 ring-red-500' : 'hover:opacity-80'}`}
//           />
//         ))}
//       </div>

//       {/* Description */}
//       <p className="text-gray-700 mb-6">{room.description}</p>

//       {/* Details */}
//       <div className="space-y-2 mb-6">
//         <p><strong>Location:</strong> {room.location?.city}, {room.location?.state}</p>
//         <p><strong>Price:</strong> ₹{room.price}</p>
//         <p><strong>Amenities:</strong> {room.amenities?.join(', ') || 'N/A'}</p>
//         <p><strong>Max Adult Allowed:</strong> {room.maximumAllowedAdult}</p>
//         <p><strong>Max Child Allowed:</strong> {room.maximumAllowedChild}</p>
//       </div>

//       {/* Book Now */}
//       <button
//         className="cursor-pointer px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
//         onClick={handleBookNow}
//       >
//         Book Now
//       </button>

//       {/* Booking Modal */}
//       {showModal && (
//         <BookingModal
//           room={room}
//           onClose={() => setShowModal(false)}
//         />
//       )}

//       {/* Review Summary */}
//       <ReviewSummary roomId={room._id} />

//       {/* Reviews */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>

//         {reviews.length === 0 ? (
//           <p className="text-gray-500">No reviews yet. Be the first to review!</p>
//         ) : (
//           <div className="space-y-6">
//             {reviews.map((review) => (
//               <div
//                 key={review._id}
//                 className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
//               >
//                 {/* Header: Name + Date */}
//                 <div className="flex items-center justify-between mb-2">
//                   <p className="font-semibold text-gray-800">
//                     {review.userId?.name || "Anonymous"}
//                   </p>
//                   <span className="text-sm text-gray-500">
//                     {new Date(review.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>

//                 {/* Rating */}
//                 <div className="flex items-center mb-2">
//                   {Array.from({ length: 5 }).map((_, idx) => (
//                     <svg
//                       key={idx}
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill={idx < review.rating ? "currentColor" : "none"}
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       className={`w-5 h-5 ${idx < review.rating ? "text-yellow-400" : "text-gray-300"
//                         }`}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.176 0l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.517-4.674z"
//                       />
//                     </svg>
//                   ))}
//                 </div>

//                 {/* Comment */}
//                 <p className="text-gray-700">{review.comment}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Review Form (only for logged-in users) */}
//         <div className="mt-8">
//           <ReviewForm
//             roomId={room._id}
//             onReviewAdded={(newReview) => setReviews([newReview, ...reviews])}
//           />
//         </div>
//       </div>

//     </div>
//   );
// }





'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import BookingModal from '@/components/BookingModal';
import ReviewForm from '@/components/ReviewForm';
import ReviewSummary from '@/components/ReviewSummary';

export default function RoomDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ read query params
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');

  // ✅ Fetch room + reviews
  useEffect(() => {
    async function fetchRoomAndReviews() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch room details');
        setRoom(data);
        setMainImage(data.images?.[0] || null);

        const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${id}`);
        const reviewsData = await reviewsRes.json();
        if (!reviewsRes.ok) throw new Error(reviewsData.message || 'Failed to fetch reviews');
        setReviews(reviewsData);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchRoomAndReviews();
  }, [id]);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (!room) return <p className="text-gray-600">Room not found</p>;

  // ✅ Discount logic
  const price = Number(room.price) || 0;
  const discountedPrice = Number(room.discountedPrice) || 0;
  const discountPercentage = room.discountPercentage
    ? Number(room.discountPercentage)
    : discountedPrice && discountedPrice < price
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  const hasDiscount = discountPercentage > 0 && discountedPrice < price;
  const savedAmount = hasDiscount ? price - discountedPrice : 0;

  function handleBookNow() {
    if (checkInDate && checkOutDate && adults && children) {
      router.push(
        `/checkout?roomId=${room._id}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`
      );
    } else {
      setShowModal(true);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{room.title}</h1>

      {/* 🖼️ Main Image with Discount Badge */}
      <div className="relative mb-6">
        {mainImage && (
          <img
            src={mainImage}
            alt={room.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* 🖼️ Thumbnails */}
      <div className="flex space-x-2 mb-6">
        {room.images?.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Room Image ${idx}`}
            onClick={() => setMainImage(img)}
            className={`w-24 h-24 object-cover rounded-lg border cursor-pointer transition 
              ${mainImage === img ? 'ring-2 ring-red-500' : 'hover:opacity-80'}`}
          />
        ))}
      </div>

      {/* 📝 Description */}
      <p className="text-gray-700 mb-6">{room.description}</p>

      {/* 🏷️ Details */}
      <div className="space-y-2 mb-6">
        <p><strong>Location:</strong> {room.location?.city}, {room.location?.state}</p>

        {/* 💰 Discounted Price Section */}
        {hasDiscount ? (
          <p className="text-lg">
            <strong>Price:</strong>{' '}
            <span className="line-through text-gray-400">₹{price.toLocaleString('en-IN')}</span>{' '}
            <span className="text-red-600 font-bold">₹{discountedPrice.toLocaleString('en-IN')}</span>{' '}
            <span className="text-green-600 font-semibold">(Save ₹{savedAmount.toLocaleString('en-IN')})</span>
          </p>
        ) : (
          <p><strong>Price:</strong> ₹{price.toLocaleString('en-IN')}</p>
        )}

        <p><strong>Amenities:</strong> {room.amenities?.join(', ') || 'N/A'}</p>
        <p><strong>Max Adult Allowed:</strong> {room.maximumAllowedAdult}</p>
        <p><strong>Max Child Allowed:</strong> {room.maximumAllowedChild}</p>
      </div>

      {/* 🔘 Book Now */}
      <button
        className="cursor-pointer px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold"
        onClick={handleBookNow}
      >
        Book Now
      </button>

      {/* 🏨 Booking Modal */}
      {showModal && (
        <BookingModal
          room={room}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ⭐ Review Summary */}
      <ReviewSummary roomId={room._id} />

      {/* 💬 Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-lg shadow-md p-5 border border-gray-200"
              >
                {/* Reviewer Header */}
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800">
                    {review.userId?.name || "Anonymous"}
                  </p>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* ⭐ Rating */}
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={idx < review.rating ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className={`w-5 h-5 ${idx < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.176 0l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.517-4.674z"
                      />
                    </svg>
                  ))}
                </div>

                {/* Review Comment */}
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* ✍️ Review Form */}
        <div className="mt-8">
          <ReviewForm
            roomId={room._id}
            onReviewAdded={(newReview) => setReviews([newReview, ...reviews])}
          />
        </div>
      </div>
    </div>
  );
}
