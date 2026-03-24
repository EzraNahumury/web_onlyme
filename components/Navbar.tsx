"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Send, LayoutGrid, LogIn, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/submit", label: "Submit Project", icon: Send },
  { href: "/projects", label: "Project Board", icon: LayoutGrid },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/logo/logo.png"
            alt="Coreflow AI"
            width={36}
            height={36}
            className="h-9 w-9 transition-transform group-hover:scale-110"
            priority
            unoptimized
          />
          <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-bold text-lg">
            Coreflow AI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === href
                  ? "text-red-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {pathname === href && (
                <span className="absolute inset-0 rounded-xl bg-red-500/10 ring-1 ring-red-500/20" />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
            </Link>
          ))}
          <Link
            href="/admin"
            className={`ml-3 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              pathname === "/admin"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                : "glass glass-hover text-zinc-300 hover:text-white"
            }`}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl glass text-zinc-400 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-white/5 bg-[#050505]/95 backdrop-blur-xl px-4 pb-4 pt-2 md:hidden">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-red-500/10 text-red-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
