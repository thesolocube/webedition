"use client";

import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export default function Layout({ children, showNavbar = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark text-white">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-16" : ""}>{children}</main>
    </div>
  );
}
