// 'use client';

// import { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useRouter } from 'next/navigation'

// export default function OwnerSignupPage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();
//   async function handleSubmit(e) {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           email,
//           mobileNumber: mobile,
//           password,
//           role: 'owner'
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);

//       toast.success('Owner registered successfully! Please verify OTP.');
//       // redirect to OTP page if needed
//       localStorage.setItem('pendingEmail', email);
//       router.push('/verify-otp'); // 👈 redirect to OTP page
//     } catch (err) {
//       toast.error(err.message || 'Something went wrong');
//     }
//   }

//   return (
//     <div
//       className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
//       style={{ backgroundImage: "url('/bed.jpg')" }}
//     >
//       <div className="absolute inset-0 bg-black/40"></div>
//       <div className="relative z-10 max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-2xl font-bold text-center mb-6">Register as Owner</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg"/>
//           <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg"/>
//           <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="w-full px-4 py-2 border rounded-lg"/>
//           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg"/>
//           <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold cursor-pointer">
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OwnerSignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loader state
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // start loader
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          mobileNumber: mobile,
          password,
          role: 'owner',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('Owner registered successfully! Please verify OTP.');
      localStorage.setItem('pendingEmail', email);
      router.push('/verify-otp');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false); // stop loader
    }
  }

  return (
    <div
      className="flex-1 flex items-center justify-center bg-cover bg-center relative h-screen"
      style={{ backgroundImage: "url('/bed.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register as Owner</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="tel"
            placeholder="Mobile Number(10 digits)"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* ✅ Button with loader */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold cursor-pointer ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

