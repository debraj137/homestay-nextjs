'use client';
import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';

export default function CouponInput({ subtotal = 0, roomId, onApply, disabled = false }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [applied, setApplied] = useState(false);

  // If parent says disabled (applied from outside), reflect it
  useEffect(() => {
    if (disabled) setApplied(true);
  }, [disabled]);

  async function applyCoupon() {
    setMessage(null);

    if (applied) {
      setMessage({ type: 'info', text: 'Coupon already applied' });
      return;
    }

    if (!code || code.trim() === '') {
      setMessage({ type: 'error', text: 'Please enter coupon code' });
      onApply?.({ success: false, message: 'Please enter coupon code' });
      return;
    }

    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          bookingSubtotal: Number(subtotal || 0),
          roomIds: roomId ? [roomId] : []
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to apply coupon' });
        onApply?.({ success: false, message: data.message || 'Failed' });
      } else {
        setApplied(true);
        setMessage({ type: 'success', text: `Applied — you save ₹${Number(data.discountAmount).toFixed(2)}` });
        onApply?.({
          success: true,
          discountAmount: data.discountAmount,
          newTotal: data.newTotal,
          coupon: data.coupon,
          code: code.toUpperCase()
        });
      }
    } catch (err) {
      console.error('Coupon apply error', err);
      setMessage({ type: 'error', text: 'Network error validating coupon' });
      onApply?.({ success: false, message: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon?</label>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 border px-3 py-2 rounded"
          disabled={applied}
        />
        <button
          onClick={applyCoupon}
          disabled={loading || applied}
          className={`px-4 py-2 rounded font-medium ${loading || applied ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 text-white'}`}
        >
          {loading ? 'Applying...' : applied ? 'Applied' : 'Apply'}
        </button>
      </div>
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'error' ? 'text-red-600' : message.type === 'success' ? 'text-green-700' : 'text-gray-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
