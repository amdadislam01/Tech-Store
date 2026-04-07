import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/components/AuthProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Tech Store | Modern E-commerce",
  description: "Your one-stop shop for modern tech gadgets.",
  keywords: ["tech", "gadgets", "electronics", "e-commerce", "store"],
  openGraph: {
    title: "Tech Store | Modern E-commerce",
    description: "Your one-stop shop for modern tech gadgets.",
    url: "https://techstore.com",
    siteName: "Tech Store",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <StoreProvider>
            <Toaster position="top-right" />
            {children}
            <WhatsAppButton />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
