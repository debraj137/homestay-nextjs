"use client";

import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Filters from "@/components/Filters";
import BookingModal from "@/components/BookingModal";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

function buildRoomUrl(room, queryString) {
  return `/rooms/${slugify(`${room.title}-in-${room.location?.city || ""}`, { lower: true })}/${room._id}${queryString}`;
}

function RoomCard({
  room,
  checkInDate,
  checkOutDate,
  searchParams,
  onBookNow,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const bookingType = searchParams.get("bookingType") || "full";
  const hours = Number(searchParams.get("hours")) || 0;
  const images = room.images || [];
  const price = Number(room.price) || 0;
  const listedDiscountedPrice = Number(room.discountedPrice) || 0;
  const discount = Number(room.discount) || 0;
  const discountedPrice =
    listedDiscountedPrice > 0 && listedDiscountedPrice < price
      ? listedDiscountedPrice
      : discount > 0
        ? Math.round(price - (price * discount) / 100)
        : price;
  const hasDiscount = discountedPrice < price;
  // const savedAmount = hasDiscount ? price - discountedPrice : 0;
  const savedPercentage =
    hasDiscount && price > 0
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;
  const rating = Number(room.averageRating) || 0;

  const queryString = useMemo(() => {
    const parameters = new URLSearchParams();
    if (checkInDate) parameters.set("checkInDate", checkInDate);
    if (checkOutDate) parameters.set("checkOutDate", checkOutDate);
    if (adults) parameters.set("adults", adults);
    if (children !== null) parameters.set("children", children);
    if (bookingType) parameters.set("bookingType", bookingType);
    if (hours) parameters.set("hours", String(hours));
    return parameters.size ? `?${parameters.toString()}` : "";
  }, [adults, bookingType, checkInDate, checkOutDate, children, hours]);

  const roomUrl = buildRoomUrl(room, queryString);
  const hourlyPrice =
    hours <= 3
      ? discountedPrice / 4
      : discountedPrice / 4 + (discountedPrice / 12) * (hours - 3);

  // function handleBookNow() {
  //   const hasGuestInfo = Boolean(adults) && children !== null;
  //   const hasSelection =
  //     bookingType === "hourly"
  //       ? Boolean(checkInDate) && hours > 0 && hasGuestInfo
  //       : Boolean(checkInDate && checkOutDate) && hasGuestInfo;
  //   if (!hasSelection) {
  //     onBookNow(room);
  //     return;
  //   }
  //   window.location.href = `/checkout?roomId=${room._id}&${queryString.slice(1)}`;
  // }

  function handleBookNow() {
  // Always open BookingModal for Hourly Stay
  if (bookingType === 'hourly') {
    onBookNow(room);
    return;
  }

  // Keep existing Full Stay behaviour unchanged
  const hasGuestInfo = Boolean(adults) && children !== null;
  const hasSelection =
    Boolean(checkInDate && checkOutDate) && hasGuestInfo;

  if (!hasSelection) {
    onBookNow(room);
    return;
  }

  window.location.href = `/checkout?roomId=${room._id}&${queryString.slice(1)}`;
}

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-[#e8dbcd] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(63,36,21,.13)] md:grid md:grid-cols-[300px_minmax(0,1fr)]">
      <div className="relative h-60 overflow-hidden bg-[#ead9c4] md:h-full md:min-h-[320px]">
        {images.length > 0 ? (
          <Image
            src={images[currentImage]}
            alt={room.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm font-semibold text-[#704b38]">
            Photos coming soon
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        {/* {hasDiscount && (
          <span className="absolute left-4 top-4 rounded-full bg-[#a54528] px-3 py-1.5 text-xs font-bold text-white">
            Save ₹{savedAmount.toLocaleString("en-IN")}
          </span>
        )} */}

        {hasDiscount && (
          <span className="absolute left-4 top-4 rounded-full bg-[#a54528] px-3 py-1.5 text-xs font-bold text-white">
            Save {savedPercentage}%
          </span>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrentImage((image) =>
                  image === 0 ? images.length - 1 : image - 1,
                )
              }
              className="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#4b2116] transition hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentImage((image) =>
                  image === images.length - 1 ? 0 : image + 1,
                )
              }
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#4b2116] transition hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-4 left-4 text-xs font-bold text-white">
              {currentImage + 1} / {images.length} photos
            </span>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="font-display text-xl sm:text-2xl lg:text-3xl
  font-semibold leading-tight break-words text-[#30231d]"
              >
                <Link
                  href={roomUrl}
                  className="transition hover:text-[#a54528]"
                >
                  {room.title}
                </Link>
              </h2>
              {rating > 0 ? (
                <span className="flex items-center gap-1 rounded-full bg-[#fff2dd] px-2.5 py-1 text-xs font-bold text-[#7c531f]">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {rating.toFixed(1)}
                  <span className="font-medium text-[#8a786c]">
                    ({room.totalReviews || 0})
                  </span>
                </span>
              ) : (
                <span className="rounded-full bg-[#f4eadc] px-2.5 py-1 text-xs font-bold text-[#746156]">
                  New
                </span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#796b62]">
              <MapPin className="h-4 w-4 text-[#a54528]" />
              {[room.location?.city, room.location?.state]
                .filter(Boolean)
                .join(", ") || "India"}
            </p>
          </div>
          <div className="shrink-0 sm:text-right">
            {hasDiscount && (
              <p className="text-sm text-[#99887c] line-through">
                ₹{price.toLocaleString("en-IN")}
              </p>
            )}
            <p className="text-2xl font-extrabold text-[#4b2116]">
              ₹
              {Math.round(
                bookingType === "hourly" && hours
                  ? hourlyPrice
                  : discountedPrice,
              ).toLocaleString("en-IN")}
            </p>
            <p className="text-xs font-semibold text-[#87766c]">
              {bookingType === "hourly" && hours
                ? `${hours} hours`
                : "per night"}
            </p>
          </div>
        </div>

        {room.amenities?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-[#f8f1e9] px-3 py-1.5 text-xs font-semibold text-[#65554b]"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="px-1 py-1.5 text-xs font-bold text-[#88776c]">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-[#eadfd3] pt-5 sm:flex-row">
          <button
            type="button"
            onClick={handleBookNow}
            className="awadh-button flex-1 px-5 py-3 text-sm"
          >
            Reserve this stay
          </button>
          <Link
            href={roomUrl}
            className="awadh-button-secondary flex-1 px-5 py-3 text-center text-sm"
          >
            View details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SearchPageContent({
  initialRooms = [],
  initialError = null,
  initialSearch = {},
}) {
  const searchParams = useSearchParams();
  const city = searchParams.get("city");
  const checkInDate = searchParams.get("checkInDate");
  const checkOutDate = searchParams.get("checkOutDate");
  const adults = searchParams.get("adults");
  const children = searchParams.get("children");
  const bookingType = searchParams.get("bookingType") || "full";
  const [rooms, setRooms] = useState(initialRooms);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [nearbyQuery, setNearbyQuery] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      if (!city) {
        setRooms([]);
        return;
      }

      const matchesInitialSearch =
        city === initialSearch.city &&
        checkInDate === initialSearch.checkInDate &&
        checkOutDate === initialSearch.checkOutDate &&
        adults === initialSearch.adults &&
        children === initialSearch.children;
      if (matchesInitialSearch) {
        setRooms(initialRooms);
        if (initialError) toast.error(initialError);
        return;
      }

      try {
        setLoading(true);
        const query = new URLSearchParams({ city });
        if (checkInDate) query.set("checkInDate", checkInDate);
        if (checkOutDate) query.set("checkOutDate", checkOutDate);
        if (adults) query.set("adults", adults);
        if (children !== null) query.set("children", children);
        const response = await fetch(
          `${API_BASE}/rooms/search?${query.toString()}`,
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch rooms");
        setRooms(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, [
    adults,
    checkInDate,
    checkOutDate,
    children,
    city,
    initialError,
    initialRooms,
    initialSearch,
  ]);

  async function handleFilterApply(filters) {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/rooms/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maxPrice: filters.maxPrice ?? null,
          amenities: filters.amenities ?? [],
          minRating: filters.minRating ?? null,
          city,
          checkInDate,
          checkOutDate,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to apply filters");
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to apply filters");
    } finally {
      setLoading(false);
    }
  }

  const filteredRooms = useMemo(
    () =>
      rooms.filter((room) => {
        const matchesProperty =
          !propertyQuery.trim() ||
          room.title?.toLowerCase().includes(propertyQuery.toLowerCase());
        const nearbyText =
          `${room.location?.locality || ""} ${(room.location?.nearestLocalities || []).join(" ")}`.toLowerCase();
        const matchesNearby =
          !nearbyQuery.trim() || nearbyText.includes(nearbyQuery.toLowerCase());
        return matchesProperty && matchesNearby;
      }),
    [nearbyQuery, propertyQuery, rooms],
  );

  const dateLabel =
    checkInDate && checkOutDate
      ? `${checkInDate} — ${checkOutDate}`
      : "Choose your dates";
  const guestLabel = adults
    ? `${adults} adult${Number(adults) !== 1 ? "s" : ""}${children && Number(children) > 0 ? ` · ${children} child${Number(children) !== 1 ? "ren" : ""}` : ""}`
    : "Choose guests";

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#fffaf4] pb-20 pt-8 sm:pt-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[1.7rem] bg-[#302018] px-6 py-8 text-[#fff8ef] sm:px-8 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#edbd78]">
            Search results
          </p>
          <div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">
                Stays in {city || "your destination"}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#e6d6c8]">
                A considered collection of homestays for your visit. Compare the
                details, then reserve the one that feels right.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold text-[#fff8ef] transition hover:bg-white/10"
            >
              <Search className="h-4 w-4" /> Edit search
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-2 text-sm font-semibold">
            <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
              <CalendarDays className="h-4 w-4 text-[#edbd78]" />
              {dateLabel}
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
              <Users className="h-4 w-4 text-[#edbd78]" />
              {guestLabel}
            </span>
            <span className="rounded-full bg-[#d89a50] px-3 py-2 text-[#3c2115]">
              {bookingType === "hourly" ? "Hourly stay" : "Full-day stay"}
            </span>
          </div>
        </section>

        <div className="mt-8 grid gap-7 lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="surface-card rounded-[1.35rem] p-5">
              <label
                htmlFor="property-search"
                className="text-sm font-bold text-[#4a3a30]"
              >
                Find a property
              </label>
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a54528]" />
                <input
                  id="property-search"
                  type="search"
                  placeholder="Property name"
                  value={propertyQuery}
                  onChange={(event) => setPropertyQuery(event.target.value)}
                  className="w-full rounded-xl border border-[#ddcbbb] bg-[#fffdfa] py-2.5 pl-9 pr-3 text-sm text-[#30231d] placeholder:text-[#a38f81]"
                />
              </div>
              <label
                htmlFor="nearby-search"
                className="mt-5 block text-sm font-bold text-[#4a3a30]"
              >
                Near a landmark
              </label>
              <div className="relative mt-3">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a54528]" />
                <input
                  id="nearby-search"
                  type="search"
                  placeholder="Ram Mandir, station…"
                  value={nearbyQuery}
                  onChange={(event) => setNearbyQuery(event.target.value)}
                  className="w-full rounded-xl border border-[#ddcbbb] bg-[#fffdfa] py-2.5 pl-9 pr-3 text-sm text-[#30231d] placeholder:text-[#a38f81]"
                />
              </div>
            </div>
            <Filters onApply={handleFilterApply} />
          </aside>

          <main>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#706158]">
                <strong className="text-[#30231d]">
                  {loading
                    ? "Finding stays"
                    : `${filteredRooms.length} stay${filteredRooms.length !== 1 ? "s" : ""}`}
                </strong>{" "}
                {city ? `in ${city}` : "available"}
              </p>
              <p className="text-xs font-bold uppercase tracking-[.12em] text-[#947e70]">
                Best match first
              </p>
            </div>
            {loading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[320px] animate-pulse rounded-[1.5rem] bg-[#f1e6d9]"
                  />
                ))}
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="surface-card rounded-[1.5rem] px-6 py-14 text-center">
                <p className="font-display text-3xl font-semibold text-[#30231d]">
                  No stays match this search.
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#796b62]">
                  Try a different landmark, remove a filter or change your dates
                  to see more options.
                </p>
                <Link href="/" className="awadh-button mt-6 px-5 py-3 text-sm">
                  Start a new search
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    searchParams={searchParams}
                    onBookNow={setSelectedRoom}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </div>
  );
}
