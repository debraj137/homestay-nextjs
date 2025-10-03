'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // 👇 Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/'); // redirect to homepage
    }
  }, [router]);

  async function handleSubmit(e) {     
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage('Login successful ✅');
      login(data.user, data.token);
      window.dispatchEvent(new Event("loginStatusChanged"));
      router.push('/'); // redirect after login
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/bed.jpg')", // 👈 put your image inside /public folder
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        {/* Left side text */}
        <div className="text-white md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            There’s a smarter way to STAY around
          </h1>
          <p className="text-lg font-medium">
            Sign up with your phone number and get exclusive access to discounts
            and savings on stays and with our many travel partners.
          </p>
        </div>

        {/* Right side form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2 max-w-md">
          {message && (
            <p className="mb-4 text-center text-sm text-red-500">{message}</p>
          )}

          <h2 className="text-2xl font-bold text-center mb-6">
            Login With Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold cursor-pointer"
            >
              Login
            </button>
          </form>

          {/* Signup Redirect */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?
            <div className="mt-2 space-x-4">
              <a href="/signup/email" className="text-red-500 font-semibold">
                Register As User
              </a>
              <span className="inline-block mx-2 text-gray-400">|</span>
              <a href="/owner-signup" className="text-blue-500 font-semibold">
                Register As Owner
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}










