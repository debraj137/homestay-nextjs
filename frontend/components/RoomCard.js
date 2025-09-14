import Link from 'next/link';


export default function RoomCard({ room }) {
return (
<div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
<h3>{room.title}</h3>
<p>{room.location}</p>
<p>₹{room.pricePerNight} / night</p>
<p>
<Link href={`/rooms/${room._id}`}>View</Link>
</p>
</div>
);
}