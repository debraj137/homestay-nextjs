import { Suspense } from 'react';
import VerifyClient from './VerifyClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
