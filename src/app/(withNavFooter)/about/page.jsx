'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, useTexture, Html } from '@react-three/drei';
import Image from 'next/image';
import { TypedText } from '@/components/TypedText';
import Link from 'next/link';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaDocker, FaGitAlt } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiFirebase, SiSupabase, SiAdobexd } from 'react-icons/si';

// Logo Webify au centre
const WebifyLogo = ({ isDarkMode }) => {
  return (
    <Float rotationIntensity={0.2}>
      <Html position={[0, 0, 0]} transform scale={0.6} center>
        <div className="flex items-center justify-center w-48 h-48">
          <Image
            src="/images/webifyLogo1.png"
            alt="Webify Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
      </Html>
    </Float>
  );
};

// Composant 3D pour les icônes orbitales
const TechOrbit = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const technologies = [
    { name: 'React', Icon: FaReact, color: '#61DAFB', position: [2.5, 0, 0], speed: 1 },
    { name: 'Next.js', Icon: SiNextdotjs, color: isDarkMode ? '#FFFFFF' : '#000000', position: [0, 2.5, 0], speed: 0.8 },
    { name: 'Supabase', Icon: SiSupabase, color: '#3ECF8E', position: [-2.5, 0, 0], speed: 1.2 },
    { name: 'Tailwind', Icon: SiTailwindcss, color: '#38B2AC', position: [0, -2.5, 0], speed: 0.9 },
    { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E', position: [1.8, 1.8, 0], speed: 1.1 },
    { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6', position: [-1.8, 1.8, 0], speed: 0.7 },
    { name: 'MongoDB', Icon: SiMongodb, color: '#47A248', position: [-1.8, -1.8, 0], speed: 1.3 },
    { name: 'Firebase', Icon: SiFirebase, color: '#FFCA28', position: [1.8, -1.8, 0], speed: 0.6 },
  ];

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ height: '100%', width: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Logo WebifyLogo1 central */}
      <WebifyLogo isDarkMode={isDarkMode} />
      
      {/* Technologies en orbite */}
      {technologies.map((tech, index) => (
        <TechIcon 
          key={tech.name} 
          tech={tech}
          isDarkMode={isDarkMode}
          index={index} 
        />
      ))}
    </Canvas>
  );
};

