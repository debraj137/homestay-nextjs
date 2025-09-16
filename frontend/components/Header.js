'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, ShoppingBag, Phone, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout(); // ✅ will clear context + localStorage
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
        {user?.role === 'owner' ? (
          <>
            {/* Listed Property */}
            <Link href="/listed-property" className="flex items-center space-x-2 group">
              <Building2 className="h-4 w-4 text-gray-700 group-hover:text-black" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">Listed Property</span>
                <span className="text-[11px] text-gray-500">Manage your listings</span>
              </div>
            </Link>

            {/* Property List */}
            <Link href="/property-list" className="flex items-center space-x-2 group">
              <ShoppingBag className="h-4 w-4 text-gray-700 group-hover:text-black" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">Property List</span>
                <span className="text-[11px] text-gray-500">See all your properties</span>
              </div>
            </Link>
          </>
        ) : (
          <>
            {/* List Your Property */}
            <Link href="/owner-signup" className="flex items-center space-x-2 group">
              <Building2 className="h-4 w-4 text-gray-700 group-hover:text-black" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">List Your Property</span>
                <span className="text-[11px] text-gray-500">Start earning in 30 mins</span>
              </div>
            </Link>

            {/* My Booking */}
            <Link href="/my-bookings" className="flex items-center space-x-2 group">
              <ShoppingBag className="h-4 w-4 text-gray-700 group-hover:text-black" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">My Booking</span>
                <span className="text-[11px] text-gray-500">See your booked rooms</span>
              </div>
            </Link>
          </>
        )}

        {/* Phone */}
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-700" />
          <div className="flex flex-col leading-tight">
            <span className="font-medium">0124-6201611</span>
            <span className="text-[11px] text-gray-500">Call us to Book now</span>
          </div>
        </div>

        {/* Login / Signup OR Logout */}
        {!user ? (
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
