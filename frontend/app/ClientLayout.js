"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }) {
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
      <Footer />
    </AuthProvider>
  );
}
