'use client';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">STAY for Business</a></li>
            <li><a href="#">Corporate Booking</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Cancellation Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Explore</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">Home Stay In Ayodhya</a></li>
            <li><a href="#">Home Stay In Varanasi</a></li>
            <li><a href="#">Home Stay In Mathura</a></li>
            <li><a href="#">Home Stay In Vrindavan</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <p className="text-gray-600">
            Email:{' '}
            <a href="mailto:supportstay.com" className="text-red-500">
              supportstay.com
            </a>
          </p>
          <p className="text-gray-600">
            Phone:{' '}
            <a href="tel:+911234567890" className="text-red-500">
              +91 123-456-7890
            </a>
          </p>
          <div className="flex space-x-4 mt-3 text-gray-600">
            <a href="#"><Facebook size={18} /></a>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mt-6"></div>

      {/* Bottom */}
      <div className="py-4 text-center text-sm text-gray-500">
        © 2025 STAY Rooms Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}
