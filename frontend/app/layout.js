import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Awadh Hotels | Book Affordable Homestays in Ayodhya, Varanasi & More",
  description: "Find and book budget-friendly homestays in Ayodhya, Varanasi, Lucknow, and Agra. Enjoy comfortable stays, easy booking, verified properties, and instant confirmation with Awadh Hotels.",
};

export default function RootLayout({ children }) {
  return (
    // <html lang="en">
    //   <body
    //     className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //   >
    //     {children}
    //   </body>
    // </html>
    <html>
      <head>
        <title>Homestay</title>
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="">{children}</main>
        </AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Footer />
      </body>
    </html>
  );
}
