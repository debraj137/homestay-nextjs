"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Minus,
  Moon,
  Plus,
  Search,
  Users,
  Zap,
} from "lucide-react";
import { addDays, format } from "date-fns";
import dynamic from "next/dynamic";

const DateRange = dynamic(
  () => import("react-date-range").then((module) => module.DateRange),
  {
    ssr: false,
  },
);

const timeOptions = [
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
];

function GuestStepper({ label, value, onDecrease, onIncrease, minimum }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[#8b7567]">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-[#30231d]">
          {value}{" "}
          {label === "Guests"
            ? `adult${value !== 1 ? "s" : ""}`
            : `child${value !== 1 ? "ren" : ""}`}
        </p>
      </div>
      <div className="flex items-center rounded-full border border-[#dfcdbd] bg-[#fffdfa]">
        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= minimum}
          className="grid h-7 w-7 place-items-center rounded-full text-[#725f54] disabled:opacity-35"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-[#30231d]">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          className="grid h-7 w-7 place-items-center rounded-full text-[#725f54]"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function SearchBox() {
  const router = useRouter();
  const [mode, setMode] = useState("full");
  const [city, setCity] = useState("Ayodhya");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [checkInTime, setCheckInTime] = useState("04:00 PM");
  const [hours, setHours] = useState(3);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  function handleSubmit(event) {
    event.preventDefault();
    const startDate = format(dateRange[0].startDate, "yyyy-MM-dd");

    if (mode === "hourly") {
      router.push(
        `/search?city=${encodeURIComponent(city)}&bookingType=hourly&checkInDate=${startDate}&checkInTime=${encodeURIComponent(checkInTime)}&hours=${hours}&adults=${adults}&children=${children}`,
      );
      return;
    }

    router.push(
      `/search?city=${encodeURIComponent(city)}&bookingType=full&checkInDate=${startDate}&checkOutDate=${format(dateRange[0].endDate, "yyyy-MM-dd")}&adults=${adults}&children=${children}`,
    );
  }

  const calendar = (
    <>
      <DateRange
        ranges={dateRange}
        onChange={(item) => setDateRange([item.selection])}
        moveRangeOnFirstSelection={false}
        minDate={new Date()}
        rangeColors={["#a54528"]}
      />
      <div className="flex justify-end border-t border-[#eadfd3] px-4 py-3">
        <button
          type="button"
          onClick={() => setShowCalendar(false)}
          className="awadh-button px-5 py-2 text-sm"
        >
          Done
        </button>
      </div>
    </>
  );

  return (
    <div className="relative mt-10 w-full">
      <form
        onSubmit={handleSubmit}
        className="rounded-[1.7rem] bg-[#fffdf9] p-3 shadow-[0_24px_60px_rgba(15,9,6,.34)] sm:p-5"
      >
        <div className="mb-4 flex flex-wrap gap-2" aria-label="Stay duration">
          <button
            type="button"
            onClick={() => setMode("full")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${mode === "full" ? "bg-[#4b2116] text-white shadow-sm" : "bg-[#f4eadc] text-[#634d41] hover:bg-[#eadbc9]"}`}
          >
            <Moon className="h-4 w-4" /> Full-day stay
          </button>
          <button
            type="button"
            onClick={() => setMode("hourly")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${mode === "hourly" ? "bg-[#4b2116] text-white shadow-sm" : "bg-[#f4eadc] text-[#634d41] hover:bg-[#eadbc9]"}`}
          >
            <Zap className="h-4 w-4" /> Hourly stay
          </button>
        </div>

        <div className="grid gap-2 rounded-2xl border border-[#e4d6c7] bg-white p-2 lg:grid-cols-[1.1fr_1.3fr_1.5fr_auto] lg:items-stretch">
          <label className="group flex min-h-[74px] cursor-pointer items-center gap-3 rounded-xl px-3 transition hover:bg-[#fff7ee] lg:border-r lg:border-[#eee2d5]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f7ebdf] text-[#a54528]">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[#8b7567]">
                Destination
              </span>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="mt-1 w-full cursor-pointer appearance-none bg-transparent text-base font-bold text-[#30231d]"
              >
                <option>Ayodhya</option>
                <option>Lucknow</option>
                <option>Varanasi</option>
                <option>Mathura</option>
                <option>Vrindavan</option>
              </select>
            </span>
          </label>

          <div className="relative flex min-h-[74px] items-center gap-3 rounded-xl px-3 transition hover:bg-[#fff7ee] lg:border-r lg:border-[#eee2d5]">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f7ebdf] text-[#a54528]">
              <CalendarDays className="h-4 w-4" />
            </span>
            <button
              type="button"
              onClick={() => setShowCalendar((visible) => !visible)}
              className="min-w-0 text-left"
            >
              <span className="block text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[#8b7567]">
                When
              </span>
              <span className="mt-1 block truncate text-base font-bold text-[#30231d]">
                {mode === "hourly"
                  ? format(dateRange[0].startDate, "EEE, dd MMM")
                  : `${format(dateRange[0].startDate, "dd MMM")} – ${format(dateRange[0].endDate, "dd MMM")}`}
              </span>
            </button>
            {/* {showCalendar && (
              <div className="absolute left-0 top-full z-30 mt-3 hidden w-[620px] overflow-hidden rounded-2xl border border-[#e4d6c7] bg-white shadow-2xl lg:block">
                {calendar}
              </div>
            )} */}
          </div>

          {mode === "full" ? (
            <div className="grid min-h-[74px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl px-3 lg:border-r lg:border-[#eee2d5]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f7ebdf] text-[#a54528]">
                <Users className="h-4 w-4" />
              </span>
              <div className="grid min-w-0 grid-cols-2 gap-3">
                <GuestStepper
                  label="Guests"
                  value={adults}
                  minimum={1}
                  onDecrease={() =>
                    setAdults((value) => Math.max(1, value - 1))
                  }
                  onIncrease={() => setAdults((value) => value + 1)}
                />
                <div className="border-l border-[#eadfd3] pl-3">
                  <GuestStepper
                    label="Children"
                    value={children}
                    minimum={0}
                    onDecrease={() =>
                      setChildren((value) => Math.max(0, value - 1))
                    }
                    onIncrease={() => setChildren((value) => value + 1)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[74px] grid-cols-2 items-center gap-3 rounded-xl px-3 lg:border-r lg:border-[#eee2d5]">
              <label>
                <span className="block text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[#8b7567]">
                  Check-in
                </span>
                <select
                  value={checkInTime}
                  onChange={(event) => setCheckInTime(event.target.value)}
                  className="mt-1 w-full appearance-none bg-transparent text-sm font-bold text-[#30231d]"
                >
                  {timeOptions.map((time) => (
                    <option key={time}>{time}</option>
                  ))}
                </select>
              </label>
              <label className="border-l border-[#eadfd3] pl-3">
                <span className="flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-[#8b7567]">
                  <Clock3 className="h-3 w-3" /> Duration
                </span>
                <select
                  value={hours}
                  onChange={(event) => setHours(Number(event.target.value))}
                  className="mt-1 w-full appearance-none bg-transparent text-sm font-bold text-[#30231d]"
                >
                  {Array.from({ length: 8 }, (_, index) => index + 3).map(
                    (duration) => (
                      <option key={duration} value={duration}>
                        {duration} hours
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>
          )}

          <div className="flex items-center p-1">
            <button
              type="submit"
              className="awadh-button min-h-[58px] w-full px-6 text-sm lg:w-auto"
            >
              <Search className="h-4 w-4" /> Search stays
            </button>
          </div>
        </div>
      </form>

      {/* {showCalendar && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 lg:hidden">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadfd3] px-4 py-3">
              <p className="font-display text-xl font-semibold text-[#30231d]">Choose your dates</p>
              <button type="button" onClick={() => setShowCalendar(false)} className="text-sm font-bold text-[#a54528]">Close</button>
            </div>
            {calendar}
          </div>
        </div>
      )} */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 sm:p-6">
          <div className="max-h-[90dvh] w-full max-w-[680px] overflow-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadfd3] px-4 py-3">
              <p className="font-display text-xl font-semibold text-[#30231d]">
                Choose your dates
              </p>

              <button
                type="button"
                onClick={() => setShowCalendar(false)}
                className="text-sm font-bold text-[#a54528]"
              >
                Close
              </button>
            </div>

            {calendar}
          </div>
        </div>
      )}
    </div>
  );
}
