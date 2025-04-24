import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Fitness-AI",
  description: "A modern application with AI for healthy and muscular body.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
          <div 
            className="absolute inset-0" 
            style={{ 
              background: 'linear-gradient(var(--cyber-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--cyber-grid-color) 1px, transparent 1px)',
              backgroundSize: '20px 20px' 
            }}
          ></div>
        </div>
        <main className="pt-24 flex-grow">
           {children}
        </main>
        <Footer/>
      </body>
    </html>
    </ConvexClerkProvider>
  );
}
