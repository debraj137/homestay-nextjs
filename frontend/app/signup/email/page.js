'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EmailSignupPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // ✅ new state
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // ✅ disable button when API starts
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("OTP sent to your email 📧");
      router.push(`/signup/otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false); // ✅ re-enable button
    }
  }

  return (
    <div
      className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
      style={{ backgroundImage: "url('/bed.jpg')" }}
    >
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-center mb-2">
            Create an account
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Unlock a world of travel with one account across AwadhHotels.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading} // ✅ disable while loading
              className={`cursor-pointer w-full font-medium py-2 rounded-md text-sm transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
            >
              {loading ? "Sending OTP..." : "Continue"} {/* ✅ button text changes */}
            </button>
          </form>
          {/* Already have account */}
          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-red-500 font-medium hover:underline">
              Login
            </a>
          </p>

          {/* Footer text */}
          <p className="text-[11px] text-gray-400 text-center mt-6">
            By continuing, you agree to our{' '}
            <a href="/terms-and-conditions" className="underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div> 
  ); 
}
