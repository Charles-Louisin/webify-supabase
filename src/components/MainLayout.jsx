'use client';

import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { motion } from 'framer-motion';

export function MainLayout({ children, showParticles = true }) {
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

  return (
    <>
      {showParticles && <ParticlesBackground />}
      <Navbar />
      <motion.main
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="min-h-screen pt-28 pb-20"
      >
        {children}
      </motion.main>
      <Footer />
    </>
  );
} 