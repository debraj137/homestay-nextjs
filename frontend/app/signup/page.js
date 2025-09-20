'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [step, setStep] = useState('register'); 
  const [form, setForm] = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [otp, setOtp] = useState({ emailOtp: '', mobileOtp: '' });
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message); // ✅ success toast
      setStep('verify');
    } catch (err) {
      toast.error(err.message || 'Registration failed'); // ❌ error toast
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, ...otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
      window.location.href = '/';
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex-1 flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bed.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        
        {/* Left */}
        <div className="text-white md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            There’s a smarter way to STAY around
          </h1>
          <p className="text-lg font-medium">
            Sign up with your phone number and get exclusive access to discounts
            and savings on stays and with our many travel partners.
          </p>
        </div>

        {/* Right form card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2 max-w-md h-[611px] flex flex-col justify-center">

          {step === 'register' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                <input name="mobileNumber" placeholder="Mobile Number(10 digits)" value={form.mobileNumber} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
                <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'}`}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account? <a href="/login" className="text-red-500 font-semibold">Login</a>
              </p>
            </>
          )}

          {step === 'verify' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">Verify Your Account</h2>
              <form onSubmit={handleVerify} className="space-y-4">
                <input placeholder="Email OTP" value={otp.emailOtp} onChange={(e) => setOtp({ ...otp, emailOtp: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
                <input placeholder="Mobile OTP" value={otp.mobileOtp} onChange={(e) => setOtp({ ...otp, mobileOtp: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none" />
                <button type="submit" disabled={loading} className={`w-full py-2 rounded-lg font-semibold ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>
              <button onClick={handleResend} disabled={loading} className={`mt-4 text-sm ${loading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:underline'}`}>
                {loading ? 'Resending...' : 'Resend OTP'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
