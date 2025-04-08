'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

export function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const animationControls = useAnimation();
  const threeSceneRef = useRef(null);
  const { theme, resolvedTheme } = useTheme();
  const isDarkMode = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;
  
  useEffect(() => {
    setMounted(true);
    
    // Animation des titres et paragraphes
    animationControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }
    });
    
    // Initialisation de la scène Three.js
    if (canvasRef.current && !threeSceneRef.current) {
      const initThreeScene = () => {
        // Création de la scène
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current,
          alpha: true,
          antialias: true 
        });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Géométries et matériaux
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        
        const posArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 15;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.03,
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Ajout de sphères lumineuses
        const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const sphereMaterial1 = new THREE.MeshBasicMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8 });
        const sphereMaterial2 = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.8 });
        
        const sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial1);
        const sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial2);
        
        sphere1.position.set(-2, 1, -5);
        sphere2.position.set(2, -1, -5);
        
        scene.add(sphere1);
        scene.add(sphere2);
        
        // Positionnement de la caméra
        camera.position.z = 5;
        
        // Gestion du redimensionnement
        const handleResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Animation
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        const animate = () => {
          requestAnimationFrame(animate);
          
          particlesMesh.rotation.y += 0.002;
          particlesMesh.rotation.x += 0.001;
          
          // Interaction avec la souris
          particlesMesh.rotation.y += mouseX * 0.001;
          particlesMesh.rotation.x += mouseY * 0.001;
          
          // Animation des sphères
          const time = Date.now() * 0.001;
          sphere1.position.x = Math.sin(time * 0.5) * 3;
          sphere1.position.y = Math.cos(time * 0.7) * 1.5;
          
          sphere2.position.x = Math.cos(time * 0.3) * 3;
          sphere2.position.y = Math.sin(time * 0.6) * 1.5;
          
          renderer.render(scene, camera);
        };
        
        animate();
        
        // Nettoyage lors du démontage
        threeSceneRef.current = {
          cleanup: () => {
            window.removeEventListener('resize', handleResize);
            scene.remove(particlesMesh);
            scene.remove(sphere1);
            scene.remove(sphere2);
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            sphereGeometry.dispose();
            sphereMaterial1.dispose();
            sphereMaterial2.dispose();
            renderer.dispose();
          }
        };
      };
      
      initThreeScene();
    }
    
    return () => {
      if (threeSceneRef.current) {
        threeSceneRef.current.cleanup();
      }
    };
  }, []);
  
  // Effet supplémentaire pour réagir aux changements de thème
  useEffect(() => {
    if (mounted) {
      // Forcer le rendu lors du changement de thème
      animationControls.start({
        scale: [1, 1.01, 1],
        transition: { duration: 0.3 }
      });
    }
  }, [theme, resolvedTheme, mounted, animationControls]);
  
  // Animation pour la phrase d'accroche
  const taglineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
        delayChildren: 0.8
      }
    }
  };

  // Utiliser une fonction pour les variants de mots pour qu'ils soient recalculés à chaque rendu
  const getWordVariants = (isDark) => ({
    hidden: { opacity: 0, y: 20, textShadow: "0 0 0px rgba(255,255,255,0)" },
    visible: { 
      opacity: 1, 
      y: 0,
      textShadow: isDark ? "0 0 15px rgba(255,255,255,0.8)" : "0 0 10px rgba(0,0,0,0.2)",
      color: isDark ? "#ffffff" : "#1e293b",
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  });

  // Séparer les mots pour l'animation
  const taglineWords = "VOTRE VISION, NOTRE CRÉATION".split(' ');

  // Animation des lettres pour l'effet de scintillement
  const letterVariants = {
    initial: { opacity: 0.6 },
    animate: { 
      opacity: [0.6, 1, 0.6], 
      transition: { 
        repeat: Infinity, 
        duration: 3, 
        ease: "easeInOut",
        repeatType: "reverse" 
      } 
    }
  };

  if (!mounted) return null;

  return (
    <div className={`relative w-full overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Canvas Three.js pour l'arrière-plan */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Effet de grille pour un look futuriste */}
      <div 
        className={`absolute inset-0 z-0 ${isDarkMode ? 'opacity-5' : 'opacity-10'}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      {/* Contenu principal */}
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <div className="flex justify-center items-center mb-6 bg-opacity-30 dark:bg-opacity-30 bg-white/10 dark:bg-black/10 py-4 px-6 rounded-xl">
              <div className="flex flex-row flex-nowrap items-center whitespace-nowrap">
                <Image 
                  src="/images/webifyLogo1.png" 
                  alt="Webify Logo" 
                  width={80}
                  height={80}
                  className="animate-pulse mr-3"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className={`text-4xl sm:text-6xl md:text-8xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} font-orbitron tracking-wider whitespace-nowrap`}
                >
                  {Array.from("WEBIFY").map((letter, i) => (
                    <motion.span
                      key={i}
                      variants={letterVariants}
                      initial="initial"
                      animate="animate"
                      style={{ 
                        display: 'inline-block',
                        transition: { delay: i * 0.1 }
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`text-xl md:text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'} max-w-3xl mx-auto font-medium leading-relaxed py-4 px-6 backdrop-blur-sm bg-opacity-30 dark:bg-opacity-30 ${isDarkMode ? 'bg-black/20' : 'bg-white/50'} rounded-lg`}
            >
              Bienvenue chez WEBIFY, à la fois un portfolio d'un développeur passionné et une startup dédiée 
              à transformer vos idées en expériences numériques exceptionnelles.
            </motion.p>
          </motion.div>
          
          <motion.div
            variants={taglineVariants}
            initial="hidden"
            animate="visible"
            className="mb-14 py-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-primary-400/20 to-primary-600/20 blur-xl"></div>
              <motion.h2 
                className={`relative font-orbitron text-4xl md:text-5xl font-bold tracking-widest py-6 ${
                  isDarkMode 
                    ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-primary-400 bg-white/5 dark:bg-black/5" 
                    : "text-slate-800 bg-white/50"
                } backdrop-blur-sm px-4 rounded-lg`}
                initial={{ filter: "brightness(0.5)" }}
                animate={{ 
                  filter: isDarkMode 
                    ? ["brightness(0.5)", "brightness(0.7)", "brightness(1.2)", "brightness(1)"] 
                    : ["brightness(0.7)", "brightness(1)"],
                  transition: {
                    duration: 2,
                    times: isDarkMode ? [0, 0.3, 0.6, 1] : [0, 1],
                    ease: "easeInOut",
                    delay: 1.5
                  }
                }}
              >
                {taglineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    initial="hidden"
                    animate="visible"
                    variants={getWordVariants(isDarkMode)}
                    className="inline-block mx-2 backdrop-blur-sm"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/about" 
                className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl"
              >
                Découvrir
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/contact" 
                className="inline-block px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl shadow-lg border border-gray-600 transform transition-all duration-300 hover:shadow-xl"
              >
                Nous contacter
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Ligne décorative du bas */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
    </div>
  );
} 