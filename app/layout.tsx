import type { Metadata } from "next";
import { Balsamiq_Sans, Montserrat } from "next/font/google";
import "./globals.css";

const balsamiqSans = Balsamiq_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-balsamiq',
});

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "VL London - Sale Cards",
  description: "Product sale cards with winter theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${balsamiqSans.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}
