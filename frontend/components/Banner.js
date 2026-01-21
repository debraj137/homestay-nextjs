// "use client";

// import SearchBox from "@/components/SearchBox";

// export default function Banner() {
//   return (
//     <section
//       className="relative min-h-[100vh] md:h-[100vh] flex items-center justify-center text-center text-white pt-16"
//       style={{
//         backgroundImage: "url('/hero.webp')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="absolute inset-0 bg-black/50"></div>

//       <div className="relative z-10 max-w-4xl px-4">
//         <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
//           🕉️ Divine Destinations, Homely Stays
//         </h1>
//         <p className="text-lg md:text-xl mb-6">
//           Enjoy the serenity of Ayodhya, the majesty of Agra, and the divinity
//           of Varanasi — all with homely comfort
//         </p>

//         {/* ✅ Hotels.com style Search Box */}
//         <SearchBox />
//       </div>
//     </section>
//   );
// }


"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const SearchBox = dynamic(() => import("@/components/SearchBox"), {
  ssr: false,
  loading: () => (
    <div className="h-[120px] w-full rounded-2xl bg-white/80 animate-pulse" />
  ),
});

export default function Banner() {
  return (
    <section className="relative min-h-[100vh] md:h-[100vh] md:h-[100vh] flex items-center justify-center text-center pt-16">
      {/* ✅ LCP IMAGE */}
      <Image
        src="/hero.webp"
        alt="Awadh Hotels – Divine Destinations"
        fill
        priority
        sizes="100vw"
        // placeholder="blur"
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-4 text-white">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
          🕉️ Divine Destinations, Homely Stays
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Enjoy the serenity of Ayodhya, the majesty of Agra, and the divinity
          of Varanasi — all with homely comfort
        </p>

        {/* 🔥 Lazy-loaded */}
        <SearchBox />
      </div>
    </section>
  );
}
