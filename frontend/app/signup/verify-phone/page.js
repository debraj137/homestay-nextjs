'use client';
import { Suspense } from "react";
import VerifyPhonePageContent from "@/components/VerifyPhonePageContent";

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyPhonePageContent />
    </Suspense>
  );
}
