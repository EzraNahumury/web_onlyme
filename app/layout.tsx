import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import LayoutBackground from "@/components/LayoutBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coreflow AI | Project Tracker",
  description: "Track and manage AI engineering projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="noise-bg min-h-full flex flex-col bg-[#050505] text-zinc-100 relative">
        <LayoutBackground>
          <Navbar />
          <main className="flex-1 relative z-[1]">{children}</main>
          <footer className="relative z-[1] border-t border-white/5 py-6 text-center text-xs text-zinc-600">
            <p>&copy; {new Date().getFullYear()} Coreflow AI &middot; Project Progress Tracker</p>
          </footer>
        </LayoutBackground>
      </body>
    </html>
  );
}
