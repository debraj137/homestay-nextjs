'use client';  // ⬅️ important

import useSWR from 'swr';
import { fetcher, API_BASE } from '../../lib/api';
import RoomCard from '../../components/RoomCard';

export default function RoomsPage() {
  const { data, error } = useSWR(`${API_BASE}/rooms`, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map(room => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}
