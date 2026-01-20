'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import CouponInput from '@/components/CouponInput';
import BookingSuccessModal from '@/components/BookingSuccessModal';
import { API_BASE } from '@/lib/api';

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

  // coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [applyDisabled, setApplyDisabled] = useState(false);

  // booking result modal state
  const [bookingResult, setBookingResult] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${roomId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch room');
        setRoom(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load room');
      } finally {
        setLoadingRoom(false);
      }
    }
    fetchRoom();
  }, [roomId]);


  function calculatePrices({
    room,
    bookingType,
    hours,
    checkInDate,
    checkOutDate,
    couponDiscountAmount,
  }) {
    let actual = 0;

    // ACTUAL PRICE
    if (bookingType === 'hourly' && hours) {
      actual =
        hours <= 3
          ? room.price / 4
          : room.price / 4 + (room.price / 12) * (hours - 3);
      actual = Math.round(actual);
    } else {
      const nights = Math.max(
        1,
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
      );
      actual = room.price * nights;
    }

    // ROOM DISCOUNT
    const roomSaving =
      room.discount > 0
        ? Math.round((actual * room.discount) / 100)
        : 0;

    // FINAL PRICE RULE
    const final =
      couponDiscountAmount > 0
        ? actual - couponDiscountAmount
        : actual - roomSaving;

    return {
      actualPrice: actual,
      roomDiscountSaving: roomSaving,
      finalPrice: Math.max(0, Math.round(final)),
    };
  }

  // ==========================
  // FINAL PRICE CALCULATION (single source of truth)
  // ==========================
  const { actualPrice, roomDiscountSaving, finalPrice } = useMemo(() => {
    if (!room) {
      return { actualPrice: 0, roomDiscountSaving: 0, finalPrice: 0 };
    }

    return calculatePrices({
      room,
      bookingType,
      hours,
      checkInDate,
      checkOutDate,
      couponDiscountAmount,
    });
  }, [
    room,
    bookingType,
    hours,
    checkInDate,
    checkOutDate,
    couponDiscountAmount,
  ]);



  const isCouponApplied = couponDiscountAmount > 0;
  if (loadingRoom || authLoading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!room) return <p className="text-center mt-10 text-red-600">Room not found.</p>;

  // ==========================
  // ✅ ACTUAL PRICE CALCULATION (HOURLY + FULL)
  // ==========================

  // const pricePerNight = Number(room.price);
  // let actualPrice = 0;

  // if (bookingType === 'hourly' && hours) {
  //   // Hourly pricing based on ACTUAL price
  //   if (hours <= 3) {
  //     actualPrice = pricePerNight / 4;
  //   } else {
  //     actualPrice = pricePerNight / 4 + (pricePerNight / 12) * (hours - 3);
  //   }
  //   actualPrice = Math.round(actualPrice);
  // } else {
  //   // Full-day pricing
  //   const nights = Math.max(
  //     1,
  //     (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
  //   );
  //   actualPrice = pricePerNight * nights;
  // }

  // const roomDiscountPercent = Number(room.discount || 0);
  // const roomDiscountAmount = Math.round(
  //   (actualPrice * roomDiscountPercent) / 100
  // );

  // const couponSaving = Number(couponDiscountAmount || 0);
  // const isCouponApplied = couponSaving > 0;

  // const finalPrice = isCouponApplied
  //   ? Math.max(actualPrice - couponSaving, 0)
  //   : Math.max(actualPrice - roomDiscountAmount, 0);


  async function handleBooking() {
    setBookingLoading(true);
    try {
      const token = localStorage.getItem('token');

      const {
        actualPrice: bookingActual,
        finalPrice: bookingFinal,
      } = calculatePrices({
        room,
        bookingType,
        hours,
        checkInDate,
        checkOutDate,
        couponDiscountAmount,
      });

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
        // send both original subtotal AND final total
        subtotal: bookingActual,     // server should use this to compute coupon discount validation
        totalPrice: bookingFinal,              // final amount to be charged/saved
        mobileNumber: user.mobileNumber,
        status: 'confirmed',
        couponCode: appliedCoupon?.code || undefined
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');

      // Store booking result and show modal (do NOT immediately navigate)
      setBookingResult(data);
      setShowBookingModal(true);

      // Still show success toast
      toast.success('Booking confirmed!', { duration: 4000 });

      // keep bookingLoading false so modal buttons enabled
    } catch (err) {
      toast.error(err.message || 'Booking failed', { duration: 5000 });
    } finally {
      setBookingLoading(false);
    }
  }

  // handler passed to CouponInput
  function onCouponApply(result) {
    if (result.success) {
      setAppliedCoupon({ ...result.coupon, code: result.code || result.coupon?.code });
      setCouponDiscountAmount(Number(result.discountAmount) || 0);
      setApplyDisabled(true); // disable further apply
      toast.success('Coupon applied');
    } else {
      // remove applied coupon on failure
      setAppliedCoupon(null);
      setCouponDiscountAmount(0);
      setApplyDisabled(false);
      if (result.message) toast.error(result.message);
    }
  }

  // Actions in modal
  function handleGoToBookings() {
    setShowBookingModal(false);
    router.push('/my-bookings');
  }

  function handleCloseModal() {
    setShowBookingModal(false);
    // optionally keep user on checkout page to do other actions
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Booking Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-[#7a3e1c] border-b pb-2">Booking Summary</h2>

          <div className="space-y-3 text-gray-700">
            <p><strong>Room:</strong> {room.title}</p>
            <p><strong>Mode:</strong> {bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'}</p>
            <p><strong>Check-In:</strong> {checkInDate} {checkInTime && `(${checkInTime})`}</p>
            {bookingType === 'hourly' ? (
              <p><strong>Duration:</strong> {hours} hours</p>
            ) : (
              <p><strong>Check-Out:</strong> {checkOutDate}</p>
            )}
            <p><strong>Guests:</strong> {adults} Adults, {children} Children</p>
          </div>

          {/* Price Card */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl p-4 mt-4 space-y-2">

            {/* Actual Price (always shown) */}
            <div className="flex justify-between text-sm text-gray-700">
              <span>Actual Price</span>
              <span>₹{actualPrice.toLocaleString('en-IN')}</span>
            </div>

            {/* Room Discount (ONLY when coupon NOT applied) */}
            {!isCouponApplied && roomDiscountSaving > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>
                  Room Discount ({room.discount}%)
                </span>
                <span>
                  - ₹{roomDiscountSaving.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Coupon Discount (ONLY when coupon applied) */}
            {isCouponApplied && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Coupon Discount</span>
                <span>
                  - ₹{couponDiscountAmount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <hr className="border-amber-300 my-2" />

            {/* Final Payable */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">
                Final Payable
              </span>
              <span className="text-3xl font-bold text-gray-900">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>


          {/* Coupon UI - pass disabled state so Apply button is disabled after apply */}
          <CouponInput subtotal={actualPrice} roomId={roomId} onApply={onCouponApply} disabled={applyDisabled} />
          <p className="text-xs text-gray-500 mt-2">
            Coupon discounts are applied on the actual price, not on discounted price.
          </p>

        </div>

        {/* Right Column - Payment & User Info */}
        <div className="space-y-8">
          {/* User Info */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-semibold text-[#7a3e1c] border-b pb-2 mb-4">Your Information</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Mobile:</strong> {user?.mobileNumber}</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h2 className="text-2xl font-semibold text-[#7a3e1c] border-b pb-2 mb-4">Select Payment Method</h2>

            <div className="space-y-3">
              {['card', 'upi', 'payAtHotel'].map((method) => (
                <label
                  key={method}
                  className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-all ${paymentMethod === method
                    ? 'border-gray-800 bg-gray-50'
                    : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="accent-gray-800"
                    />
                    <span className="font-medium text-gray-800">
                      {method === 'card'
                        ? 'Credit / Debit Card'
                        : method === 'upi'
                          ? 'UPI (Google Pay, PhonePe, Paytm)'
                          : 'Pay at Hotel'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className={`w-full mt-6 py-3 rounded-lg font-semibold text-white text-lg transition-all ${bookingLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-900 shadow-md hover:shadow-lg cursor-pointer'
                }`}
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Success Modal */}
      <BookingSuccessModal
        booking={bookingResult}
        room={room}
        userEmail={user?.email}
        open={showBookingModal}
        onClose={handleCloseModal}
        onGoToBookings={handleGoToBookings}
      />
    </div>
  );
}
