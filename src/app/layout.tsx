import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/context/I18nContext";
import { CompareProvider } from "@/context/CompareContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompareBar from "@/components/CompareBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Video Tool Radar",
  description:
    "Find the perfect AI video generation tool. Compare features, quality, and limitations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-950 text-white antialiased`}>
        <I18nProvider>
          <CompareProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
            <CompareBar />
          </CompareProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
