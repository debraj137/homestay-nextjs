import { Suspense } from 'react';
import BookForGuestClient from './BookForGuestClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <BookForGuestClient />
    </Suspense>
  );
}
