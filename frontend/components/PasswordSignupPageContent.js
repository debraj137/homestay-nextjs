'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import AuthShell from '@/components/AuthShell';

export default function PasswordSignupPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // ✅ carry email from previous step

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/save-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('signupToken')}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Password saved successfully 🔑");
      router.push(`/signup/phone?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to save password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthShell
        step={2}
        title="Create a password"
        description="Choose a password with at least six characters to keep your bookings protected."
        footer={<>Already registered? <Link href="/login" className="auth-link">Sign in</Link></>}
      >
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <div className="relative">
              <input id="signup-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={6} placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} required className="auth-input pr-20" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-xs font-bold text-[#a54528]" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
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
            Create a password
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm">
            Use this password with your email to log in securely.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer w-full font-medium py-2 rounded-md text-sm transition 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-800 text-white"}`}
            >
              {loading ? "Saving..." : "Create password"}
            </button>
          </form>
        </div>
      </div>
    </div>
      )}
    </>
  );
}
