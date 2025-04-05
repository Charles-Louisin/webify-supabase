'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { FiMail, FiLock, FiUser, FiArrowRight, FiHome, FiEye, FiEyeOff } from 'react-icons/fi';
import { ParticlesBackground } from '@/components/ParticlesBackground';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && theme === 'dark';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Animation pour le robot
  const robotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Fond de particules */}
      <ParticlesBackground className="opacity-80" />
      
      {/* Bouton retour à l'accueil */}
      <Link href="/">
        <motion.div
          className="absolute top-4 left-4 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-white/20 shadow-lg"
          whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.9 }}
        >
          <FiHome className="w-5 h-5" />
        </motion.div>
      </Link>
      
      {/* Cercles décoratifs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-500/5 to-transparent" />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary-500/10 dark:bg-primary-500/5"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -top-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-blue-400/10 dark:bg-blue-500/5"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="container mx-auto max-w-md">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 dark:border-gray-800/50"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-primary-600 rounded-t-lg"></div>
          
          <div className="text-center mb-8">
            <motion.div 
              className="flex justify-center mb-6"
              variants={itemVariants}
            >
              <Image 
                src="/images/webifyLogo1.png" 
                alt="WEBIFY Logo" 
                width={60} 
                height={60} 
                className="drop-shadow-lg"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/60";
                }}
              />
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
              variants={itemVariants}
            >
              {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-sm"
              variants={itemVariants}
            >
              {isLogin ? 'Bienvenue sur WEBIFY' : 'Rejoignez WEBIFY dès aujourd\'hui'}
            </motion.p>
          </div>
          
          <motion.form 
            variants={itemVariants}
            className="space-y-6"
          >
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="input pl-10 w-full backdrop-blur-sm bg-white/70 dark:bg-gray-800/70"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiMail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-10 w-full backdrop-blur-sm bg-white/70 dark:bg-gray-800/70"
                  placeholder="Votre adresse email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FiLock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  className="input pl-10 w-full backdrop-blur-sm bg-white/70 dark:bg-gray-800/70"
                  placeholder={isLogin ? "Votre mot de passe" : "Choisissez un mot de passe"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {isLogin && (
              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
            )}
            
            <motion.button
              type="submit"
              className="w-full btn-primary py-2 px-4 rounded-md flex items-center justify-center"
              whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
              <FiArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.form>
          
          <motion.div 
            variants={itemVariants}
            className="mt-6 text-center text-sm"
          >
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Nouveau sur WEBIFY ?' : 'Déjà inscrit ?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Éléments décoratifs */}
      <motion.div 
        className="absolute top-1/4 left-10 w-4 h-20 bg-gradient-to-b from-primary-300 to-primary-600 rounded-full opacity-30 dark:opacity-50"
        animate={{
          y: [0, 20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-10 w-4 h-20 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full opacity-30 dark:opacity-50"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div 
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-primary-400 rounded-full opacity-70"
        animate={{
          scale: [1, 2, 1],
          opacity: [0.7, 0.2, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-70"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 0.3, 0.7],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
} 