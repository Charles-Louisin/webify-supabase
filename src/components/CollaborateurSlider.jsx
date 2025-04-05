'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Données par défaut des collaborateurs
const defaultCollaborateurs = [
  {
    id: 1,
    name: "Charles YIMBNE",
    role: "Fondateur & Développeur Full Stack",
    avatar: "/images/hero-bg-1.jpg",
    bio: "Développeur passionné avec une solide expérience dans la création d'applications web modernes et performantes.",
    stats: [
      { label: "Projets", value: "150+" },
      { label: "Clients", value: "50+" },
      { label: "Awards", value: "12+" }
    ],
    technologies: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind"],
    likes: 128
  },
  {
    id: 2,
    name: "Sophie Martin",
    role: "UI/UX Designer",
    avatar: "/images/hero-bg-2.jpg",
    bio: "Designer créative spécialisée dans l'expérience utilisateur et la création d'interfaces élégantes et fonctionnelles.",
    stats: [
      { label: "Designs", value: "200+" },
      { label: "Projets", value: "45+" },
      { label: "Années", value: "6+" }
    ],
    technologies: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Web Design"],
    likes: 94
  },
  {
    id: 3,
    name: "Alexandre Dubois",
    role: "Backend Developer",
    avatar: "/images/hero-bg-3.jpg",
    bio: "Expert en développement backend avec une passion pour l'architecture de systèmes complexes et évolutifs.",
    stats: [
      { label: "APIs", value: "75+" },
      { label: "Services", value: "40+" },
      { label: "Années", value: "8+" }
    ],
    technologies: ["Node.js", "Python", "MongoDB", "PostgreSQL", "Docker"],
    likes: 102
  },
  {
    id: 4,
    name: "Emma Chen",
    role: "Mobile Developer",
    avatar: "/images/hero-bg-4.jpg",
    bio: "Développeuse mobile expérimentée créant des applications natives et cross-platform de haute qualité.",
    stats: [
      { label: "Apps", value: "30+" },
      { label: "Clients", value: "25+" },
      { label: "Années", value: "5+" }
    ],
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    likes: 87
  }
];

export function CollaborateurSlider({ collaborateurs = defaultCollaborateurs, isEditable = false, onEdit = () => {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);

  // Nombre de cartes à afficher en fonction de la largeur d'écran
  const [visibleCards, setVisibleCards] = useState(3);
  
  // Fonction pour détecter la taille de l'écran et configurer le slider
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // Tablette
      } else {
        setVisibleCards(3); // Desktop
      }
      
      // Mettre à jour les dimensions pour le glissement
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setSliderWidth(containerWidth);
        const newCardWidth = containerWidth / visibleCards;
        setCardWidth(newCardWidth);
        const newMaxDrag = -(newCardWidth * (collaborateurs.length - visibleCards));
        setMaxDrag(newMaxDrag);
      }
    };
    
    handleResize(); // Initialisation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collaborateurs.length, visibleCards]);
  
  // Mettre à jour la position du slider lors du défilement manuel
  useEffect(() => {
    const newX = -currentIndex * (sliderWidth / visibleCards);
    x.set(newX);
  }, [currentIndex, sliderWidth, visibleCards, x]);

  // Navigation dans le slider
  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, collaborateurs.length - visibleCards));
  };
  
  // Logique pour le glissement (dragging)
  const handleDragEnd = () => {
    const xPosition = x.get();
    const cardPosition = Math.round(xPosition / cardWidth);
    const newIndex = -cardPosition;
    
    if (newIndex < 0) {
      setCurrentIndex(0);
    } else if (newIndex > collaborateurs.length - visibleCards) {
      setCurrentIndex(collaborateurs.length - visibleCards);
    } else {
      setCurrentIndex(newIndex);
    }
    
    setIsDragging(false);
  };

  // Badge de vérification à côté du nom
  const renderVerifiedBadge = () => (
    <div className="w-5 h-5 relative ml-2">
      <Image
        src="/images/verify.svg"
        alt="Vérifié"
        fill
        className="object-contain"
      />
    </div>
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Boutons de navigation avec animation */}
      <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10 px-2">
        <motion.button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-2 rounded-full shadow-lg bg-white dark:bg-gray-800 ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Précédent"
        >
          <FiChevronLeft className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </motion.button>
        <motion.button
          onClick={goToNext}
          disabled={currentIndex >= collaborateurs.length - visibleCards}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-2 rounded-full shadow-lg bg-white dark:bg-gray-800 ${
            currentIndex >= collaborateurs.length - visibleCards ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          aria-label="Suivant"
        >
          <FiChevronRight className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </motion.button>
      </div>

      {/* Slider avec glissement fluide */}
      <div className="overflow-hidden">
        <motion.div
          ref={sliderRef}
          className="flex"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: maxDrag, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileTap={{ cursor: 'grabbing' }}
          transition={{ 
            type: "spring", 
            damping:.20, 
            stiffness: 100,
            mass: 0.5
          }}
        >
          {collaborateurs.map((collab, index) => (
            <motion.div
              key={collab.id}
              className={`flex-none w-full sm:w-1/2 lg:w-1/3 p-4`}
              style={{ touchAction: 'none', width: `${100 / visibleCards}%` }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                damping: 20, 
                stiffness: 100
              }}
            >
              <motion.div
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-gray-400 dark:bg-gray-900 rounded-xl dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 h-full relative"
              >
                {/* Bouton d'édition si éditable */}
                {isEditable && (
                  <motion.button
                    onClick={() => onEdit(collab)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
                    aria-label="Modifier"
                  >
                    <FiEdit2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                )}
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <motion.div 
                      className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary-400"
                      whileHover={{ scale: 1.05, borderColor: "#38bdf8" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Image
                        src={collab.avatar || "https://via.placeholder.com/64"}
                        alt={collab.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64";
                        }}
                      />
                    </motion.div>
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {collab.name}
                      </h3>
                      {renderVerifiedBadge()}
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-300 mb-6">
                    {collab.bio}
                  </p>
                  
                  {/* Stats du collaborateur avec animation */}
                  <div className="grid grid-cols-3 gap-2 mb-6 bg-white/70 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm">
                    {collab.stats && collab.stats.map((stat, idx) => (
                      <motion.div 
                        key={idx} 
                        className="text-center"
                        whileHover={{ y: -3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <span className="block text-2xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Technologies maîtrisées */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {collab.technologies && collab.technologies.map((tech, idx) => (
                        <motion.span 
                          key={idx} 
                          className="px-2 py-1 bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 rounded-full text-xs shadow-sm"
                          whileHover={{ scale: 1.1, backgroundColor: "#e0f2fe", color: "#0284c7" }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-300">
                      <motion.svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ scale: 1.2, color: "#ec4899" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </motion.svg>
                      <span>{collab.likes}</span>
                    </div>
                    <motion.button 
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition-colors"
                      whileHover={{ scale: 1.05, backgroundColor: "#0369a1" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      Message
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 