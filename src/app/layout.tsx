import type { Metadata, Viewport } from "next";
import { Baloo_2, Inter } from "next/font/google";

import { pizzeria } from "@/data/config";
import { CartProvider } from "@/context/CartContext";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${pizzeria.name} | Cardápio Digital`,
  description: `${pizzeria.tagline} Monte sua pizza e finalize o pedido pelo WhatsApp. ${pizzeria.delivery.headline}`,
  applicationName: pizzeria.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#027c3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
