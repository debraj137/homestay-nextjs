import { NextResponse } from 'next/server';

export async function GET() {
  // List your static pages
  const staticPages = [
    '',
    'login',
    'signup',
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

  // Fetch dynamic room data from your backend
  const res = await fetch('http://31.97.202.204:4000/api/rooms'); // Use your actual API base
  const rooms = await res.json();

  // Map room URLs (adjust path as per your routing)
  const roomUrls = rooms.map(room => 
    `<url><loc>http://awadhhotels.com/rooms/${encodeURIComponent(room.title)}/${room._id}</loc></url>`
  );

  const urls = [
    ...staticPages.map((page) => `<url><loc>http://awadhhotels.com/${page}</loc></url>`),
    ...roomUrls,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('\n')}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}