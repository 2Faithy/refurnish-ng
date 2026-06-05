import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReFurnish NG",
  description: "A trusted furniture marketplace for Nigerians.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen w-full">
          {/* Sidebar / Navbar */}
          <Navbar />

          {/* Main Content */}
          <div className="flex flex-col w-full">
            <main className="flex-grow overflow-y-auto">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
