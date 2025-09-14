export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';


export async function fetcher(url) {
const res = await fetch(url);
if (!res.ok) throw new Error('An error occurred while fetching the data.');
return res.json();
}