import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
