'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, CheckCircle2, MapPin, ShieldCheck, Star, Users } from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import ReviewForm from '@/components/ReviewForm';
import ReviewSummary from '@/components/ReviewSummary';

function Stars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5 text-[#d49232]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(rating) ? 'fill-current' : 'text-[#e5d8c9]'}`} />)}
    </div>
  );
}

export default function RoomDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const adults = searchParams.get('adults');
  const children = searchParams.get('children');
  const bookingType = searchParams.get('bookingType') || 'full';
  const hours = searchParams.get('hours');

  useEffect(() => {
    async function fetchRoomAndReviews() {
      try {
        const [roomResponse, reviewsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews/${id}`),
        ]);
        const roomData = await roomResponse.json();
        if (!roomResponse.ok) throw new Error(roomData.message || 'Failed to fetch room details');
        setRoom(roomData);
        setMainImage(roomData.images?.[0] || null);

        if (reviewsResponse.ok) setReviews(await reviewsResponse.json());
      } catch (error) {
        toast.error(error.message || 'Could not load this stay');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRoomAndReviews();
  }, [id]);

  if (loading) {
    return <div className="min-h-[50vh] bg-[#fffaf4] px-5 py-16"><div className="mx-auto h-[460px] max-w-7xl animate-pulse rounded-[2rem] bg-[#f1e6d9]" /></div>;
  }

  if (!room) {
    return (
      <div className="bg-[#fffaf4] px-5 py-20 text-center">
        <p className="font-display text-3xl font-semibold text-[#30231d]">This stay is not available right now.</p>
        <Link href="/homestays" className="awadh-button mt-6 px-5 py-3 text-sm">Browse homestays</Link>
      </div>
    );
  }

  const price = Number(room.price) || 0;
  const listedDiscountedPrice = Number(room.discountedPrice) || 0;
  const discount = Number(room.discount ?? room.discountPercentage) || 0;
  const discountedPrice = listedDiscountedPrice > 0 && listedDiscountedPrice < price
    ? listedDiscountedPrice
    : discount > 0 ? Math.round(price - (price * discount) / 100) : price;
  const hasDiscount = discountedPrice < price;
  const savedAmount = hasDiscount ? price - discountedPrice : 0;
  const rating = Number(room.averageRating) || 0;
  const allImages = room.images || [];

  function handleBookNow() {
    const hasGuests = Boolean(adults) && children !== null;
    const canCheckoutHourly = bookingType === 'hourly' && checkInDate && hours && hasGuests;
    const canCheckoutFull = bookingType !== 'hourly' && checkInDate && checkOutDate && hasGuests;

    if (canCheckoutHourly || canCheckoutFull) {
      const parameters = new URLSearchParams({
        roomId: room._id,
        checkInDate,
        checkOutDate: bookingType === 'hourly' ? checkInDate : checkOutDate,
        adults,
        children: children ?? '0',
        bookingType,
      });
      if (bookingType === 'hourly') {
        parameters.set('hours', hours);
        if (searchParams.get('checkInTime')) parameters.set('checkInTime', searchParams.get('checkInTime'));
      }
      router.push(`/checkout?${parameters.toString()}`);
      return;
    }

    setShowModal(true);
  }

  return (
    <div className="bg-[#fffaf4] pb-20 pt-7 sm:pt-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Link href="/homestays" className="inline-flex items-center gap-2 text-sm font-bold text-[#7c6557] transition hover:text-[#a54528]"><ArrowLeft className="h-4 w-4" /> All homestays</Link>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">{room.location?.city || 'India'} stay</p>
            <h1 className="font-display mt-2 text-4xl font-semibold leading-tight text-[#30231d] sm:text-5xl">{room.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#706158]">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#a54528]" />{[room.location?.city, room.location?.state].filter(Boolean).join(', ') || 'India'}</span>
              {rating > 0 ? <span className="flex items-center gap-2"><Stars rating={rating} /><strong className="text-[#30231d]">{rating.toFixed(1)}</strong><span>({room.totalReviews || reviews.length} reviews)</span></span> : <span className="rounded-full bg-[#f4eadc] px-3 py-1 text-xs font-bold text-[#745f50]">New to Awadh</span>}
            </div>
          </div>
          {hasDiscount && <span className="w-fit rounded-full bg-[#f5e4cf] px-4 py-2 text-sm font-bold text-[#8d3c23]">Save ₹{savedAmount.toLocaleString('en-IN')} on this stay</span>}
        </div>

        <section className="mt-8 grid gap-3 lg:grid-cols-[1.65fr_.85fr]">
          <div className="relative min-h-[330px] overflow-hidden rounded-[1.6rem] bg-[#ead9c4] sm:min-h-[500px]">
            {mainImage ? <Image src={mainImage} alt={room.title} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" /> : <div className="grid h-full place-items-center text-sm font-semibold text-[#6d4b38]">Photos coming soon</div>}
            {hasDiscount && <span className="absolute left-5 top-5 rounded-full bg-[#a54528] px-3 py-1.5 text-xs font-bold text-white">{discount || Math.round((savedAmount / price) * 100)}% off</span>}
          </div>
          <div className="grid min-h-[220px] grid-cols-2 gap-3 lg:grid-cols-1">
            {allImages.slice(1, 3).map((image, index) => (
              <button key={image} type="button" onClick={() => setMainImage(image)} className="relative min-h-[150px] overflow-hidden rounded-[1.3rem] bg-[#ead9c4] text-left transition hover:opacity-90" aria-label={`Show photo ${index + 2}`}>
                <Image src={image} alt={`${room.title} view ${index + 2}`} fill sizes="(max-width: 1024px) 50vw, 35vw" className="object-cover" />
                {index === 1 && allImages.length > 3 && <span className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-bold text-white">+{allImages.length - 3} photos</span>}
              </button>
            ))}
            {allImages.length < 3 && <div className="hidden rounded-[1.3rem] bg-[#f4eadc] lg:block" />}
          </div>
        </section>

        {allImages.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {allImages.map((image, index) => <button key={image} type="button" onClick={() => setMainImage(image)} className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${mainImage === image ? 'border-[#a54528]' : 'border-transparent'}`} aria-label={`View photo ${index + 1}`}><Image src={image} alt="" fill sizes="80px" className="object-cover" /></button>)}
          </div>
        )}

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-10">
            <section>
              <p className="eyebrow">About this stay</p>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[#56483f] sm:text-lg">{room.description || 'A welcoming place to pause, rest and make the most of your journey.'}</p>
            </section>

            <section className="border-y border-[#e8dbcd] py-8">
              <h2 className="font-display text-3xl font-semibold text-[#30231d]">What you&apos;ll find here</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {room.amenities?.length ? room.amenities.map((amenity) => <span key={amenity} className="rounded-full border border-[#e1cfbc] bg-white px-3 py-2 text-sm font-semibold text-[#5e5046]">{amenity}</span>) : <span className="text-sm text-[#796b62]">Amenities will be confirmed with your booking.</span>}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4eadc] p-4"><Users className="h-5 w-5 text-[#a54528]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Capacity</p><p className="mt-1 text-sm font-semibold text-[#3a2c25]">Up to {room.maximumAllowedAdult || 1} adults{room.maximumAllowedChild ? ` · ${room.maximumAllowedChild} children` : ''}</p></div></div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4eadc] p-4"><CheckCircle2 className="h-5 w-5 text-[#a54528]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Stay options</p><p className="mt-1 text-sm font-semibold text-[#3a2c25]">Full-day and hourly booking</p></div></div>
              </div>
            </section>

            <section>
              <ReviewSummary roomId={room._id} />
              <div className="mt-12">
                <h2 className="font-display text-3xl font-semibold text-[#30231d]">From guests</h2>
                {reviews.length === 0 ? <p className="mt-4 text-sm text-[#796b62]">No reviews yet. Be the first to share your experience.</p> : <div className="mt-6 space-y-4">{reviews.map((review) => <article key={review._id} className="surface-card rounded-2xl p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-bold text-[#30231d]">{review.userId?.name || 'Awadh guest'}</p><div className="mt-2"><Stars rating={review.rating} /></div></div><time className="text-xs font-semibold text-[#8a786d]">{new Date(review.createdAt).toLocaleDateString()}</time></div><p className="mt-4 text-sm leading-6 text-[#62534a]">{review.comment}</p></article>)}</div>}
                <div className="mt-8"><ReviewForm roomId={room._id} onReviewAdded={(review) => setReviews((current) => [review, ...current])} /></div>
              </div>
            </section>
          </div>

          <aside className="surface-card rounded-[1.4rem] p-6 lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#8b7567]">Reserve this stay</p>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div>{hasDiscount && <p className="text-sm text-[#9a8980] line-through">₹{price.toLocaleString('en-IN')}</p>}<p className="text-3xl font-extrabold text-[#4b2116]">₹{discountedPrice.toLocaleString('en-IN')}</p></div>
              <span className="pb-1 text-sm text-[#796b62]">per night</span>
            </div>
            <button type="button" onClick={handleBookNow} className="awadh-button mt-6 w-full px-5 py-3.5 text-base">Choose dates &amp; book</button>
            <div className="mt-6 space-y-3 border-t border-[#eadfd3] pt-5 text-sm text-[#63544b]"><p className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-[#a54528]" />Your booking details are confirmed before you pay.</p><p className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#a54528]" />Choose full-day or hourly stays to suit your plan.</p></div>
          </aside>
        </div>
      </div>

      {showModal && <BookingModal room={room} onClose={() => setShowModal(false)} />}
    </div>
  );
}
