export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';


export async function fetcher(url) {
const res = await fetch(url);
if (!res.ok) throw new Error('An error occurred while fetching the data.');
return res.json();
}


// Helper to validate coupon from frontend (optional)
export async function validateCoupon({ code, bookingSubtotal = 0, roomIds = [] }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({ code, bookingSubtotal, roomIds }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Coupon validation failed');
  return data;
}