'use client';
import { useState } from 'react';
import { API_BASE } from '../lib/api';

export default function BookingForm({ room, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const days =
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24) || 1;
      const totalPrice = days * room.pricePerNight;

      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room._id,
          name,
          email,
          checkIn,
          checkOut,
          totalPrice,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');
      const data = await res.json();

      // __define-ocg__ - user preference tag included in a comment
      if (onSuccess) onSuccess(data);
    } catch (err) {
      alert(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={e => setCheckIn(e.target.value)}
          required
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={e => setCheckOut(e.target.value)}
          required
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
}
