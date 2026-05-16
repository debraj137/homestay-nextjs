import SearchPageContent from "@/components/SearchPageContent";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

async function getInitialRooms(searchParams) {
  const city = searchParams?.city;

  if (!city) {
    return { rooms: [], error: null };
  }

  const query = new URLSearchParams({ city });
  ["checkInDate", "checkOutDate", "adults", "children", "bookingType", "hours"].forEach((key) => {
    const value = searchParams?.[key];
    if (value) {
      query.set(key, value);
    }
  });

  try {
    const res = await fetch(`${API_BASE}/rooms/search?${query.toString()}`, {
      cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
      return { rooms: [], error: data.message || "Failed to fetch rooms" };
    }

    return { rooms: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    return { rooms: [], error: error.message || "Failed to fetch rooms" };
  }
}

export default async function SearchPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { rooms, error } = await getInitialRooms(resolvedSearchParams);

  return (
    <SearchPageContent
      initialRooms={rooms}
      initialError={error}
      initialSearch={{
        city: resolvedSearchParams?.city || null,
        checkInDate: resolvedSearchParams?.checkInDate || null,
        checkOutDate: resolvedSearchParams?.checkOutDate || null,
        adults: resolvedSearchParams?.adults || null,
        children: resolvedSearchParams?.children || null,
      }}
    />
  );
}
