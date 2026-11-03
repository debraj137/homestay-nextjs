'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DateRange } from 'react-date-range';
import { format, addDays } from 'date-fns';
import { Plus, Minus } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function BookingModal({ room, onClose }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ Read preselected values from URL
  const bookingType = searchParams.get('bookingType') || 'full';
  const initialStart = searchParams.get('checkInDate')
    ? new Date(searchParams.get('checkInDate'))
    : new Date();
  const initialEnd = addDays(initialStart, 1);
  const preselectedTime = searchParams.get('checkInTime') || '11:00 AM';
  const preselectedHours = Number(searchParams.get('hours')) || 2;

  // ✅ State variables
  const [dateRange, setDateRange] = useState([
    { startDate: initialStart, endDate: initialEnd, key: 'selection' },
  ]);
  const [checkInTime, setCheckInTime] = useState(preselectedTime);
  const [hours, setHours] = useState(preselectedHours);
  const [adults, setAdults] = useState(Number(searchParams.get('adults')) || 1);
  const [children, setChildren] = useState(Number(searchParams.get('children')) || 0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState('');

  const calendarRef = useRef(null);

  // ✅ Close calendar when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  // ✅ Validate guest limits
  useEffect(() => {
    if (adults > room.maximumAllowedAdult || children > room.maximumAllowedChild) {
      setError(
        `Exceeds capacity (${room.maximumAllowedAdult} adults & ${room.maximumAllowedChild} children)`
      );
    } else setError('');
  }, [adults, children, room]);

  // ✅ Handle checkout navigation
  const handleCheckout = () => {
    if (error) return;

    const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd');
    const endDate =
      bookingType === 'hourly'
        ? startDate
        : format(dateRange[0].endDate, 'yyyy-MM-dd');

    const qs = new URLSearchParams({
      roomId: room._id,
      bookingType,
      checkInDate: startDate,
      checkOutDate: endDate,
      adults,
      children,
    });

    if (bookingType === 'hourly') {
      qs.set('checkInTime', checkInTime);
      qs.set('hours', hours);
    }

    router.push(`/checkout?${qs.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#241b17]/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[1.5rem] border border-[#eadfd3] bg-[#fffdfa] p-6 shadow-2xl">
        {/* ❌ Close Button */}
        <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-[#f4eadc] text-[#735f52] hover:text-[#a54528]" aria-label="Close booking details">
          ✕
        </button>

        <p className="eyebrow pr-8">Choose your stay</p>
        <h2 className="font-display mb-6 mt-2 pr-8 text-2xl font-semibold text-[#30231d]">
          Book {room.title} ({bookingType === 'hourly' ? 'Hourly Stay' : 'Full-Day Stay'})
        </h2>

        {/* Mode-specific UI */}
        {bookingType === 'hourly' ? (
          <>
            {/* Date */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-[#4a3a30]">Select date</label>
              <input
                type="date"
                value={format(dateRange[0].startDate, 'yyyy-MM-dd')}
                onChange={(e) =>
                  setDateRange([{ ...dateRange[0], startDate: new Date(e.target.value) }])
                }
                className="w-full rounded-xl border border-[#ddcbbb] bg-white px-3 py-2.5 text-sm text-[#30231d]"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {/* Time */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-[#4a3a30]">Check-in time</label>
              <select
                className="w-full rounded-xl border border-[#ddcbbb] bg-white px-3 py-2.5 text-sm text-[#30231d]"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
              >
                {[
                  '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
                  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
                  '08:00 PM', '09:00 PM', '10:00 PM',
                ].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Duration (Editable now ✅) */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-bold text-[#4a3a30]">Duration (hours)</label>
              <select
                className="w-full rounded-xl border border-[#ddcbbb] bg-white px-3 py-2.5 text-sm text-[#30231d]"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                {[...Array(8)].map((_, i) => {
                  const val = i + 3;
                  return (
                    <option key={val} value={val}>
                      {val} Hours
                    </option>
                  );
                })}
              </select>
            </div>
          </>
        ) : (
          // Full-day mode
          <div className="mb-4 relative" ref={calendarRef}>
            <label className="mb-1 block text-sm font-bold text-[#4a3a30]">Dates</label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full rounded-xl border border-[#ddcbbb] bg-[#fff8f1] px-3 py-2.5 text-left text-sm font-semibold text-[#30231d]"
            >
              {`${format(dateRange[0].startDate, 'dd/MM/yyyy')} → ${format(
                dateRange[0].endDate,
                'dd/MM/yyyy'
              )}`}
            </button>
            {showCalendar && (
              <div className="mt-4 w-full">
                <div className="mx-auto flex w-full flex-col overflow-hidden rounded-2xl border border-[#eadfd3] bg-white shadow-lg sm:w-[340px]">
                  <div className="px-2">
                    <DateRange
                      ranges={dateRange}
                      onChange={(item) => setDateRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      minDate={new Date()}
                      className="text-black w-full"
                      // months={1}
                      // direction="vertical"
                      // showMonthAndYearPickers={true}
                    />
                  </div>

                  <div className="sticky bottom-0 border-t border-[#eadfd3] bg-white p-2 text-right">
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="awadh-button px-4 py-2 text-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guests Section */}
        <div className="flex gap-2 mb-4">
          {/* Adults */}
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Adults</label>
            <div className="flex h-[44px] items-center justify-between rounded-xl border border-[#ddcbbb] bg-white px-2">
              <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{adults}</span>
              <button type="button" onClick={() => setAdults(adults + 1)}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex flex-col w-1/2">
            <label className="mb-1 text-xs font-bold uppercase tracking-[.12em] text-[#8b7567]">Children</label>
            <div className="flex h-[44px] items-center justify-between rounded-xl border border-[#ddcbbb] bg-white px-2">
              <button type="button" onClick={() => setChildren(Math.max(0, children - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">{children}</span>
              <button type="button" onClick={() => setChildren(children + 1)}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="mb-4 text-sm text-[#a54528]">{error}</p>}

        {/* Proceed Button */}
        <button
          onClick={handleCheckout}
          disabled={!!error}
          className="awadh-button w-full px-5 py-3 text-base"
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
}
