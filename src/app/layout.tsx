import type { Metadata } from 'next';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextCommerce - Sleek E-Commerce Platform',
  description: 'A modern, high-conversion full-stack storefront and administrative dashboard built with Next.js, SQLite, and raw SQL queries.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
