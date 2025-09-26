'use client';
import { Suspense } from "react";
import PasswordSignupPageContent from "@/components/PasswordSignupPageContent";

export default function PasswordSignupPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PasswordSignupPageContent />
    </Suspense>
  );
}
