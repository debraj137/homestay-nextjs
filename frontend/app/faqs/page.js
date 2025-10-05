'use client';

export default function FAQsPage() {
  const faqs = [
    {
      question: 'How do I book a homestay?',
      answer:
        'Simply search for your destination and dates, browse available homestays, and click "Book Now" to confirm your reservation.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept credit/debit cards, UPI, and the Pay at Hotel option for selected properties.',
    },
    {
      question: 'Can I modify or cancel my booking?',
      answer:
        'Yes, you can manage your booking from your account. Cancellations and modifications are subject to our Cancellation Policy.',
    },
    {
      question: 'Is customer support available?',
      answer:
        'Yes, our support team is available via email, phone, and live chat from 9am to 9pm IST.',
    },
    {
      question: 'Do I need to create an account to book?',
      answer:
        'Yes, having an account helps us provide better support and allows you to manage your bookings easily.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h1>
      <p className="text-gray-700 mb-8">
        Here are some of the most common questions we receive from our guests.
      </p>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {faq.question}
            </h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-gray-600">
        Still have questions? Reach out to us at{' '}
        <a href="mailto:support@awadhhotels.com" className="text-red-500 hover:underline">
          support@awadhhotels.com
        </a>{' '}
        or call{' '}
        <a href="tel:+911234567890" className="text-red-500 hover:underline">
          +91 123-456-7890
        </a>
        .
      </p>
    </div>
  );
}
