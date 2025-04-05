'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { motion, AnimatePresence } from 'framer-motion';

export function MainLayout({ children, showParticles = true, showFooter = true }) {
  const [showNavbar, setShowNavbar] = useState(false);

  // Animation pour la transition de page
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    in: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeInOut'
      }
    },
    out: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: 'easeInOut'
      }
    }
  };

  // Écouter l'événement pour afficher/masquer la navbar
  useEffect(() => {
    const handleToggleNavbar = (event) => {
      setShowNavbar(event.detail.show);
    };

    window.addEventListener('toggleNavbar', handleToggleNavbar);
    
    return () => {
      window.removeEventListener('toggleNavbar', handleToggleNavbar);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden relative">
      {showParticles && <ParticlesBackground />}
      
      {/* <AnimatePresence>
        {showNavbar && <Navbar />}
      </AnimatePresence> */}
      
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="flex-grow w-full pt-16 pb-20 overflow-hidden"
      >
        {children}
      </motion.main>
      
      {/* {showFooter && <Footer />} */}
    </div>
  );
} 