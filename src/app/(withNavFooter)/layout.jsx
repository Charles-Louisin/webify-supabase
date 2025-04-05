'use client';

import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function WithNavFooterLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-0">
        {children}
      </main>
      <Footer />
    </>
  );
} 