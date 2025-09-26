'use client';
import { Suspense } from "react";
import NameSignupPageContent from "@/components/NameSignupPageContent";

export default function NameSignupPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <NameSignupPageContent />
    </Suspense>
  );
}
