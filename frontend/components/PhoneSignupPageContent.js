'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PhoneSignupPageContent() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/send-mobile-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, mobileNumber: phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Something went wrong');
        return;
      }

      toast.success('Mobile number saved successfully');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save mobile number');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
      style={{ backgroundImage: "url('/bed.jpg')" }}
    >
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Add your mobile number
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Save your number to complete signup. No OTP is required.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex">
              <span className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 text-sm text-gray-600">
                +91
              </span>
              <input
                type="tel"
                placeholder="Mobile number"
                className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full font-medium py-2 rounded-md text-sm transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-800 text-white'
              }`}
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
