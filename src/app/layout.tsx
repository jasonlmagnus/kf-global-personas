import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalNav from "@/components/GlobalNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KF Personas | Korn Ferry",
  description: "A centralized library of global and regional personas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <GlobalNav />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        {/* You could add a GlobalFooter here later if needed */}
      </body>
    </html>
  );
}
