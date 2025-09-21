'use client';

import { Suspense } from 'react';
import CheckoutPageContent from '@/components/CheckoutPageContent';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading checkout...</p>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
