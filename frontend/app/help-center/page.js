'use client';

export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Help Center</h1>

      <p className="text-gray-700 mb-6">
        Need assistance? Our Help Center is here to guide you through booking, payments, and stay
        management.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">1. Booking Assistance</h2>
      <p className="text-gray-700 mb-4">
        You can search for homestays, select dates, apply filters, and book directly through our
        platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">2. Payments & Refunds</h2>
      <p className="text-gray-700 mb-4">
        We accept multiple payment methods including cards, UPI, and Pay at Hotel. Refunds follow
        our cancellation policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">3. Managing Your Booking</h2>
      <p className="text-gray-700 mb-4">
        Log in to your account to view, modify, or cancel bookings. For special requests, please
        contact support.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">4. Contact Support</h2>
      <p className="text-gray-700 mb-4">
        If you need further assistance, reach out via:
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>Email: <a href="mailto:support@awadhhotels.com" className="text-red-500 hover:underline">support@awadhhotels.com</a></li>
        <li>Phone: <a href="tel:+911234567890" className="text-red-500 hover:underline">+91 123-456-7890</a></li>
        <li>Live Chat: Available on our website (9am - 9pm IST)</li>
      </ul>
    </div>
  );
}
