'use client';

import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function WithNavFooterLayout({ children }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Attendre que le composant soit monté côté client pour accéder au thème
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Détermine le thème actuel, même pendant l'hydratation
  const isDarkMode = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;

  return (
    <>
      <Navbar />
      <main className={`flex-grow pt-0 min-h-screen transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gray-950 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        {children}
      </main>
      <div className="relative z-20">
        <Footer />
      </div>
    </>
  );
} 