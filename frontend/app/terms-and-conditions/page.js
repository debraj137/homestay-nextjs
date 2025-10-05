'use client';

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms & Conditions</h1>

      <p className="text-gray-700 mb-4">
        Welcome to <strong>Awadh Hotels</strong>. By accessing and using our website and services,
        you agree to the following terms and conditions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">1. Booking Policy</h2>
      <p className="text-gray-700 mb-4">
        All bookings are subject to availability and confirmation. Guests are required to provide
        accurate details during booking.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">2. Guest Responsibilities</h2>
      <p className="text-gray-700 mb-4">
        Guests must follow property rules and maintain decorum during their stay. Any damage caused
        will be chargeable.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">3. Payments</h2>
      <p className="text-gray-700 mb-4">
        Payments must be made in full at the time of booking, unless specified otherwise. Refunds
        follow our cancellation policy.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">4. Liability</h2>
      <p className="text-gray-700 mb-4">
        Awadh Hotels is not responsible for loss of personal belongings, accidents, or events beyond
        our control (such as natural disasters).
      </p>

      <p className="mt-8 text-gray-600 italic">
        If you have any questions about these terms, please contact us at{' '}
        <a href="mailto:support@awadhhotels.com" className="text-red-500 hover:underline">
          support@awadhhotels.com
        </a>.
      </p>
    </div>
  );
}