// Icône de technologie orbitale
const TechIcon = ({ tech, isDarkMode, index }) => {
  const { name, Icon, color, position, speed } = tech;
  const meshRef = useRef();
  
  // Animation d'orbite
  useEffect(() => {
    const radius = Math.sqrt(
      position[0] * position[0] + 
      position[1] * position[1]
    );
    const initialAngle = Math.atan2(position[1], position[0]);
    
    const animate = () => {
      if (!meshRef.current) return;
      
      const time = Date.now() * 0.001 * speed;
      const angle = initialAngle + time;
      
      meshRef.current.position.x = radius * Math.cos(angle);
      meshRef.current.position.y = radius * Math.sin(angle);
      
      // Faire tourner l'icône pour qu'elle regarde toujours l'observateur
      meshRef.current.rotation.z = -angle + Math.PI / 2;
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [position, speed]);
  
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html transform scale={0.2} rotation={[0, 0, 0]} center>
        <div 
          className="flex items-center justify-center w-40 h-40 rounded-full p-6" 
          style={{ 
            backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            boxShadow: `0 0 20px 2px ${color}40`,
            border: `2px solid ${color}80`
          }}
        >
          <Icon size={72} color={color} />
        </div>
      </Html>
    </mesh>
  );
};

// Composant pour les icônes flottantes des technologies
const FloatingIcons = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const icons = [
    { Icon: FaReact, color: "#61DAFB", size: 40, delay: 0 },
    { Icon: SiNextdotjs, color: isDarkMode ? "#FFFFFF" : "#000000", size: 38, delay: 0.1 },
    { Icon: SiJavascript, color: "#F7DF1E", size: 34, delay: 0.2 },
    { Icon: SiTypescript, color: "#3178C6", size: 34, delay: 0.3 },
    { Icon: FaNodeJs, color: "#339933", size: 42, delay: 0.4 },
    { Icon: SiTailwindcss, color: "#06B6D4", size: 36, delay: 0.5 },
    { Icon: FaHtml5, color: "#E34F26", size: 32, delay: 0.6 },
    { Icon: FaCss3Alt, color: "#1572B6", size: 32, delay: 0.7 },
    { Icon: SiMongodb, color: "#47A248", size: 30, delay: 0.8 },
    { Icon: SiFirebase, color: "#FFCA28", size: 32, delay: 0.9 },
    { Icon: SiSupabase, color: "#3ECF8E", size: 30, delay: 1.0 },
    { Icon: FaDocker, color: "#2496ED", size: 38, delay: 1.1 },
    { Icon: FaGitAlt, color: "#F05032", size: 34, delay: 1.2 },
  ];

  return (
    <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {icons.map((item, index) => {
        const { Icon, color, size, delay } = item;
        // Position aléatoire pour chaque icône
        const topPos = `${Math.random() * 80 + 10}%`;
        const leftPos = `${Math.random() * 80 + 10}%`;
        const duration = 3 + Math.random() * 5; // Durée d'animation aléatoire

        return (
          <motion.div
            key={index}
            className="absolute"
            initial={{ opacity: 0, scale: 0, top: topPos, left: leftPos }}
            animate={{ 
              opacity: 0.8, 
              scale: 1,
              top: [`${parseInt(topPos) - 5}%`, `${parseInt(topPos) + 5}%`, `${parseInt(topPos) - 5}%`],
              left: [`${parseInt(leftPos) - 5}%`, `${parseInt(leftPos) + 5}%`, `${parseInt(leftPos) - 5}%`]
            }}
            transition={{
              opacity: { duration: 0.5, delay },
              scale: { duration: 0.5, delay },
              top: { duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay },
              left: { duration: duration * 1.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }
            }}
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          >
            <Icon size={size} color={color} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Données factices pour les collaborateurs
const collaborateurs =  [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Développeuse Frontend',
    avatar: '/images/img1.jpg',
    bio: 'Spécialisée en React et animations web modernes',
    skills: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS']
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    role: 'Designer UI/UX',
    avatar: '/images/img2.jpg',
    bio: 'Passionné par le design minimaliste et futuriste',
    skills: ['Figma', 'Adobe XD', 'Design System', 'Prototypage']
  },
  {
    id: 3,
    name: 'Léa Bernard',
    role: 'Développeuse Backend',
    avatar: '/images/img3.jpg',
    bio: 'Experte en architectures cloud et API performantes',
    skills: ['Node.js', 'PostgreSQL', 'Supabase', 'AWS']
  }
];

export default function About() {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const threeSceneRef = useRef(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    setIsClient(true);
    setMounted(true);
  }, []);
  
  // Initialisation de la scène Three.js
  useEffect(() => {
    // Initialisation de la scène Three.js
    if (canvasRef.current && !threeSceneRef.current && mounted) {
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
        
        // Particules de fond
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = window.innerWidth < 768 ? 1200 : 2000;
        
        const posArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 20;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        // Couleur des particules selon le thème
        const isDarkMode = theme === 'dark';
        const particleColor = isDarkMode ? 0x7dd3fc : 0x0369a1;
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: window.innerWidth < 768 ? 0.03 : 0.02,
          color: particleColor,
          transparent: true,
          opacity: isDarkMode ? 0.4 : 0.2,
          blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);
        
        // Positionnement de la caméra
        camera.position.z = 5;
        
        // Gestion du redimensionnement
        const handleResize = () => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          
          // Ajuster les propriétés des particules pour les mobiles
          const isMobile = window.innerWidth < 768;
          particlesMaterial.size = isMobile ? 0.03 : 0.02;
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initialiser avec la bonne taille
        
        // Animation
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (event) => {
          mouseX = (event.clientX / window.innerWidth) * 2 - 1;
          mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        const animate = () => {
          requestAnimationFrame(animate);
          
          particlesMesh.rotation.y += 0.001;
          particlesMesh.rotation.x += 0.0005;
          
          // Interaction avec la souris
          particlesMesh.rotation.y += mouseX * 0.0001;
          particlesMesh.rotation.x += mouseY * 0.0001;
          
          renderer.render(scene, camera);
        };
        
        animate();
        
        // Nettoyage lors du démontage
        threeSceneRef.current = {
          cleanup: () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousemove', handleResize);
            scene.remove(particlesMesh);
            particlesGeometry.dispose();
            particlesMaterial.dispose();
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
  }, [mounted, theme]);

  const isDarkMode = theme === 'dark';
  
  if (!mounted) return null;
  
  return (
    <main className="min-h-screen py-24 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div
            className="relative inline-block mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="relative text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2 font-orbitron px-4 py-2 border-b-2 border-primary-500 dark:border-primary-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              À PROPOS DE WEBIFY
            </motion.h1>
          </motion.div>
          
          <motion.div
            className="relative max-w-3xl mx-auto mb-10 backdrop-blur-sm rounded-xl p-6 shadow-xl"
            style={{
              background: `${isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.6)'}`,
              border: `1px solid ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(219, 39, 119, 0.2)'}`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.p 
              className="text-lg md:text-xl text-gray-700 dark:text-gray-200 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Découvrez notre histoire, notre mission et notre passion pour la création d'expériences web exceptionnelles.
            </motion.p>
          </motion.div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 mb-24">
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl blur-md"></div>
            <div className={`relative h-full p-8 rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm shadow-xl border border-primary-500/20`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-primary-400"></div>
              
              <h2 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-8 font-orbitron text-center md:text-left">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block"
                >
                  Notre Vision
                </motion.span>
              </h2>
              
              <div className="space-y-6 px-2">
                <motion.p 
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Chez <span className="font-semibold text-primary-600 dark:text-primary-400">WEBIFY</span>, 
                  nous croyons en la puissance du web comme vecteur de transformation et d'innovation pour les entreprises 
                  et organisations de toutes tailles.
                </motion.p>
                
                <motion.p 
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Notre ambition est de créer des expériences web qui transcendent les standards habituels, 
                  combinant design futuriste, fonctionnalités innovantes et performances optimales.
                </motion.p>
                
                <motion.p 
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Nous nous engageons à rester à la pointe des technologies web émergentes, 
                  tout en gardant une approche centrée sur l'humain et les besoins réels de nos clients.
                </motion.p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl blur-md"></div>
            <div className={`relative h-full p-8 rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm shadow-xl border border-blue-500/20`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              
              <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 font-orbitron text-center md:text-left">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-block"
                >
                  Notre Histoire
                </motion.span>
              </h2>
              
              <div className="space-y-6 px-2">
                <motion.p 
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Fondée en 2022 par <span className="font-semibold text-blue-600 dark:text-blue-400">Charles YIMBNE</span>, développeur passionné et entrepreneur visionnaire, 
                  WEBIFY est née de la volonté de créer une agence web différente, où la créativité et 
                  l'innovation technique se rencontrent pour donner vie à des projets exceptionnels.
                </motion.p>
                
                <motion.p 
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Au fil des années, nous avons constitué une équipe de professionnels talentueux et 
                  passionnés, partageant tous la même vision : repousser les limites du possible dans le 
                  développement web.
                </motion.p>
                
                <motion.p 
                  className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Aujourd'hui, nous sommes fiers de collaborer avec des clients variés, des startups 
                  aux grandes entreprises, pour les accompagner dans leur transformation numérique et 
                  leur croissance.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Canvas Three.js pour l'arrière-plan */}
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 w-full h-screen z-0"
        />
        
        {/* Icônes flottantes */}
        <FloatingIcons />
        
        <div className={`relative z-10 ${isDarkMode ? 'bg-gray-950/0' : 'bg-gray-50/0'} min-h-screen`}>
          {/* Section TechOrbit */}
          <div className="w-full h-96 md:h-[500px] mb-16">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl glassmorphism">
              <TechOrbit />
            </div>
          </div>
          
          {/* Section Collaborateurs */}
          <section className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Notre <span className="text-primary-600 dark:text-primary-400">Équipe</span>
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
                Des experts passionnés et créatifs qui donnent vie à vos projets.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collaborateurs.map((collab, index) => (
                <motion.div
                  key={collab.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg transition-all duration-300 glassmorphism`}
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary-400">
                        {isClient && (
                          <Image
                            src={collab.avatar}
                            alt={collab.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {collab.name}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400">
                          {collab.role}
                        </p>
                      </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 text-center`}>
                      {collab.bio}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {collab.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className={`px-3 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-full text-xs`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          
          {/* Section Valeurs */}
          <section className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Nos <span className="text-primary-600 dark:text-primary-400">Valeurs</span>
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} max-w-2xl mx-auto`}>
                Les principes qui guident chacune de nos actions et décisions.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  description: "Nous repoussons constamment les limites du possible pour créer des expériences uniques.",
                  icon: (
                    <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Excellence",
                  description: "La qualité est au cœur de notre démarche, chaque détail compte pour un résultat exceptionnel.",
                  icon: (
                    <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Collaboration",
                  description: "Nous croyons en la puissance du travail d'équipe et de la communication transparente.",
                  icon: (
                    <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md glassmorphism flex flex-col items-center text-center`}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1, type: 'spring', stiffness: 100 }}
                    className="mb-4 text-primary-600 dark:text-primary-400"
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    {value.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 