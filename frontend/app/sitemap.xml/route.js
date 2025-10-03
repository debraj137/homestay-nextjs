import { NextResponse } from 'next/server';

export async function GET() {
  // Static pages
  const staticPages = [
    '',
    'login',
    'signup/email',
    'owner-signup',
    'search',
    'my-bookings',
    'listed-property',
    'property-list',
    'faqs',
    'help-center',
    'terms-and-conditions',
    'cancellation-policy',
    'homestays',
  ];

  // Current date for static pages
  const today = new Date().toISOString();

  let roomUrls = [];

  try {
    // ✅ Fetch rooms from backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/rooms`, {
      next: { revalidate: 60 }, // ISR → refresh every 60s
    });

    if (res.ok) {
      const rooms = await res.json();

      roomUrls = rooms.map((room) => {
        const lastmod = room.updatedAt || room.createdAt || today;
        return `<url>
          <loc>https://awadhhotels.com/rooms/${encodeURIComponent(
            room.title
          )}/${room._id}</loc>
          <lastmod>${new Date(lastmod).toISOString()}</lastmod>
        </url>`;
      });
    } else {
      console.error('Failed to fetch rooms for sitemap:', res.statusText);
    }
  } catch (error) {
    console.error('Error fetching rooms for sitemap:', error);
  }

  // ✅ Include static pages with today's lastmod
  const staticUrls = staticPages.map(
    (page) => `<url>
      <loc>https://awadhhotels.com/${page}</loc>
      <lastmod>${today}</lastmod>
    </url>`
  );

  const urls = [...staticUrls, ...roomUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('\n')}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
