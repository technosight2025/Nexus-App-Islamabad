import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/ui";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Creative production platform for Pakistan.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <Navbar brandName="Nexus" />
        {children}
      </body>
    </html>
  );
}
