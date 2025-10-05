export const metadata = {
  title: "Privacy Policy | Awadh Hotels",
  description:
    "Learn how Awadh Hotels collects, uses, and protects your personal information during your stay and while using our website.",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Privacy Policy
      </h1>
      <p className="text-gray-700 mb-6">
        At <strong>Awadh Hotels</strong>, we value your privacy and are committed to
        protecting your personal data. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit
        our website or use our services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        1. Information We Collect
      </h2>
      <p className="text-gray-700 mb-4">
        We may collect the following types of information:
      </p>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>
          <strong>Personal Information:</strong> such as your name, email
          address, phone number, and payment details when you make a booking.
        </li>
        <li>
          <strong>Usage Data:</strong> including your browser type, IP address,
          and access times to improve our services.
        </li>
        <li>
          <strong>Cookies:</strong> small files stored on your device to enhance
          your browsing experience.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        2. How We Use Your Information
      </h2>
      <p className="text-gray-700 mb-4">
        We use your data to:
      </p>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>Process and manage your bookings.</li>
        <li>Send booking confirmations and service updates.</li>
        <li>Provide customer support and respond to inquiries.</li>
        <li>Improve our website, offers, and user experience.</li>
        <li>Comply with legal and regulatory requirements.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        3. Sharing of Information
      </h2>
      <p className="text-gray-700 mb-4">
        We do not sell or rent your personal information. However, we may share
        data with:
      </p>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>
          <strong>Service Providers:</strong> such as payment processors or
          email service providers to complete transactions and communications.
        </li>
        <li>
          <strong>Legal Authorities:</strong> when required by law or to protect
          our rights.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        4. Data Security
      </h2>
      <p className="text-gray-700 mb-4">
        We use appropriate technical and organizational measures to safeguard
        your personal data against unauthorized access, alteration, or
        destruction.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        5. Cookies and Tracking Technologies
      </h2>
      <p className="text-gray-700 mb-4">
        Our website uses cookies to improve functionality and enhance user
        experience. You can choose to disable cookies through your browser
        settings, though some parts of the website may not function properly.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        6. Your Rights
      </h2>
      <p className="text-gray-700 mb-4">
        You have the right to:
      </p>
      <ul className="list-disc ml-6 text-gray-700 space-y-2">
        <li>Access, update, or delete your personal information.</li>
        <li>Withdraw consent where processing is based on consent.</li>
        <li>
          Request details about how your data is processed and used.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        7. Changes to This Policy
      </h2>
      <p className="text-gray-700 mb-4">
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated “Last Updated” date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        8. Contact Us
      </h2>
      <p className="text-gray-700">
        If you have any questions or concerns about this Privacy Policy, please
        contact us at:
      </p>
      <p className="text-gray-700 mt-2">
        <strong>Email:</strong>{" "}
        <a href="mailto:support@awadhhotels.com" className="text-red-500 hover:underline">
          support@awadhhotels.com
        </a>
        <br />
        <strong>Phone:</strong>{" "}
        <a href="tel:+911234567890" className="text-red-500 hover:underline">
          +91 123-456-7890
        </a>
      </p>

      <p className="text-gray-500 text-sm mt-8">
        Last Updated: October 2025
      </p>
    </div>
  );
}
