'use client';

import Navbar from '@/components/Navbar';

export default function WithNavLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-0">
        {children}
      </main>
    </>
  );
} 