// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Building2, ShoppingBag, Phone, User } from 'lucide-react';

// export default function Header() {
//   return (
//     <header className="flex items-center justify-between px-6 py-0 border-b bg-white shadow-sm">
//       {/* Logo */}
//       <Link href="/" className="flex items-center">
//         <Image
//           src="/stay.png"
//           alt="Stay Logo"
//           width={90}
//           height={30}
//           priority
//         />
//       </Link>

//       {/* Navigation */}
//       <nav className="flex items-center space-x-8 text-sm">
//         {/* List your property */}
//         <Link href="/list-property" className="flex items-center space-x-2 group">
//           <Building2 className="h-4 w-4 text-gray-700 group-hover:text-black" />
//           <div className="flex flex-col leading-tight">
//             <span className="font-medium">List Your Property</span>
//             <span className="text-[11px] text-gray-500">
//               Start earning in 30 mins
//             </span>
//           </div>
//         </Link>

//         {/* My booking */}
//         <Link href="/my-bookings" className="flex items-center space-x-2 group">
//           <ShoppingBag className="h-4 w-4 text-gray-700 group-hover:text-black" />
//           <div className="flex flex-col leading-tight">
//             <span className="font-medium">My Booking</span>
//             <span className="text-[11px] text-gray-500">
//               See your booked rooms
//             </span>
//           </div>
//         </Link>

//         {/* Phone */}
//         <div className="flex items-center space-x-2">
//           <Phone className="h-4 w-4 text-gray-700" />
//           <div className="flex flex-col leading-tight">
//             <span className="font-medium">0124-6201611</span>
//             <span className="text-[11px] text-gray-500">Call us to Book now</span>
//           </div>
//         </div>

//         {/* Login / Signup */}
//         <Link href="/login" className="flex items-center space-x-2 group">
//           <User className="h-4 w-4 text-gray-700 group-hover:text-black" />
//           <span className="font-medium">Login / Signup</span>
//         </Link>
//       </nav>
//     </header>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, ShoppingBag, Phone, User, LogOut } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    updateLoginStatus(); // check immediately on mount

    // Listen for custom events + storage changes
    window.addEventListener('loginStatusChanged', updateLoginStatus);
    window.addEventListener('storage', updateLoginStatus);

    return () => {
      window.removeEventListener('loginStatusChanged', updateLoginStatus);
      window.removeEventListener('storage', updateLoginStatus);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 🔔 notify other components
    window.dispatchEvent(new Event('loginStatusChanged'));

    window.location.href = '/'; // redirect to home
  }

  return (
    <header className="flex items-center justify-between px-6 py-0 border-b bg-white shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/stay.png"
          alt="Stay Logo"
          width={90}
          height={30}
          priority
        />
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-8 text-sm">
        {/* List your property */}
        <Link href="/list-property" className="flex items-center space-x-2 group">
          <Building2 className="h-4 w-4 text-gray-700 group-hover:text-black" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">List Your Property</span>
            <span className="text-[11px] text-gray-500">
              Start earning in 30 mins
            </span>
          </div>
        </Link>

        {/* My booking */}
        <Link href="/my-bookings" className="flex items-center space-x-2 group">
          <ShoppingBag className="h-4 w-4 text-gray-700 group-hover:text-black" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">My Booking</span>
            <span className="text-[11px] text-gray-500">
              See your booked rooms
            </span>
          </div>
        </Link>

        {/* Phone */}
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-700" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">0124-6201611</span>
            <span className="text-[11px] text-gray-500">Call us to Book now</span>
          </div>
        </div>

        {/* Login / Signup OR Logout */}
        {!isLoggedIn ? (
          <Link href="/login" className="flex items-center space-x-2 group">
            <User className="h-4 w-4 text-gray-700 group-hover:text-black" />
            <span className="font-medium">Login / Signup</span>
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 group text-gray-700 hover:text-black"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium cursor-pointer">Logout</span>
          </button>
        )}
      </nav>
    </header>
  );
}

