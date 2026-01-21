// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { AuthProvider } from '../context/AuthContext';
// import { Toaster } from 'react-hot-toast';


// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: {
//     default: "Book Hotels in Ayodhya | Hourly & Full-Day Stays – Awadh Hotels",
//     template: "%s | Awadh Hotels", // applies to dynamic pages
//   },
//   description: "Book hotels in Ayodhya near Ram Mandir with Awadh Hotels. Choose hourly or full-day stays, verified rooms & instant online booking for your next visit.",
//   keywords: "Ayodhya hotels, hourly hotel booking, full-day hotel stays, verified rooms Ayodhya, online hotel booking Ayodhya, budget hotels Ayodhya, luxury hotels Ayodhya, family-friendly hotels Ayodhya, budget-friendly hotels Ayodhya, business travel Ayodhya, last-minute hotel deals Ayodhya, hotels near Ram Mandir Ayodhya",
//   authors: [{ name: "Awadh Hotels", url: "https://awadhhotels.com" }],
//   creator: "Awadh Hotels",
//   openGraph: {
//     title: "Book Hotels in Ayodhya | Hourly & Full-Day Stays – Awadh Hotels",
//     description: "Book hotels in Ayodhya near Ram Mandir with Awadh Hotels. Choose hourly or full-day stays, verified rooms & instant online booking for your next visit.",
//     url: "https://awadhhotels.com",
//     siteName: "Awadh Hotels",
//     images: [
//       {
//         url: "https://awadhhotels.com/awadh1_logo.png",
//         width: 1200,
//         height: 630,
//         alt: "Awadh Hotels - Book Hotels in Ayodhya",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Book Hotels in Ayodhya | Hourly & Full-Day Stays – Awadh Hotels",
//     description: "Book hotels in Ayodhya near Ram Mandir with Awadh Hotels. Choose hourly or full-day stays, verified rooms & instant online booking for your next visit.",
//     images: ["https://awadhhotels.com/awadh1_logo.png"],
//   },  
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       {/* <head>
//         <title>Homestay</title>
//       </head> */}
//       <body className="flex flex-col min-h-screen">
//         <AuthProvider>
//           <Header />
//           <main className="">{children}</main>
//         </AuthProvider>
//         <Toaster position="top-right" reverseOrder={false} />
//         <Footer />
//       </body>
//     </html>
//   );
// }

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Book Hotels in Ayodhya | Hourly & Full-Day Stays – Awadh Hotels",
    template: "%s | Awadh Hotels",
  },
  description:
    "Book hotels in Ayodhya near Ram Mandir with Awadh Hotels. Choose hourly or full-day stays, verified rooms & instant online booking.",
  keywords:
    "Ayodhya hotels, hourly hotel booking, full-day hotel stays, verified rooms Ayodhya",
  authors: [{ name: "Awadh Hotels", url: "https://awadhhotels.com" }],
  creator: "Awadh Hotels",
  openGraph: {
    title: "Book Hotels in Ayodhya | Hourly & Full-Day Stays – Awadh Hotels",
    description:
      "Book hotels in Ayodhya near Ram Mandir with Awadh Hotels. Choose hourly or full-day stays.",
    url: "https://awadhhotels.com",
    siteName: "Awadh Hotels",
    images: [
      {
        url: "https://awadhhotels.com/awadh1_logo.png",
        width: 1200,
        height: 630,
        alt: "Awadh Hotels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Hotels in Ayodhya | Awadh Hotels",
    description:
      "Book hotels in Ayodhya near Ram Mandir with Awadh Hotels.",
    images: ["https://awadhhotels.com/awadh1_logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
