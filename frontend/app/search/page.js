'use client';
import { Suspense } from "react";
import SearchPageContent from "@/components/SearchPageContent"; // move your logic here

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading search...</p>}>
      <SearchPageContent />
    </Suspense>
  );
}
