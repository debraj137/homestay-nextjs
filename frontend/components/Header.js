'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, ShoppingBag, Phone, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  function handleLogout() {
    logout();
    window.location.href = '/';
  }

  function handleListProperty(e) {
    e.preventDefault(); // prevent default navigation
    if (user) {
      logout(); // logout first if logged in
    }
    router.push('/login'); // then navigate
  }

  function handleNavClick() {
    setIsOpen(false); // close mobile menu after clicking
  }

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/awadh1_logo.png" alt="Stay Logo" width={90} height={30} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          {user?.role === 'admin' ? (
            <>
              <Link href="/admin/pending-property" className="hover:text-red-500">Pending Property</Link>
              <Link href="/admin/approved-property" className="hover:text-red-500">Approved Property</Link>
              <Link href="/admin/owners" className="hover:text-red-500">Owner List</Link>
              <Link href="/admin/bookings" className="hover:text-red-500">All Booking</Link>
            </>
          ) : user?.role === 'owner' ? (
            <>
              <Link href="/listed-property" className="hover:text-red-500">Listed Property</Link>
              <Link href="/property-list" className="hover:text-red-500">Property List</Link>
            </>
          ) : (
            <>
              <Link href="/login" onClick={handleListProperty} className="hover:text-red-500">
                List Your Property
              </Link>
              <Link href="/my-bookings" className="hover:text-red-500">My Booking</Link>
            </>
          )}

          {/* Phone */}
          <div className="flex items-center space-x-1 text-gray-700">
            <Phone className="h-4 w-4" />
            <span className="text-sm">+91 9250538645</span>
          </div>

          {/* Login / Logout */}
          {!user ? (
            <Link href="/login" className="flex items-center space-x-1 hover:text-red-500">
              <User className="h-4 w-4" />
              <span>Login / Signup</span>
            </Link>
          ) : (
            <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-500 cursonr-pointer">
              <LogOut className="h-4 w-4" />
              <span className='cursor-pointer'>Logout</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 hover:text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t px-6 py-4 space-y-4">
          <div className="flex flex-col space-y-3">
            {user?.role === 'admin' ? (
              <>
                <Link href="/admin/pending-property" onClick={handleNavClick} className="block hover:text-red-500">Pending Property</Link>
                <Link href="/admin/approved-property" onClick={handleNavClick} className="block hover:text-red-500">Approved Property</Link>
                <Link href="/admin/owners" onClick={handleNavClick} className="block hover:text-red-500">Owner List</Link>
                <Link href="/admin/bookings" onClick={handleNavClick} className="block hover:text-red-500">All Booking</Link>
              </>
            ) : user?.role === 'owner' ? (
              <>
                <Link href="/listed-property" onClick={handleNavClick} className="block hover:text-red-500">Listed Property</Link>
                <Link href="/property-list" onClick={handleNavClick} className="block hover:text-red-500">Property List</Link>
              </>
            ) : (
              <>
                <Link href="/login" onClick={(e) => {handleNavClick(); handleListProperty(e);}} className="hover:text-red-500">
                  List Your Property
                </Link>
                <Link href="/my-bookings" onClick={handleNavClick} className="block hover:text-red-500">My Booking</Link>
              </>
            )}
          </div>

          <div className="pt-3">
            <p className="font-medium text-gray-800">+91 9250538645</p>
            <p className="text-sm text-gray-500">Call us to Book now</p>
          </div>

          {!user ? (
            <Link href="/login" onClick={handleNavClick} className="block font-medium hover:text-red-500">
              Login / Signup
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full text-left font-medium hover:text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}


