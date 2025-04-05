'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation, useInView } from 'framer-motion';
import { HeroBanner } from '@/components/HeroBanner';
import { CollaborateurSlider } from '@/components/CollaborateurSlider';
import { AvisSlider } from '@/components/AvisSlider';
import { FaCheck } from 'react-icons/fa';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const presentationRef = useRef(null);
  const isInView = useInView(presentationRef, { once: false, amount: 0.1 });
  const controls = useAnimation();
  const canvasRef = useRef(null);
  const threeSceneRef = useRef(null);
  const { theme, resolvedTheme } = useTheme();
  const isDarkMode = mounted ? (theme === 'dark' || resolvedTheme === 'dark') : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isInView || mounted) {
      controls.start('visible');
    }
  }, [isInView, controls, mounted]);

  useEffect(() => {
    // Si nous sommes dans le navigateur et que la référence canvas existe
    if (typeof window !== 'undefined' && canvasRef.current && mounted) {
      // Si une scène Three.js existe déjà, nettoyons-la avant d'en créer une nouvelle
      if (threeSceneRef.current) {
        threeSceneRef.current.cleanup();
        threeSceneRef.current = null;
      }
      
      const initPresentationScene = () => {
        // Création de la scène
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current,
          alpha: true,
          antialias: true 
        });
        
        // Assurez-vous que le renderer prend toute la taille de l'écran
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Centre de la scène - assurer qu'il est toujours à l'origine
        const sceneCenter = new THREE.Vector3(0, 0, 0);
        
        // Géométries et matériaux - effet de grille futuriste
        const gridSize = window.innerWidth < 768 ? 25 : 35; // Taille de grille adaptative
        const gridDivisions = window.innerWidth < 768 ? 25 : 35;
        const gridColor = isDarkMode ? 0x0284c7 : 0x3b82f6;
        const gridColorSecondary = isDarkMode ? 0x7dd3fc : 0x93c5fd;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColor, gridColorSecondary);
        gridHelper.position.copy(sceneCenter);
        scene.add(gridHelper);
        
        // Lignes lumineuses
        const linesGroup = new THREE.Group();
        linesGroup.position.copy(sceneCenter);
        scene.add(linesGroup);
        
        const createLine = (startPoint, endPoint, color) => {
          const points = [];
          points.push(new THREE.Vector3(...startPoint));
          points.push(new THREE.Vector3(...endPoint));
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
          
          return new THREE.Line(geometry, material);
        };
        
        // Créer quelques lignes
        for (let i = 0; i < 12; i++) {
          const isMobile = window.innerWidth < 768;
          const gridScale = isMobile ? 12 : 20;
          const x1 = (Math.random() - 0.5) * gridScale;
          const z1 = (Math.random() - 0.5) * gridScale;
          const x2 = (Math.random() - 0.5) * gridScale;
          const z2 = (Math.random() - 0.5) * gridScale;
          
          const lineColor = isDarkMode ? 0xec4899 : 0xdb2777;
          const line = createLine(
            [x1, 0, z1],
            [x2, 0, z2],
            new THREE.Color(lineColor)
          );
          
          linesGroup.add(line);
        }
        
        // Sphère centrale
        const sphereSize = window.innerWidth < 768 ? 1.4 : (window.innerWidth >= 1440 ? 2.0 : 1.7);
        const sphereGeometry = new THREE.SphereGeometry(sphereSize, 32, 32);
        const sphereColor = isDarkMode ? 0xec4899 : 0xdb2777;
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: sphereColor,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(sceneCenter);
        scene.add(sphere);
        
        // Particules
        const particlesGeometry = new THREE.BufferGeometry();
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isLargeScreen = window.innerWidth >= 1440;
        
        // Ajuster le nombre de particules et leur taille selon le device
        const particleCount = isMobile ? 180 : (isTablet ? 240 : (isLargeScreen ? 350 : 280));
        const particleSize = isMobile ? 0.06 : (isTablet ? 0.05 : (isLargeScreen ? 0.05 : 0.05));
        
        const positions = new Float32Array(particleCount * 3);
        
        // Créer un nuage de particules plus dense et distribué uniformément autour de la sphère
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const radius = isMobile ? (2.5 + Math.random() * 2) : (3.5 + Math.random() * 3);
          const theta = Math.random() * Math.PI * 2; // Angle horizontal
          const phi = Math.random() * Math.PI;       // Angle vertical
          
          // Coordonnées sphériques pour une meilleure distribution
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleColor = isDarkMode ? 0x7dd3fc : 0x3b82f6;
        const particlesMaterial = new THREE.PointsMaterial({
          size: particleSize,
          color: particleColor,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        particles.position.copy(sceneCenter);
        scene.add(particles);
        
        // Positionnement centralisé de la caméra
        const setCameraPosition = () => {
          const isMobile = window.innerWidth < 768;
          const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
          const isLargeScreen = window.innerWidth >= 1440;
          
          let cameraDistance;
          
          // Distances optimisées pour chaque taille d'écran
          if (isMobile) {
            cameraDistance = 8; // Mobile
          } else if (isTablet) {
            cameraDistance = 7.5; // Tablette
          } else if (isLargeScreen) {
            cameraDistance = 10; // Grand écran
          } else {
            cameraDistance = 9; // Écran standard
          }
          
          // Positionner la caméra légèrement décalée mais toujours centrée sur l'origine
          const x = cameraDistance * 0.8;
          const y = cameraDistance * 0.8;
          const z = cameraDistance * 0.8;
          
          camera.position.set(x, y, z);
          camera.lookAt(sceneCenter);
        };
        
        // Définir la position initiale de la caméra
        setCameraPosition();
        
        // Gestion du redimensionnement
        const handleResize = () => {
          if (!canvasRef.current) return;
          
          // Mettre à jour la taille du renderer pour qu'il prenne tout l'écran
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          
          // Mettre à jour l'aspect ratio de la caméra
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          
          // Repositionner la caméra pour le nouvel écran
          setCameraPosition();
          
          // Ajuster la taille de la sphère et des particules
          const newIsMobile = window.innerWidth < 768;
          const newIsLargeScreen = window.innerWidth >= 1440;
          
          // Mettre à jour la taille de la sphère
          sphere.geometry.dispose();
          const newSphereSize = newIsMobile ? 1.4 : (newIsLargeScreen ? 2.0 : 1.7);
          sphere.geometry = new THREE.SphereGeometry(newSphereSize, 32, 32);
          
          // Mettre à jour la taille des particules
          particlesMaterial.size = newIsMobile ? 0.06 : 0.05;
          
          // S'assurer que tout est bien centré
          sphere.position.copy(sceneCenter);
          particles.position.copy(sceneCenter);
          gridHelper.position.copy(sceneCenter);
          linesGroup.position.copy(sceneCenter);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Animation
        const clock = new THREE.Clock();
        
        const animate = () => {
          if (!canvasRef.current) return;
          
          const elapsedTime = clock.getElapsedTime();
          
          // Rotation des éléments
          gridHelper.rotation.y = elapsedTime * 0.05;
          linesGroup.rotation.y = -elapsedTime * 0.08;
          sphere.rotation.y = elapsedTime * 0.2;
          sphere.rotation.z = elapsedTime * 0.1;
          particles.rotation.y = -elapsedTime * 0.1;
          
          // Animer les lignes pour qu'elles pulsent
          linesGroup.children.forEach((line, i) => {
            line.material.opacity = 0.4 + Math.sin(elapsedTime + i) * 0.3;
          });
          
          // S'assurer que tout reste centré
          sphere.position.copy(sceneCenter);
          
          // Rendu
          renderer.render(scene, camera);
          
          requestAnimationFrame(animate);
        };
        
        animate();
        
        // Nettoyage
        threeSceneRef.current = {
          cleanup: () => {
            window.removeEventListener('resize', handleResize);
            scene.remove(gridHelper);
            scene.remove(sphere);
            scene.remove(particles);
            scene.remove(linesGroup);
            sphereGeometry.dispose();
            sphereMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            linesGroup.children.forEach(line => {
              line.geometry.dispose();
              line.material.dispose();
            });
            renderer.dispose();
          }
        };
      };
      
      initPresentationScene();
    }
    
    return () => {
      if (threeSceneRef.current) {
        threeSceneRef.current.cleanup();
      }
    };
  }, [mounted, theme]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  const textRevealVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: "100%", 
      transition: { 
        duration: 0.8, 
        ease: "easeInOut", 
        delay: 0.2 
      } 
    }
  };

  if (!mounted) return null;

  return (
    <main className="flex flex-col">
      <HeroBanner />

      {/* Animation ThreeJS fixe */}
      <div className="fixed inset-0 z-0 w-screen h-screen pointer-events-none">
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            display: 'block'
          }}
        />
      </div>

      {/* Section Présentation */}
      <section 
        ref={presentationRef} 
        className={`relative py-20 md:py-32 ${isDarkMode ? '' : 'bg-gray-50/70'} backdrop-blur-sm z-10`}
        id="presentation"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <motion.div 
              initial="hidden"
              animate={controls}
              className="lg:w-1/2"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
            >
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'} drop-shadow-md`}>
                Transformez vos <span className="text-primary-400">idées</span> en <span className="text-secondary-accent">réalité</span> numérique
              </h2>
              <motion.p 
                className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'} mb-6 text-lg font-medium drop-shadow-md backdrop-blur-sm ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/30'} p-4 rounded-lg`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }
                }}
              >
                Chez WEBIFY, nous vous accompagnons dans toutes les étapes de votre projet digital. 
                Notre approche combine expertise technique et créativité pour donner vie à des 
                expériences web uniques et performantes.
              </motion.p>
              
              <motion.div 
                className={`mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/50'} backdrop-blur-sm`}
                variants={containerVariants}
              >
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className={`flex-shrink-0 mr-3 w-10 h-10 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'} flex items-center justify-center shadow-md`}>
                    <FaCheck className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Design moderne</h3>
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Interfaces élégantes et intuitives pour une expérience utilisateur optimale.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className={`flex-shrink-0 mr-3 w-10 h-10 rounded-full ${isDarkMode ? 'bg-pink-600' : 'bg-pink-100'} flex items-center justify-center shadow-md`}>
                    <FaCheck className={`${isDarkMode ? 'text-pink-200' : 'text-pink-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance</h3>
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Solutions optimisées pour des temps de chargement rapides et une expérience fluide.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className={`flex-shrink-0 mr-3 w-10 h-10 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-100'} flex items-center justify-center shadow-md`}>
                    <FaCheck className={`${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Accessibilité</h3>
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Sites web accessibles à tous, conformes aux standards du web.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                >
                  <div className={`flex-shrink-0 mr-3 w-10 h-10 rounded-full ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-100'} flex items-center justify-center shadow-md`}>
                    <FaCheck className={`${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SEO</h3>
                    <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Optimisation pour les moteurs de recherche et visibilité maximale.</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg font-medium`}
                  >
                    Voir nos projets
                  </motion.button>
                </Link>
                
                <Link href="/contact">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-primary-600'} rounded-full shadow-lg font-medium`}
                  >
                    Contactez-nous
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } }
              }}
              className="lg:w-1/2 flex justify-center"
            >
              <div className="relative max-w-md w-full">
                <motion.div
                  className="absolute -inset-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-primary-500/20 blur-xl"
                  animate={{ 
                    opacity: [0.5, 0.8, 0.5], 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                ></motion.div>
                
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-gray-800 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Image
                    src="/images/hero-bg-2.jpg"
                    alt="Charles YIMBNE"
                    width={400}
                    height={500}
                    className="w-full h-auto rounded-xl object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h4 className="font-orbitron text-white text-2xl font-bold mb-2 drop-shadow-lg">Charles YIMBNE</h4>
                    <p className="text-blue-200 text-sm drop-shadow-lg">Fondateur & Développeur Full Stack</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Collaborateurs */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-b from-gray-950/90 to-gray-900/90' : 'bg-gradient-to-b from-gray-100/90 to-gray-200/90'} backdrop-blur-sm z-10`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`font-orbitron text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>NOS COLLABORATEURS</h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
              Une équipe de professionnels passionnés par la technologie et déterminés à créer des expériences web exceptionnelles.
            </p>
          </div>
          
          <CollaborateurSlider />
        </div>
      </section>

      {/* Section Statistiques */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900/90' : 'bg-gray-100/90'} backdrop-blur-sm z-10`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className={`p-8 rounded-xl shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-center">
                <motion.h3 
                  className="text-5xl font-bold text-primary-500 mb-2 font-orbitron"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.span
                    animate={{ 
                      color: ['#ec4899', '#7dd3fc', '#ec4899'],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    150+
                  </motion.span>
                </motion.h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Projets Complétés</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`p-8 rounded-xl shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-center">
                <motion.h3 
                  className="text-5xl font-bold text-blue-500 mb-2 font-orbitron"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <motion.span
                    animate={{ 
                      color: ['#0284c7', '#ec4899', '#0284c7'],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    50+
                  </motion.span>
                </motion.h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Clients Satisfaits</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`p-8 rounded-xl shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-center">
                <motion.h3 
                  className="text-5xl font-bold text-primary-500 mb-2 font-orbitron"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.span
                    animate={{ 
                      color: ['#ec4899', '#7dd3fc', '#ec4899'],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    12+
                  </motion.span>
                </motion.h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Prix et Récompenses</p>
              </div>
            </motion.div>
            
            <motion.div 
              className={`p-8 rounded-xl shadow-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="text-center">
                <motion.h3 
                  className="text-5xl font-bold text-blue-500 mb-2 font-orbitron"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.span
                    animate={{ 
                      color: ['#0284c7', '#ec4899', '#0284c7'],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    8+
                  </motion.span>
                </motion.h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Années d'Expérience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Avis Clients */}
      <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-b from-gray-900/90 to-gray-950/90' : 'bg-gradient-to-b from-gray-200/90 to-gray-300/90'} backdrop-blur-sm z-10`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`font-orbitron text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CE QUE DISENT NOS CLIENTS</h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-3xl mx-auto`}>
              Découvrez les retours d'expérience de nos clients satisfaits sur nos services et notre collaboration.
            </p>
          </div>
          
          <AvisSlider />
        </div>
      </section>

      {/* Section CTA */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-950/90' : 'bg-gray-200/90'} relative overflow-hidden backdrop-blur-sm z-10`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-primary-500/30 via-transparent to-blue-500/30 blur-3xl transform rotate-12 translate-y-[-50%]"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-r from-blue-500/30 via-transparent to-primary-500/30 blur-3xl transform -rotate-12 translate-y-[50%]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className={`font-orbitron text-4xl md:text-5xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              PRÊT À TRANSFORMER VOS IDÉES EN RÉALITÉ?
            </motion.h2>
            
            <motion.p 
              className={`text-xl mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} backdrop-blur-sm p-4 rounded-lg ${isDarkMode ? 'bg-gray-900/30' : 'bg-white/30'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Contactez-nous aujourd'hui pour discuter de votre projet et découvrir comment nous pouvons vous aider à atteindre vos objectifs.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/contact">
                <motion.button 
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 30px rgba(236, 72, 153, 0.7)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="font-orbitron bg-gradient-to-r from-primary-600 to-blue-600 text-white px-10 py-4 rounded-lg shadow-xl text-lg uppercase tracking-wide relative overflow-hidden group"
                >
                  <span className="relative z-10">Démarrer un projet</span>
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0, borderRadius: "100%" }}
                    whileHover={{ scale: 1.5, borderRadius: "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
