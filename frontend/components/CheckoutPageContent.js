'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, CreditCard, ShieldCheck, UserRound, WalletCards } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import CouponInput from '@/components/CouponInput';
import BookingSuccessModal from '@/components/BookingSuccessModal';
import { API_BASE } from '@/lib/api';

function calculatePrices({ room, bookingType, hours, checkInDate, checkOutDate, couponDiscountAmount }) {
  let actual;
  if (bookingType === 'hourly' && hours) {
    actual = hours <= 3 ? room.price / 4 : room.price / 4 + (room.price / 12) * (hours - 3);
  } else {
    const difference = checkInDate && checkOutDate
      ? (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
      : 1;
    actual = room.price * Math.max(1, difference || 1);
  }

  actual = Math.round(actual || 0);
  const roomDiscountSaving = Number(room.discount) > 0 ? Math.round((actual * Number(room.discount)) / 100) : 0;
  const finalPrice = couponDiscountAmount > 0 ? actual - couponDiscountAmount : actual - roomDiscountSaving;
  return { actualPrice: actual, roomDiscountSaving, finalPrice: Math.max(0, Math.round(finalPrice)) };
}

export default function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const bookingType = searchParams.get('bookingType') || 'full';
  const roomId = searchParams.get('roomId');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const checkInTime = searchParams.get('checkInTime');
  const hours = Number(searchParams.get('hours')) || null;
  const adults = Number(searchParams.get('adults')) || 1;
  const children = Number(searchParams.get('children')) || 0;

  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [applyDisabled, setApplyDisabled] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, router, user]);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) {
        setLoadingRoom(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/rooms/${roomId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch room');
        setRoom(data);
      } catch (error) {
        toast.error(error.message || 'Failed to load room');
      } finally {
        setLoadingRoom(false);
      }
    }
    fetchRoom();
  }, [roomId]);

  const { actualPrice, roomDiscountSaving, finalPrice } = useMemo(() => {
    if (!room) return { actualPrice: 0, roomDiscountSaving: 0, finalPrice: 0 };
    return calculatePrices({ room, bookingType, hours, checkInDate, checkOutDate, couponDiscountAmount });
  }, [bookingType, checkInDate, checkOutDate, couponDiscountAmount, hours, room]);

  async function handleBooking() {
    if (!user || !room) return;
    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');
      const pricing = calculatePrices({ room, bookingType, hours, checkInDate, checkOutDate, couponDiscountAmount });
      const payload = {
        userId: user.id,
        roomId,
        checkInDate,
        checkOutDate,
        bookingType,
        checkInTime,
        hours,
        numberOfAdult: adults,
        numberOfChild: children,
        subtotal: pricing.actualPrice,
        totalPrice: pricing.finalPrice,
        mobileNumber: user.mobileNumber,
        status: 'confirmed',
        couponCode: appliedCoupon?.code || undefined,
      };
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Booking failed');
      setBookingResult(data);
      setShowBookingModal(true);
      toast.success('Booking confirmed!', { duration: 4000 });
    } catch (error) {
      toast.error(error.message || 'Booking failed', { duration: 5000 });
    } finally {
      setBookingLoading(false);
    }
  }

  function onCouponApply(result) {
    if (result.success) {
      setAppliedCoupon({ ...result.coupon, code: result.code || result.coupon?.code });
      setCouponDiscountAmount(Number(result.discountAmount) || 0);
      setApplyDisabled(true);
      toast.success('Coupon applied');
      return;
    }
    setAppliedCoupon(null);
    setCouponDiscountAmount(0);
    setApplyDisabled(false);
    if (result.message) toast.error(result.message);
  }

  if (loadingRoom || authLoading) return <div className="min-h-[50vh] bg-[#fffaf4] px-5 py-16"><div className="mx-auto h-80 max-w-6xl animate-pulse rounded-[2rem] bg-[#f1e6d9]" /></div>;
  if (!room) return <div className="min-h-[50vh] bg-[#fffaf4] px-5 py-20 text-center text-[#7a3320]">Room not found.</div>;

  const isCouponApplied = couponDiscountAmount > 0;
  const paymentOptions = [
    ['card', 'Credit or debit card'],
    ['upi', 'UPI (Google Pay, PhonePe, Paytm)'],
    ['payAtHotel', 'Pay at hotel'],
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#fffaf4] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">One last step</p>
          <h1 className="font-display mt-3 text-4xl font-semibold text-[#30231d] sm:text-5xl">Complete your stay.</h1>
          <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-full border border-[#e5d5c4] bg-white text-xs font-bold text-[#7a675b]">
            <span className="border-r border-[#eadfd3] px-2 py-3"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-[#a54528]" />Choose</span>
            <span className="border-r border-[#eadfd3] px-2 py-3"><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-[#a54528]" />Details</span>
            <span className="bg-[#f5e8dc] px-2 py-3 text-[#7b321f]">3. Confirm</span>
          </div>
        </div>

        <div className="mt-10 grid gap-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.75fr)] lg:items-start">
          <div className="space-y-7">
            <section className="surface-card rounded-[1.4rem] p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 border-b border-[#eadfd3] pb-5">
                <div><p className="eyebrow">Your selection</p><h2 className="font-display mt-2 text-3xl font-semibold text-[#30231d]">{room.title}</h2></div>
                <span className="rounded-full bg-[#f4eadc] px-3 py-1.5 text-xs font-bold text-[#745f50]">{bookingType === 'hourly' ? 'Hourly stay' : 'Full-day stay'}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-2xl bg-[#f9f2e9] p-4"><CalendarDays className="h-5 w-5 shrink-0 text-[#a54528]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Check-in</p><p className="mt-1 text-sm font-bold text-[#372a23]">{checkInDate || 'Choose date'} {checkInTime && `· ${checkInTime}`}</p></div></div>
                <div className="flex gap-3 rounded-2xl bg-[#f9f2e9] p-4">{bookingType === 'hourly' ? <Clock3 className="h-5 w-5 shrink-0 text-[#a54528]" /> : <CalendarDays className="h-5 w-5 shrink-0 text-[#a54528]" />}<div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">{bookingType === 'hourly' ? 'Duration' : 'Check-out'}</p><p className="mt-1 text-sm font-bold text-[#372a23]">{bookingType === 'hourly' ? `${hours || 0} hours` : checkOutDate || 'Choose date'}</p></div></div>
                <div className="flex gap-3 rounded-2xl bg-[#f9f2e9] p-4 sm:col-span-2"><UserRound className="h-5 w-5 shrink-0 text-[#a54528]" /><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Guests</p><p className="mt-1 text-sm font-bold text-[#372a23]">{adults} adult{adults !== 1 ? 's' : ''}{children ? ` · ${children} child${children !== 1 ? 'ren' : ''}` : ''}</p></div></div>
              </div>
            </section>

            <section className="surface-card rounded-[1.4rem] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#eadfd3] pb-5"><UserRound className="h-5 w-5 text-[#a54528]" /><h2 className="font-display text-2xl font-semibold text-[#30231d]">Your information</h2></div>
              <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><p><span className="block text-xs font-bold uppercase tracking-[.11em] text-[#8b7567]">Name</span><span className="mt-1 block font-semibold text-[#3b2c24]">{user?.name}</span></p><p><span className="block text-xs font-bold uppercase tracking-[.11em] text-[#8b7567]">Mobile</span><span className="mt-1 block font-semibold text-[#3b2c24]">{user?.mobileNumber}</span></p><p className="sm:col-span-2"><span className="block text-xs font-bold uppercase tracking-[.11em] text-[#8b7567]">Email</span><span className="mt-1 block font-semibold text-[#3b2c24]">{user?.email}</span></p></div>
            </section>

            <section className="surface-card rounded-[1.4rem] p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-[#eadfd3] pb-5"><WalletCards className="h-5 w-5 text-[#a54528]" /><h2 className="font-display text-2xl font-semibold text-[#30231d]">Payment method</h2></div>
              <div className="mt-5 space-y-3">
                {paymentOptions.map(([method, label]) => <label key={method} className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-4 transition ${paymentMethod === method ? 'border-[#a54528] bg-[#fff8f1] shadow-sm' : 'border-[#e5d8cb] bg-white hover:border-[#cda88e]'}`}><span className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-full ${paymentMethod === method ? 'bg-[#f1ddc8] text-[#a54528]' : 'bg-[#f7f0e8] text-[#77665a]'}`}><CreditCard className="h-4 w-4" /></span><span className="text-sm font-bold text-[#3b2c24]">{label}</span></span><input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="h-4 w-4 accent-[#a54528]" /></label>)}
              </div>
            </section>
          </div>

          <aside className="surface-card rounded-[1.4rem] p-6 lg:sticky lg:top-24">
            <p className="eyebrow">Price summary</p>
            <div className="mt-5 space-y-3 text-sm text-[#5f5047]">
              <div className="flex justify-between gap-4"><span>Stay subtotal</span><span className="font-semibold text-[#30231d]">₹{actualPrice.toLocaleString('en-IN')}</span></div>
              {!isCouponApplied && roomDiscountSaving > 0 && <div className="flex justify-between gap-4 text-[#39704d]"><span>Stay discount ({room.discount}%)</span><span className="font-semibold">− ₹{roomDiscountSaving.toLocaleString('en-IN')}</span></div>}
              {isCouponApplied && <div className="flex justify-between gap-4 text-[#39704d]"><span>Coupon discount</span><span className="font-semibold">− ₹{couponDiscountAmount.toLocaleString('en-IN')}</span></div>}
            </div>
            <div className="mt-5 border-y border-[#eadfd3] py-5"><div className="flex items-end justify-between gap-4"><span className="font-bold text-[#3c2d25]">Total payable</span><span className="text-3xl font-extrabold text-[#4b2116]">₹{finalPrice.toLocaleString('en-IN')}</span></div></div>
            <CouponInput subtotal={actualPrice} roomId={roomId} onApply={onCouponApply} disabled={applyDisabled} />
            <p className="mt-3 text-xs leading-5 text-[#837269]">A coupon replaces the room discount and is calculated from the stay subtotal.</p>
            <button onClick={handleBooking} disabled={bookingLoading} className="awadh-button mt-6 w-full px-5 py-3.5 text-base">{bookingLoading ? 'Confirming your booking…' : 'Confirm booking'}</button>
            <p className="mt-4 flex gap-2 text-xs leading-5 text-[#716158]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#a54528]" />Review your booking details before confirming.</p>
          </aside>
        </div>

        <BookingSuccessModal booking={bookingResult} room={room} userEmail={user?.email} open={showBookingModal} onClose={() => setShowBookingModal(false)} onGoToBookings={() => { setShowBookingModal(false); router.push('/my-bookings'); }} />
      </div>
    </div>
  );
}
