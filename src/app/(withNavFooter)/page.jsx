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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const presentationRef = useRef(null);
  const isInView = useInView(presentationRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  const canvasRef = useRef(null);
  const threeSceneRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    // Initialisation de la scène Three.js pour la section présentation
    if (canvasRef.current && !threeSceneRef.current && mounted) {
      const initPresentationScene = () => {
        // Création de la scène
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
          canvas: canvasRef.current,
          alpha: true,
          antialias: true 
        });
        
        renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Géométries et matériaux - effet de grille futuriste
        const gridSize = 20;
        const gridDivisions = 20;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x0284c7, 0x7dd3fc);
        scene.add(gridHelper);
        
        // Lignes lumineuses qui se déplacent
        const linesGroup = new THREE.Group();
        scene.add(linesGroup);
        
        const createLine = (startPoint, endPoint, color) => {
          const points = [];
          points.push(new THREE.Vector3(...startPoint));
          points.push(new THREE.Vector3(...endPoint));
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color });
          
          return new THREE.Line(geometry, material);
        };
        
        // Créer quelques lignes
        for (let i = 0; i < 15; i++) {
          const x1 = (Math.random() - 0.5) * gridSize;
          const z1 = (Math.random() - 0.5) * gridSize;
          const x2 = (Math.random() - 0.5) * gridSize;
          const z2 = (Math.random() - 0.5) * gridSize;
          
          const line = createLine(
            [x1, 0, z1],
            [x2, 0, z2],
            new THREE.Color(0xec4899)
          );
          
          linesGroup.add(line);
        }
        
        // Sphère centrale représentant une technologie
        const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xec4899,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        
        // Particules autour de la sphère
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 200;
        
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const radius = 2 + Math.random() * 2;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = radius * Math.cos(phi);
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.05,
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        
        // Positionnement de la caméra
        camera.position.x = 5;
        camera.position.y = 5;
        camera.position.z = 5;
        camera.lookAt(0, 0, 0);
        
        // Gestion du redimensionnement
        const handleResize = () => {
          if (!canvasRef.current) return;
          
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Animation
        const clock = new THREE.Clock();
        
        const animate = () => {
          if (!canvasRef.current) return;
          
          const elapsedTime = clock.getElapsedTime();
          
          // Rotation de la scène
          gridHelper.rotation.y = elapsedTime * 0.05;
          linesGroup.rotation.y = -elapsedTime * 0.08;
          
          // Animation de la sphère
          sphere.rotation.y = elapsedTime * 0.2;
          sphere.rotation.z = elapsedTime * 0.1;
          
          // Animation des particules
          particles.rotation.y = -elapsedTime * 0.1;
          
          // Animer les lignes pour qu'elles pulsent
          linesGroup.children.forEach((line, i) => {
            line.material.opacity = 0.4 + Math.sin(elapsedTime + i) * 0.3;
          });
          
          // Rendu
          renderer.render(scene, camera);
          
          requestAnimationFrame(animate);
        };
        
        animate();
        
        // Nettoyage lors du démontage
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
  }, [mounted]);

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

      {/* Section Présentation */}
      <section ref={presentationRef} className="relative py-20 md:py-32 overflow-visible">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={controls}
              className="lg:w-1/2"
              variants={{
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Transformez vos <span className="text-primary-400">idées</span> en <span className="text-secondary-accent">réalité</span> numérique
              </h2>
              <motion.p 
                className="text-gray-200 mb-6 text-lg"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }
                }}
              >
                Chez WEBIFY, nous vous accompagnons dans toutes les étapes de votre projet digital. 
                Notre approche combine expertise technique et créativité pour donner vie à des 
                expériences web uniques et performantes.
              </motion.p>
              
              <motion.ul 
                className="space-y-3 mb-8"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
                }}
              >
                {['Design UI/UX sur mesure', 'Développement full-stack', 'Applications web & mobiles', 'Optimisation des performances'].map((item, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-center text-gray-200"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <FaCheck className="text-primary-400 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.div variants={itemVariants}>
                <Link href="/about">
                  <motion.button 
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 0 15px rgba(236, 72, 153, 0.6)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="font-orbitron bg-gradient-to-r from-blue-600 to-primary-600 text-white px-8 py-3 rounded-lg shadow-lg transform hover:translate-y-[2px] transition-all duration-300 text-lg relative group overflow-hidden"
                  >
                    <span className="relative z-10">Découvrir Plus</span>
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ type: "spring", stiffness: 60 }}
                    />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
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
                    width={500}
                    height={500}
                    className="w-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h4 className="font-orbitron text-white text-2xl font-bold mb-2">Charles YIMBNE</h4>
                    <p className="text-blue-200 text-sm">Fondateur & Développeur Full Stack</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Collaborateurs */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-white">NOS COLLABORATEURS</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Une équipe de professionnels passionnés par la technologie et déterminés à créer des expériences web exceptionnelles.
            </p>
          </div>
          
          <CollaborateurSlider />
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 shadow-xl"
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
                <p className="text-gray-300 text-lg">Projets Complétés</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 shadow-xl"
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
                <p className="text-gray-300 text-lg">Clients Satisfaits</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 shadow-xl"
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
                <p className="text-gray-300 text-lg">Prix et Récompenses</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 shadow-xl"
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
                <p className="text-gray-300 text-lg">Années d'Expérience</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Avis Clients */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-6 text-white">CE QUE DISENT NOS CLIENTS</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Découvrez les retours d'expérience de nos clients satisfaits sur nos services et notre collaboration.
            </p>
          </div>
          
          <AvisSlider />
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-primary-500/30 via-transparent to-blue-500/30 blur-3xl transform rotate-12 translate-y-[-50%]"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-r from-blue-500/30 via-transparent to-primary-500/30 blur-3xl transform -rotate-12 translate-y-[50%]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="font-orbitron text-4xl md:text-5xl font-bold mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              PRÊT À TRANSFORMER VOS IDÉES EN RÉALITÉ?
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-10"
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
