import type { Metadata } from "next";
import { Geist, Geist_Mono, Lacquer } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lacquer = Lacquer({
  variable: "--font-lacquer",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Rub-o-Rama",
  description: "Why doom scroll when you win with rub-o-rama?",
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lacquer.variable} antialiased`}
      >
        <div className="mx-auto max-w-[600px] w-full">
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
