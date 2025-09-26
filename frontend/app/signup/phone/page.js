'use client';
import { Suspense } from 'react';
import PhoneSignupPageContent from '@/components/PhoneSignupPageContent';

export default function PhoneSignupPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading phone signup...</p>}>
      <PhoneSignupPageContent />
    </Suspense>
  );
}
