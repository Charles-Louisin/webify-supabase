'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { AndroidRobot } from '@/components/AndroidRobot';
import Link from 'next/link';

// Données factices pour les projets
const projects = [
  {
    id: 1,
    title: 'E-commerce Moderne',
    description: 'Plateforme de vente en ligne avec expérience utilisateur immersive et paiements sécurisés.',
    image: '/images/img1.jpg',
    technologies: ['Next.js', 'Supabase', 'Stripe', 'Tailwind'],
    category: 'e-commerce',
    link: '#'
  },
  {
    id: 2,
    title: 'Tableau de Bord Analytics',
    description: 'Interface d\'analyse de données avec graphiques interactifs et rapports personnalisables.',
    image: '/images/img2.jpg',
    technologies: ['React', 'D3.js', 'Firebase', 'Material UI'],
    category: 'dashboard',
    link: '#'
  },
  {
    id: 3,
    title: 'Application Mobile Fitness',
    description: 'App de suivi d\'entraînement avec animations fluides et synchronisation cloud.',
    image: '/images/img3.jpg',
    technologies: ['React Native', 'Redux', 'Node.js', 'MongoDB'],
    category: 'mobile',
    link: '#'
  },
  {
    id: 4,
    title: 'Site Vitrine Agence',
    description: 'Présentation élégante avec animations sur mesure et performances optimisées.',
    image: '/images/img4.jpg',
    technologies: ['Next.js', 'GSAP', 'Framer Motion', 'Tailwind'],
    category: 'vitrine',
    link: '#'
  },
  {
    id: 5,
    title: 'Plateforme Éducative',
    description: 'LMS complet avec suivi de progression et contenus interactifs.',
    image: '/images/img5.jpg',
    technologies: ['Vue.js', 'Express', 'PostgreSQL', 'Socket.io'],
    category: 'education',
    link: '#'
  },
  {
    id: 6,
    title: 'Réseau Social Créatif',
    description: 'Espace de partage pour artistes avec galeries personnalisables et messagerie intégrée.',
    image: '/images/hero-bg-3.jpg',
    technologies: ['React', 'GraphQL', 'AWS', 'Styled Components'],
    category: 'social',
    link: '#'
  }
];

// Catégories pour le filtrage
const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'e-commerce', label: 'E-commerce' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'vitrine', label: 'Site Vitrine' },
  { id: 'education', label: 'Éducation' },
  { id: 'social', label: 'Réseau Social' }
];

// Composant de carte de projet avec effet parallax
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  
  // Effet parallax
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <motion.div
        style={{ y, scale, opacity }}
        whileHover={{ scale: 1.03, y: -10 }}
        className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 glassmorphism h-full flex flex-col"
      >
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
          
          <Link href={project.link}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Voir le projet
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [isClient, setIsClient] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showRobot, setShowRobot] = useState(false);
  const [randomProjectIndex, setRandomProjectIndex] = useState(null);
  
  // Vérification côté client et initialisation
  useEffect(() => {
    setIsClient(true);
    
    // Afficher le robot après un délai
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * projects.length);
      setRandomProjectIndex(randomIndex);
      setShowRobot(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gestion du filtrage
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    
    if (categoryId === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === categoryId));
    }
    
    // Animation de transition douce gérée par Framer Motion et la propriété AnimatePresence
  };
  
  return (
    <MainLayout>
      {/* En-tête de page */}
      <section className="container mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Nos <span className="text-primary-600 dark:text-primary-400">Projets</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre portfolio de réalisations qui illustrent notre expertise et notre approche créative.
          </p>
        </motion.div>
        
        {/* Filtres */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
        
        {/* Grille de projets */}
        <div className="relative">
          {/* Robot qui dépose un projet */}
          <AnimatePresence>
            {showRobot && randomProjectIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-10 left-1/2 transform -translate-x-1/2 z-50"
              >
                <AndroidRobot
                  action="deliver"
                  size={200}
                  onComplete={() => setShowRobot(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      {/* Appel à l'action */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 shadow-xl text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Vous avez un projet en tête ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Notre équipe est prête à transformer votre vision en réalité digitale exceptionnelle.
          </p>
          <Link href="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-white text-primary-700 rounded-full hover:bg-gray-100 transition-colors font-medium"
            >
              Contactez-nous
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </MainLayout>
  );
} 