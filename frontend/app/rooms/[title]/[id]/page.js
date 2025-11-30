// import RoomDetailsPage from "@/components/RoomDetailsPage";

// // Fetch room data server-side for SEO
// async function getRoom(id) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`, {
//     cache: "no-store", // Always fetch fresh data for SEO
//   });
//   if (!res.ok) return null;
//   return res.json();
// }

// // ✅ SEO metadata
// export async function generateMetadata({ params }) {
//   const { id, title } = await params; // ✅ MUST await params

//   const room = await getRoom(id);

//   if (!room) {
//     return {
//       title: "Room not found",
//       description: "The room you are looking for does not exist.",
//     };
//   }

//   return {
//     title: `${room.title}`,
//     description:
//       room.description?.slice(0, 160) ||
//       "Book this beautiful stay with amazing amenities at Awadh Hotels.",
//     openGraph: {
//       title: room.title,
//       description: room.description?.slice(0, 200),
//       url: `https://awadhhotels.com/rooms/${title}/${id}`,
//       images: [
//         {
//           url: room.images?.[0] || "/default-room.jpg", // ✅ only first image
//           width: 800,
//           height: 600,
//           alt: room.title,
//         },
//       ],
//     },
//     alternates: {
//       canonical: `https://awadhhotels.com/rooms/${title}/${id}`,
//     },
//   };
// }

// // ✅ Server component wrapper
// export default async function Page({ params }) {
//   const { id } = await params; // ✅ MUST await here too

//   // ✅ Fetch room for JSON-LD schema
//   const room = await getRoom(id);

//   return (
//     <>
//       {/* ✅ JSON-LD structured data for SEO */}
//       {room && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "HotelRoom",
//               name: room.title,
//               description: room.description,
//               image: room.images?.[0] ? [room.images[0]] : [], // ✅ only first image
//               address: {
//                 "@type": "PostalAddress",
//                 streetAddress: `${room.location?.addressLine1 || ""}, ${
//                   room.location?.addressLine2 || ""
//                 }`,
//                 addressLocality: room.location?.city || "",
//                 addressRegion: room.location?.state || "",
//                 postalCode: room.location?.pincode || "",
//                 addressCountry: "India",
//               },
//               offers: {
//                 "@type": "Offer",
//                 price: room.price,
//                 priceCurrency: "INR",
//                 availability: room.isAvailable
//                   ? "https://schema.org/InStock"
//                   : "https://schema.org/OutOfStock",
//               },
//             }),
//           }}
//         />
//       )}

//       {/* ✅ Client Component */}
//       <RoomDetailsPage id={id} />
//     </>
//   );
// }
import RoomDetailsPage from "@/components/RoomDetailsPage";
import slugify from "slugify"; // optional if you use slug later

// Fetch room data server-side for SEO
async function getRoom(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms/${id}`, {
    cache: "no-store", // Always fetch fresh data for SEO
  });
  if (!res.ok) return null;
  return res.json();
}

// helper: build city-specific keywords string
function cityKeywords(city) {
  const baseKeywords = [
    "hotels", "hourly hotel booking", "full-day hotel stays", "verified rooms",
    "online hotel booking", "budget hotels", "luxury hotels", "family-friendly hotels",
    "budget-friendly hotels", "business travel", "last-minute hotel deals"
  ];

  const normalizedCity = (city || "Ayodhya").trim();
  // Build array like "Ayodhya hotels", "hourly hotel booking Ayodhya", ...
  const keywords = baseKeywords.map((kw) => {
    // if keyword already contains city-like phrase skip adding twice
    if (kw.toLowerCase().includes(normalizedCity.toLowerCase())) return kw;
    // place city where it reads naturally: for "hotels" -> "Ayodhya hotels", else append city
    if (kw.toLowerCase() === "hotels") return `${normalizedCity} hotels`;
    return `${kw} ${normalizedCity}`;
  });

  // Ensure some canonical ones as well
  keywords.unshift(`${normalizedCity} hotels`, `${normalizedCity} hotel booking`);
  return keywords.join(", ");
}

// ✅ SEO metadata
export async function generateMetadata({ params }) {
  const { id, title } = await params;

  const room = await getRoom(id);

  if (!room) {
    return {
      title: "Room not found",
      description: "The room you are looking for does not exist.",
      keywords: "hotels",
    };
  }

  const city = room.location?.city || "Ayodhya";
  const keywords = cityKeywords(city);

  const description =
    room.description?.slice(0, 160) ||
    `Book this beautiful stay in ${city} with amazing amenities at Awadh Hotels.`;

  return {
    title: `${room.title} — ${city}`,
    description,
    keywords,
    openGraph: {
      title: room.title,
      description: room.description?.slice(0, 200) || description,
      url: `https://awadhhotels.com/rooms/${title}/${id}`,
      images: [
        {
          url: room.images?.[0] || "/default-room.jpg",
          width: 800,
          height: 600,
          alt: room.title,
        },
      ],
    },
    alternates: {
      canonical: `https://awadhhotels.com/rooms/${title}/${id}`,
    },
  };
}

// ✅ Server component wrapper
export default async function Page({ params }) {
  const { id } = await params;

  // Fetch room for JSON-LD & client component
  const room = await getRoom(id);

  return (
    <>
      {room && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HotelRoom",
              name: room.title,
              description: room.description,
              image: room.images?.[0] ? [room.images[0]] : [],
              address: {
                "@type": "PostalAddress",
                streetAddress: `${room.location?.addressLine1 || ""}, ${room.location?.addressLine2 || ""}`,
                addressLocality: room.location?.city || "",
                addressRegion: room.location?.state || "",
                postalCode: room.location?.pincode || "",
                addressCountry: "India",
              },
              offers: {
                "@type": "Offer",
                price: room.price,
                priceCurrency: "INR",
                availability: room.isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              },
            }),
          }}
        />
      )}

      <RoomDetailsPage id={id} />
    </>
  );
}
