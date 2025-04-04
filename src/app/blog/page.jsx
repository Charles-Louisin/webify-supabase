'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import Image from 'next/image';
import Link from 'next/link';

// Données factices pour les articles de blog
const blogPosts = [
  {
    id: 1,
    title: "Comment créer une application Next.js avec Supabase",
    excerpt: "Un guide étape par étape pour construire une application web moderne avec Next.js et Supabase comme backend.",
    image: "/images/img5.jpg",
    category: "Tutoriel",
    date: "2023-05-15",
    author: {
      name: "Alex Martin",
      avatar: "/images/img1.jpg"
    },
    readTime: "8 min"
  },
  {
    id: 2,
    title: "Les tendances du développement web en 2023",
    excerpt: "Découvrez les technologies et méthodologies qui façonnent l'avenir du développement web cette année.",
    image: "/images/img5.jpg",
    category: "Tendances",
    date: "2023-04-22",
    author: {
      name: "Sophie Dubois",
      avatar: "/images/img2.jpg"
    },
    readTime: "6 min"
  },
  {
    id: 3,
    title: "Optimisation des performances avec React",
    excerpt: "Techniques avancées pour améliorer les performances de vos applications React et offrir une meilleure expérience utilisateur.",
    image: "/images/img5.jpg",
    category: "Performance",
    date: "2023-03-18",
    author: {
      name: "Thomas Werner",
      avatar: "/images/img3.jpg"
    },
    readTime: "11 min"
  },
  {
    id: 4,
    title: "L'importance de l'UI/UX dans le développement moderne",
    excerpt: "Comment une bonne conception UI/UX peut transformer votre produit et augmenter l'engagement des utilisateurs.",
    image: "/images/img5.jpg",
    category: "Design",
    date: "2023-02-09",
    author: {
      name: "Emma Chen",
      avatar: "/images/img4.jpg"
    },
    readTime: "5 min"
  },
  {
    id: 5,
    title: "Introduction à l'animation avec Framer Motion",
    excerpt: "Un guide complet pour ajouter des animations fluides à vos projets React avec la bibliothèque Framer Motion.",
    image: "/images/img5.jpg",
    category: "Animation",
    date: "2023-01-30",
    author: {
      name: "Alex Martin",
      avatar: "/images/img1.jpg"
    },
    readTime: "9 min"
  },
  {
    id: 6,
    title: "Accessibilité web : bonnes pratiques et outils",
    excerpt: "Comment rendre vos applications web accessibles à tous les utilisateurs, quelle que soit leur situation.",
    image: "/images/img5.jpg",
    category: "Accessibilité",
    date: "2022-12-15",
    author: {
      name: "Sophie Dubois",
      avatar: "/images/img2.jpg"
    },
    readTime: "7 min"
  },
];

// Liste des catégories uniques
const categories = [...new Set(blogPosts.map(post => post.category))];

// Composant de carte d'article
const BlogCard = ({ post, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.2 }
      }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/blog/${post.id}`}>
        <div className="relative h-48 overflow-hidden">
          {post.image ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="w-full h-full relative">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  fill
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600" />
          )}
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-3">
              {post.author.avatar && (
                <Image 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="text-sm">
              <p className="text-gray-900 dark:text-gray-200 font-medium">{post.author.name}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">{post.date} · {post.readTime}</p>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{post.excerpt}</p>
          
          <div className="flex justify-end">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium inline-flex items-center">
              Lire plus
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Composant principal de la page Blog
export default function Blog() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const searchInputRef = useRef(null);

  // Effet pour le rendu côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effet pour la recherche et le filtrage
  useEffect(() => {
    if (mounted) {
      const filtered = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
      setFilteredPosts(filtered);
    }
  }, [searchTerm, selectedCategory, mounted]);

  // Animation pour le texte du titre
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Effet de lumière qui suit le curseur sur l'en-tête
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);

  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const header = headerRef.current;
    if (header) {
      header.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (header) {
        header.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  // Fonction pour faire flotter le curseur dans l'input de recherche
  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Gestion du changement de catégorie
  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* En-tête avec effet de lumière */}
        <div 
          ref={headerRef}
          className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <div 
            className="pointer-events-none absolute" 
            style={{
              top: mousePosition.y - 150,
              left: mousePosition.x - 150,
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          />
          
          <div className="container mx-auto relative z-10">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-center text-white mb-6"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              {Array.from("Notre Blog").map((letter, index) => (
                <motion.span key={index} variants={letterVariants} className="inline-block">
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="text-xl text-center text-blue-200 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Découvrez nos dernières réflexions, tutoriels et actualités sur le développement web et les technologies modernes.
            </motion.p>
            
            <motion.div 
              className="max-w-md mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all"
              />
              <button
                onClick={focusSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </motion.div>
            
            {/* Filtres par catégorie */}
            <motion.div 
              className="flex flex-wrap justify-center gap-2 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === '' 
                    ? 'bg-white text-purple-900' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Tous
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category 
                      ? 'bg-white text-purple-900' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
          
          {/* Formes décoratives */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -right-32 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 left-1/4 w-72 h-72 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        {/* Grille d'articles */}
        <div className="container mx-auto px-4 py-16">
          <AnimatePresence>
            {filteredPosts.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Aucun article trouvé</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Essayez de modifier vos critères de recherche ou de sélectionner une autre catégorie.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Section newsletter */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Restez informé de nos dernières publications
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Inscrivez-vous à notre newsletter pour recevoir nos derniers articles, tutoriels et mises à jour directement dans votre boîte de réception.
                  </p>
                  <div className="flex flex-col sm:flex-row">
                    <input 
                      type="email" 
                      placeholder="Votre adresse email" 
                      className="flex-grow px-4 py-3 rounded-l-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-r-md transition-colors">
                      S'abonner
                    </button>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-3">
                    Nous respectons votre vie privée. Désabonnez-vous à tout moment.
                  </p>
                </div>
                <div className="md:w-1/3">
                  <div className="relative w-64 h-64 mx-auto">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-blue-100 dark:text-blue-900/30 fill-current">
                      <path d="M47.5,-57.2C59.6,-45.8,66.4,-29.4,69.8,-12.2C73.2,5,73.1,23.1,64.7,35.2C56.3,47.4,39.6,53.7,23.5,59.5C7.3,65.2,-8.3,70.4,-23.9,67.5C-39.5,64.5,-55.1,53.5,-64.1,38.3C-73.1,23.2,-75.5,3.9,-71.3,-13.7C-67.1,-31.3,-56.3,-47.2,-42.2,-58.4C-28.1,-69.6,-10.7,-76.1,3.9,-80.5C18.5,-85,37,-68.5,47.5,-57.2Z" transform="translate(100 100)" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 