// 'use client';

// import { useState } from 'react';

// export default function SignupPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');

//   function handleSubmit(e) {
//     e.preventDefault();
//     alert(`Name: ${name}, Email: ${email}, Mobile: ${mobile}, Password: ${password}`);
//     // TODO: Hook this to your backend API
//   }

//   return (
//     <div
//       className="h-[611px] flex items-center justify-center bg-cover bg-center relative"
//       style={{ backgroundImage: "url('/bed.jpg')" }} // 👈 same bg as login
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/40"></div>

//       {/* Content */}
//       <div className="relative z-10 max-w-6xl w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
//         {/* Left text */}
//         <div className="text-white md:w-1/2 mb-8 md:mb-0">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">
//             There’s a smarter way to STAY around
//           </h1>
//           <p className="text-lg font-medium">
//             Sign up with your phone number and get exclusive access to discounts
//             and savings on stays and with our many travel partners.
//           </p>
//         </div>

//         {/* Right form */}
//         <div className="bg-white p-8 rounded-2xl shadow-lg w-full md:w-1/2 max-w-md">
//           <h2 className="text-2xl font-bold text-center mb-6">
//             Create Your Account
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Full Name */}
//             <div>
//               <label className="block text-gray-700 mb-1">Full Name</label>
//               <input
//                 type="text"
//                 placeholder="Your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//               />
//             </div>

//             {/* Mobile Number */}
//             <div>
//               <label className="block text-gray-700 mb-1">Mobile Number</label>
//               <input
//                 type="tel"
//                 placeholder="Enter mobile number"
//                 value={mobile}
//                 onChange={(e) => setMobile(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-gray-700 mb-1">Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
//               />
//             </div>

//             {/* Register Button */}
//             <button
//               type="submit"
//               className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
//             >
//               Register
//             </button>
//           </form>

//           {/* Redirect to Login */}
//           <p className="text-center text-sm text-gray-600 mt-4">
//             Already have an account?{' '}
//             <a href="/login" className="text-red-500 font-semibold">
//               Login
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


 
'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [step, setStep] = useState('register'); // register | verify
  const [form, setForm] = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [otp, setOtp] = useState({ emailOtp: '', mobileOtp: '' });
  const [message, setMessage] = useState('');
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleRegister(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
      setStep('verify');
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, ...otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
      window.location.href = '/login';
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleResend() {
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
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
        {/* Left text */}
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
          {message && (
            <p className="mb-4 text-center text-sm text-red-500">{message}</p>
          )}

          {step === 'register' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Create Your Account
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
                <input
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
                >
                  Register
                </button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-red-500 font-semibold">
                  Login
                </a>
              </p>
            </>
          )}

          {step === 'verify' && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Verify Your Account
              </h2>
              <form onSubmit={handleVerify} className="space-y-4">
                <input
                  placeholder="Email OTP"
                  value={otp.emailOtp}
                  onChange={(e) => setOtp({ ...otp, emailOtp: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
                <input
                  placeholder="Mobile OTP"
                  value={otp.mobileOtp}
                  onChange={(e) => setOtp({ ...otp, mobileOtp: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                >
                  Verify
                </button>
              </form>
              <button
                onClick={handleResend}
                className="mt-4 text-sm text-blue-500"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
