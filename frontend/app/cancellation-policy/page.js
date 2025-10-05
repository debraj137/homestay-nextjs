'use client';

export default function CancellationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Cancellation Policy</h1>
      <p className="text-gray-700 mb-4">
        At <strong>Awadh Hotels</strong>, we understand that plans can change. Our cancellation policy
        is designed to be fair to both our guests and property owners.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">1. Free Cancellation</h2>
      <p className="text-gray-700 mb-4">
        Bookings canceled within <strong>24 hours of booking</strong> (and at least 48 hours before check-in)
        are eligible for a full refund.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">2. Partial Refunds</h2>
      <p className="text-gray-700 mb-4">
        - Cancellations made <strong>7 days before check-in</strong>: 50% refund of total booking amount. <br />
        - Cancellations made <strong>less than 7 days before check-in</strong>: No refund.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">3. No-shows</h2>
      <p className="text-gray-700 mb-4">
        Guests who do not arrive without prior cancellation will be charged the full booking amount.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">4. Special Cases</h2>
      <p className="text-gray-700 mb-4">
        In cases of <strong>natural disasters, medical emergencies, or government restrictions</strong>,
        exceptions may be granted at the discretion of Awadh Hotels management.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800">5. Refund Timeline</h2>
      <p className="text-gray-700 mb-4">
        Refunds (if applicable) will be processed within <strong>7-10 business days</strong> and credited
        to the original payment method.
      </p>

      <p className="mt-8 text-gray-600 italic">
        For assistance with cancellations, please contact our support team at{' '}
        <a href="mailto:support@awadhhotels.com" className="text-red-500 hover:underline">
          support@awadhhotels.com
        </a>{' '}
        or call us at{' '}
        <a href="tel:+911234567890" className="text-red-500 hover:underline">
          +91 123-456-7890
        </a>.
      </p>
    </div>
  );
}
