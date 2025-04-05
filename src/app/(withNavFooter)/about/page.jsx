'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import Image from 'next/image';
import { TypedText } from '@/components/TypedText';
import { MainLayout } from '@/components/MainLayout';
import Link from 'next/link';

// Composant 3D pour les icônes orbitales
const TechOrbit = () => {
  const technologies = [
    { name: 'React', color: '#61DAFB', position: [2, 0, 0], speed: 1 },
    { name: 'Next.js', color: '#000000', position: [0, 2, 0], speed: 0.8 },
    { name: 'Supabase', color: '#3ECF8E', position: [-2, 0, 0], speed: 1.2 },
    { name: 'Tailwind', color: '#38B2AC', position: [0, -2, 0], speed: 0.9 },
    { name: 'Three.js', color: '#049EF4', position: [1.5, 1.5, 0], speed: 1.1 },
    { name: 'Framer Motion', color: '#FF4D4D', position: [-1.5, 1.5, 0], speed: 0.7 },
  ];

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ height: '100%', width: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Sphère centrale */}
      <Float rotationIntensity={0.2}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#0369a1" metalness={0.7} roughness={0.2} />
        </mesh>
      </Float>
      
      {/* Technologies en orbite */}
      {technologies.map((tech, index) => (
        <TechIcon 
          key={tech.name} 
          name={tech.name} 
          color={tech.color} 
          initialPosition={tech.position} 
          speed={tech.speed} 
          index={index} 
        />
      ))}
    </Canvas>
  );
};

// Icône de technologie orbitale
const TechIcon = ({ name, color, initialPosition, speed, index }) => {
  const meshRef = useRef();
  
  // Animation d'orbite
  useEffect(() => {
    const radius = Math.sqrt(
      initialPosition[0] * initialPosition[0] + 
      initialPosition[1] * initialPosition[1]
    );
    const initialAngle = Math.atan2(initialPosition[1], initialPosition[0]);
    
    const animate = () => {
      if (!meshRef.current) return;
      
      const time = Date.now() * 0.001 * speed;
      const angle = initialAngle + time;
      
      meshRef.current.position.x = radius * Math.cos(angle);
      meshRef.current.position.y = radius * Math.sin(angle);
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [initialPosition, speed]);
  
  return (
    <mesh ref={meshRef} position={initialPosition}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
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
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <MainLayout>
      {/* Section Introduction */}
      <section className="container mx-auto px-4 pt-16 mb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              À propos de <span className="text-primary-600 dark:text-primary-400">WEBIFY</span>
            </motion.h1>
            
            <div className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              <TypedText 
                text="Nous transformons vos idées en expériences numériques exceptionnelles."
                className="block mb-4"
                speed={0.04}
                delay={0.5}
              />
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.5 }}
                className="mb-4"
              >
                Fondée en 2022, notre mission est de créer des solutions web innovantes 
                qui combinent design futuriste et performance technique de pointe.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.8 }}
              >
                Notre équipe de passionnés met son expertise au service de vos projets 
                pour les propulser dans une nouvelle dimension.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.1 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  Nos projets
                </motion.button>
              </Link>
              
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
                >
                  Contactez-nous
                </motion.button>
              </Link>
              
              <motion.a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  z: 20,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full shadow-md hover:shadow-lg transition-all font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CV
              </motion.a>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 h-80">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl glassmorphism">
              <TechOrbit />
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Collaborateurs */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Notre <span className="text-primary-600 dark:text-primary-400">Équipe</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
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
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 glassmorphism"
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
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {collab.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400">
                      {collab.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                  {collab.bio}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {collab.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs"
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-primary-600 dark:text-primary-400">Valeurs</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
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
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md glassmorphism flex flex-col items-center text-center"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1, type: 'spring', stiffness: 100 }}
                className="mb-4 text-primary-600 dark:text-primary-400"
              >
                {value.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
} 