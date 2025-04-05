'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Données par défaut des avis
const defaultAvis = [
  {
    id: 1,
    name: "Jean Dupont",
    avatar: "/images/img1.jpg",
    rating: 5,
    comment: "Une expérience exceptionnelle ! L'application développée par WEBIFY a transformé notre activité et rencontré un vif succès auprès de nos clients.",
    date: "15 mars 2023"
  },
  {
    id: 2,
    name: "Marie Laurent",
    avatar: "/images/img2.jpg",
    rating: 5,
    comment: "Professionnalisme, réactivité et qualité technique au rendez-vous. Je recommande vivement les services de WEBIFY pour tous vos projets digitaux.",
    date: "22 février 2023"
  },
  {
    id: 3,
    name: "Thomas Bernard",
    avatar: "/images/img2.jpg",
    rating: 4,
    comment: "Excellent travail sur notre site e-commerce. L'équipe a su comprendre nos besoins et proposer des solutions innovantes adaptées à notre secteur.",
    date: "8 janvier 2023"
  },
  {
    id: 4,
    name: "Sarah Cohen",
    avatar: "/images/img2.jpg",
    rating: 5,
    comment: "La refonte de notre plateforme par WEBIFY a été un véritable succès. Performance, design moderne et expérience utilisateur optimale.",
    date: "4 décembre 2022"
  },
  {
    id: 5,
    name: "Paul Moreau",
    avatar: "/images/img2.jpg",
    rating: 5,
    comment: "Communication claire et résultats conformes à nos attentes. Notre application mobile a été livrée dans les délais avec une qualité irréprochable.",
    date: "17 novembre 2022"
  }
];

export function AvisSlider({ avis = defaultAvis }) {
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
        const newMaxDrag = -(newCardWidth * (avis.length - visibleCards));
        setMaxDrag(newMaxDrag);
      }
    };
    
    handleResize(); // Initialisation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [avis.length, visibleCards]);
  
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
    setCurrentIndex(prev => Math.min(prev + 1, avis.length - visibleCards));
  };
  
  // Logique pour le glissement (dragging)
  const handleDragEnd = () => {
    const xPosition = x.get();
    const cardPosition = Math.round(xPosition / cardWidth);
    const newIndex = -cardPosition;
    
    if (newIndex < 0) {
      setCurrentIndex(0);
    } else if (newIndex > avis.length - visibleCards) {
      setCurrentIndex(avis.length - visibleCards);
    } else {
      setCurrentIndex(newIndex);
    }
    
    setIsDragging(false);
  };

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
          disabled={currentIndex >= avis.length - visibleCards}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`p-2 rounded-full shadow-lg bg-white dark:bg-gray-800 ${
            currentIndex >= avis.length - visibleCards ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
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
            damping: 20, 
            stiffness: 100,
            mass: 0.5
          }}
        >
          {avis.map((avis, index) => (
            <motion.div
              key={avis.id}
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
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-gray-400 dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-md h-full"
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="relative w-12 h-12 rounded-full overflow-hidden mr-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src={avis.avatar || "https://via.placeholder.com/48"}
                      alt={avis.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/48";
                      }}
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {avis.name}
                    </h3>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg 
                          key={i} 
                          className={`w-4 h-4 ${i < avis.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          whileHover={{ scale: 1.2, rotate: i < avis.rating ? 15 : 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.p 
                  className="text-gray-800 dark:text-gray-300 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{avis.comment}"
                </motion.p>
                <p className="text-xs text-gray-100 dark:text-gray-500">
                  {avis.date}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 