'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { API_BASE, fetcher } from '../../../lib/api';
import BookingForm from '../../../components/BookingForm';


export default function RoomDetail({ params }) {
const { id } = params;
const { data: room, error } = useSWR(`${API_BASE}/rooms/${id}`, fetcher);


const [message, setMessage] = useState(null);


if (error) return <div>Failed to load</div>;
if (!room) return <div>Loading...</div>;


return (
<div>
<h2>{room.title}</h2>
<p>{room.description}</p>
<p>Price: ₹{room.pricePerNight}</p>


<BookingForm room={room} onSuccess={b => setMessage('Booking successful!')} />


{message && <div>{message}</div>}
</div>
);
}