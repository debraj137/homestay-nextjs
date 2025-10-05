'use client';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold uppercase mb-4 border-b-2 border-red-500 inline-block">
            Company
          </h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-red-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Careers</a></li>
            <li><a href="#" className="hover:text-red-400 transition">STAY for Business</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Corporate Booking</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold uppercase mb-4 border-b-2 border-red-500 inline-block">
            Support
          </h3>
          <ul className="space-y-2">
            <li><Link href="/help-center" className="hover:text-red-400 transition">Help Center</Link></li>
            <li><Link href="/faqs" className="hover:text-red-400 transition">FAQs</Link></li>
            <li><Link href="/cancellation-policy" className="hover:text-red-400 transition">Cancellation Policy</Link></li>
            <li><Link href="/terms-and-conditions" className="hover:text-red-400 transition">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white font-semibold uppercase mb-4 border-b-2 border-red-500 inline-block">
            Explore
          </h3>
          <ul className="space-y-2">
            <li><Link href="/search?city=Ayodhya" className="hover:text-red-400 transition">
              Home Stay In Ayodhya
            </Link></li>
            <li><Link href="/search?city=Varanasi" className="hover:text-red-400 transition">Home Stay In Varanasi</Link></li>
            <li><Link href="/search?city=Mathura" className="hover:text-red-400 transition">Home Stay In Mathura</Link></li>
            <li><Link href="/search?city=Vrindavan" className="hover:text-red-400 transition">Home Stay In Vrindavan</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold uppercase mb-4 border-b-2 border-red-500 inline-block">
            Contact Us
          </h3>
          <p>
            Email:{' '}
            <a href="mailto:supportstay.com" className="text-red-400 hover:text-red-300 transition">
              support@stay.com
            </a>
          </p>
          <p className="mt-2">
            Phone:{' '}
            <a href="tel:+911234567890" className="text-red-400 hover:text-red-300 transition">
              +91 123-456-7890
            </a>
          </p>
          <div className="flex space-x-3 mt-4">
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-red-500 transition">
              <Facebook size={18} className="text-white" />
            </a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-red-500 transition">
              <Instagram size={18} className="text-white" />
            </a>
            <a href="#" className="p-2 bg-gray-700 rounded-full hover:bg-red-500 transition">
              <Twitter size={18} className="text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © 2025 STAY Rooms Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
