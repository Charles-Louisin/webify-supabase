'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AndroidRobot } from '@/components/AndroidRobot';
import { TypedText } from '@/components/TypedText';
import { MainLayout } from '@/components/MainLayout';

// Données factices pour les collaborateurs
const collaborateurs = [
  {
    id: 1,
    name: 'Sophie Martin',
    role: 'Développeuse Frontend',
    avatar: '/images/img1.jpg',
    bio: 'Spécialisée en React et animations web modernes',
    likes: 42
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    role: 'Designer UI/UX',
    avatar: '/images/img2.jpg',
    bio: 'Passionné par le design minimaliste et futuriste',
    likes: 38
  },
  {
    id: 3,
    name: 'Léa Bernard',
    role: 'Développeuse Backend',
    avatar: '/images/img3.jpg',
    bio: 'Experte en architectures cloud et API performantes',
    likes: 35
  }
];

// Données factices pour les avis
const avis = [
  {
    id: 1,
    name: 'Jean Dupont',
    comment: 'Une expérience de collaboration exceptionnelle !',
    rating: 5,
    date: '15/04/2023',
    avatar: '/images/img4.jpg'
  },
  {
    id: 2,
    name: 'Marie Leroy',
    comment: 'Travail professionnel et de grande qualité.',
    rating: 4,
    date: '22/03/2023',
    avatar: '/images/img5.jpg'
  },
  {
    id: 3,
    name: 'Antoine Moreau',
    comment: 'Je recommande vivement cette équipe pour vos projets web !',
    rating: 5,
    date: '10/05/2023',
    avatar: '/images/hero-bg-3.jpg'
  }
];

export default function Home() {
  const [showRobot, setShowRobot] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Vérification côté client
  useEffect(() => {
    setIsClient(true);
    // Afficher le robot après un délai
    const timer = setTimeout(() => {
      setShowRobot(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Fonction pour gérer le like des collaborateurs (simulation)
  const handleLike = (id) => {
    // Dans une version réelle, cela ferait un appel API pour mettre à jour le like
    alert('Vous devez vous connecter pour liker un collaborateur');
  };

  return (
    <MainLayout>
      {/* Section Hero */}
      <section className="container mx-auto px-4 mb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Salut, moi c'est <span className="text-primary-600 dark:text-primary-400">Charles YIMBNE</span>,
              <br />
              <TypedText 
                text="développeur web full stack passionné"
                className="text-primary-600 dark:text-primary-400"
                speed={0.04}
                delay={1}
              />
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg text-gray-700 dark:text-gray-300 mb-8"
            >
              Je construis des applications web modernes, interactives et performantes qui transforment vos idées en réalités numériques.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
              >
                Voir mes projets
              </motion.button>
            </motion.div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Placeholder d'image - à remplacer par votre photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.3,
                  type: 'spring',
                  stiffness: 100
                }}
                className="w-full h-full bg-gradient-to-tr from-primary-400 to-primary-600 rounded-full overflow-hidden shadow-2xl"
              >
                <div className="w-full h-full relative">
                  {isClient && (
                    <Image
                      src="/images/hero-bg-4.jpg" // À remplacer par votre photo
                      alt="Charles - développeur full stack"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
              </motion.div>
              
              {/* Effet de halo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute -inset-4 bg-primary-400/20 dark:bg-primary-400/10 rounded-full blur-lg"
                style={{ zIndex: -1 }}
              />
              
              {/* Robot Android qui vient saluer */}
              <AnimatePresence>
                {showRobot && (
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -bottom-20 -left-20 z-10"
                  >
                    <AndroidRobot 
                      action="greet" 
                      size={150}
                      onComplete={() => setShowRobot(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Collaborateurs */}
      <section className="container mx-auto px-4 py-16 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nos <span className="text-primary-600 dark:text-primary-400">Collaborateurs</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre équipe de talents qui rendent possibles vos projets digitaux.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collaborateurs.map((collab, index) => (
            <motion.div
              key={collab.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 glassmorphism"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-primary-400">
                    {isClient && (
                      <Image
                        src={collab.avatar}
                        alt={collab.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {collab.name}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400">
                      {collab.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {collab.bio}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLike(collab.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{collab.likes}</span>
                  </button>
                  <button 
                    onClick={() => alert('Vous devez vous connecter pour envoyer un message')}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    Message
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Section Avis */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ce que disent <span className="text-primary-600 dark:text-primary-400">nos clients</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            La satisfaction de nos clients est notre priorité absolue.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {avis.map((avis, index) => (
            <motion.div
              key={avis.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md glassmorphism"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  {isClient && (
                    <Image
                      src={avis.avatar}
                      alt={avis.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {avis.name}
                  </h3>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < avis.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                "{avis.comment}"
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {avis.date}
              </p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Vous devez vous connecter pour laisser un avis')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium"
          >
            Laisser un avis
          </motion.button>
        </div>
      </section>
    </MainLayout>
  );
}
