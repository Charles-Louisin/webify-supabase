'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { FiMenu, FiX, FiMoon, FiSun, FiUser, FiMessageSquare, FiLogIn, FiSettings, FiLogOut, FiEdit, FiHelpCircle } from 'react-icons/fi';

// Animation pour l'apparition/disparition de la navbar
const navVariants = {
  hidden: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Pages du site
  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Projets', path: '/projects' },
    { name: 'Compétences', path: '/skills' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  // Nouveaux onglets ajoutés
  const userItems = [
    { name: 'Connexion', path: '/auth', icon: <FiLogIn className="mr-1" /> },
    { name: 'Profil', path: '/profile/1', icon: <FiUser className="mr-1" /> },
    { name: 'Messages', path: '/messaging', icon: <FiMessageSquare className="mr-1" /> },
    { name: 'Admin', path: '/admin/dashboard', icon: <FiSettings className="mr-1" /> },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Gérer le changement de thème
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Évite les problèmes d'hydratation
  if (!mounted) {
    return null;
  }

  const isDarkMode = theme === 'dark';

  return (
    <motion.nav 
      className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800 h-16"
      variants={navVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <Image 
                  src="/images/webifyLogo1.png" 
                  alt="WEBIFY Logo" 
                  fill 
                  className="object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/32";
                  }}
                />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                WEBIFY
              </span>
            </Link>
          </div>
          
          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}>
                    <span className={`px-2 py-2 rounded-md text-sm font-medium transition-colors relative ${
                      pathname === item.path 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}>
                      {item.name}
                      {pathname === item.path && (
                        <motion.span 
                          layoutId="underline"
                          className="absolute left-0 bottom-0 w-full h-0.5 bg-primary-600 dark:bg-primary-400"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-700 mx-2"></div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 focus:outline-none text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
              </button>
              
              <div className="relative group">
                <button 
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                  <FiUser className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  {userItems.map((item) => (
                    <Link 
                      key={item.path}
                      href={item.path}
                    >
                      <span className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        pathname === item.path || pathname.startsWith(item.path + '/')
                          ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400' 
                          : ''
                      }`}>
                        {item.icon} {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-md">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.path 
                      ? 'text-primary-600 bg-gray-50 dark:text-primary-400 dark:bg-gray-800/50' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              
              {userItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === item.path || pathname.startsWith(item.path + '/') 
                      ? 'text-primary-600 bg-gray-50 dark:text-primary-400 dark:bg-gray-800/50' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}>
                    {item.icon} {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 