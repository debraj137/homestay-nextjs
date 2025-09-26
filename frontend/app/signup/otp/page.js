'use client';
import { Suspense } from 'react';
import OtpPageContent from '@/components/OtpPageContent'; // move actual logic here

export default function OtpPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading OTP page...</p>}>
      <OtpPageContent />
    </Suspense>
  );
}
