'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthShell from '@/components/AuthShell';

export default function NameSignupPage() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // ✅ carry email from previous step

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/save-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('signupToken')}`,
        },
        body: JSON.stringify({ name: fullName }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Name saved successfully ✅");
      router.push(`/signup/password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save name");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthShell
        step={2}
        title="What should we call you?"
        description="Use the name you’d like your hosts and booking confirmations to show."
        footer={<>Prefer to sign in? <Link href="/login" className="auth-link">Go to login</Link></>}
      >
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" type="text" autoComplete="name" placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required className="auth-input" />
          </div>
          <button type="submit" disabled={loading} className="awadh-button auth-submit">{loading ? 'Saving…' : 'Continue'}</button>
        </form>
      </AuthShell>
      {false && (
    <div
      className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
      style={{ backgroundImage: "url('/bed.jpg')" }}
    >
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          {/* Heading */}
          <h1 className="text-2xl font-semibold text-center mb-2">
            What’s your name?
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Enter the name you use on official ID (like passport or license).
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full font-medium py-2 rounded-md text-sm transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
