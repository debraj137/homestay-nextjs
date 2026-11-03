"use client";

import Link from "next/link";
import { ChevronRight, Headphones, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function handleLogout() {
    logout();
    window.location.href = "/";
  }

  function handleListProperty(event) {
    event.preventDefault();
    if (user) logout();
    router.push("/login");
    setIsOpen(false);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  const publicLinks = (
    <>
      <Link href="/homestays" onClick={closeMenu}>
        Find a stay
      </Link>
      <Link href="/login" onClick={handleListProperty}>
        List your property
      </Link>
      <Link href="/my-bookings" onClick={closeMenu}>
        My bookings
      </Link>
    </>
  );

  const accountLinks =
    user?.role === "admin" ? (
      <>
        <Link href="/admin/rooms" onClick={closeMenu}>
          Properties
        </Link>
        <Link href="/admin/bookings" onClick={closeMenu}>
          Bookings
        </Link>
        <Link href="/admin/owners" onClick={closeMenu}>
          Owners
        </Link>
        <Link href="/admin/coupons" onClick={closeMenu}>
          Coupons
        </Link>
        <Link href="/admin/pending-property" onClick={closeMenu}>
          Pending Property
        </Link>
        <Link href="/admin/approved-property" onClick={closeMenu}>
          Approved Property
        </Link>
      </>
    ) : user?.role === "owner" ? (
      <>
        <Link href="/listed-property" onClick={closeMenu}>
          My properties
        </Link>
        <Link href="/property-list" onClick={closeMenu}>
          List a property
        </Link>
      </>
    ) : (
      publicLinks
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfd3] bg-[#fffaf4]/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group" aria-label="Awadh Hotels home">
          <div className="leading-none">
            <span className="font-display block text-[1.45rem] font-semibold tracking-[-0.06em] text-[#4b2116]">
              Awadh
            </span>
            <span className="block pt-0.5 text-[0.57rem] font-bold uppercase tracking-[0.28em] text-[#a54528]">
              Hotels
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#493c35] lg:flex">
          {accountLinks}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+919250538645"
            className="flex items-center gap-2 text-xs font-semibold text-[#665850] transition hover:text-[#a54528]"
          >
            <Headphones className="h-4 w-4 text-[#a54528]" aria-hidden="true" />
            <span>+91 92505 38645</span>
          </a>
          {!user ? (
            <Link href="/login" className="awadh-button px-4 py-2 text-sm">
              Sign in <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="awadh-button-secondary px-4 py-2 text-sm"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-[#dfcbb5] text-[#4b2116] lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#eadfd3] bg-[#fffaf4] px-5 pb-6 pt-3 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col divide-y divide-[#eadfd3] text-base font-semibold text-[#493c35] [&>a]:py-3">
            {accountLinks}
          </nav>
          <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between rounded-2xl bg-[#f4eadc] px-4 py-3 text-sm">
            <a
              href="tel:+919250538645"
              className="flex items-center gap-2 font-semibold text-[#4b2116]"
            >
              <Headphones
                className="h-4 w-4 text-[#a54528]"
                aria-hidden="true"
              />
              +91 92505 38645
            </a>
            {!user ? (
              <Link
                href="/login"
                onClick={closeMenu}
                className="text-[#a54528]"
              >
                Sign in
              </Link>
            ) : (
              <button onClick={handleLogout} className="text-[#a54528]">
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
