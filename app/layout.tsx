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
  title: "VL London - Product Manager",
  description: "Comprehensive product and sale cards management system",
  icons: {
    icon: "/vllondon-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${balsamiqSans.variable} ${montserrat.variable} bg-gray-50`}>{children}</body>
    </html>
  );
}
