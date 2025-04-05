'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit2, FiSettings, FiActivity, FiBookmark, FiHeart, FiShare2, FiMessageSquare, FiMenu, FiCamera, FiPlus, FiShield } from 'react-icons/fi';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import { MainLayout } from '@/components/MainLayout';
import * as THREE from 'three';

// Composant de statistique avec animations améliorées
const StatCard = ({ icon, title, value, color, delay = 0 }) => (
  <motion.div 
    className="card p-4 flex items-center backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-white/10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
    whileTap={{ scale: 0.98 }}
  >
    <motion.div 
      className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      whileHover={{ rotate: 5, scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {icon}
    </motion.div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <motion.p 
        className="text-2xl font-bold text-gray-800 dark:text-gray-100"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      >
        {value}
      </motion.p>
    </div>
  </motion.div>
);

// Composant pour les tabs de navigation
const TabButton = ({ active, children, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${
      active 
        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
        : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
    }`}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.button>
);

// Animation 3D futuriste pour l'arrière-plan du profil
function ThreeDBackground({ className }) {
  const canvasRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({ 
        canvas, 
        alpha: true, 
        antialias: true 
      });
      
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      
      // Créer un groupe pour organiser nos éléments
      const group = new THREE.Group();
      scene.add(group);
      
      // Ajouter une grille 3D futuriste
      const gridHelper = new THREE.GridHelper(20, 20, 0x3a8df4, 0x0a1f3f);
      gridHelper.position.y = -5;
      group.add(gridHelper);
      
      // Ajouter quelques lignes de particules
      const addLine = (start, end, color) => {
        const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({ 
          color, 
          transparent: true, 
          opacity: 0.6 
        });
        
        return new THREE.Line(geometry, material);
      };
      
      // Ajouter des lignes au hasard
      for (let i = 0; i < 25; i++) {
        const x1 = (Math.random() - 0.5) * 20;
        const z1 = (Math.random() - 0.5) * 20;
        const x2 = (Math.random() - 0.5) * 20;
        const z2 = (Math.random() - 0.5) * 20;
        
        const line = addLine(
          [x1, -4.9, z1],
          [x2, -4.9, z2],
          new THREE.Color(0x3a8df4)
        );
        
        group.add(line);
      }
      
      camera.position.set(0, 4, 10);
      camera.lookAt(0, 0, 0);
      
      const handleResize = () => {
        if (!canvasRef.current) return;
        
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      
      window.addEventListener('resize', handleResize);
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (!canvasRef.current) return;
        
        group.rotation.y += 0.002;
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      return () => {
        window.removeEventListener('resize', handleResize);
        // Nettoyer les ressources Three.js
        renderer.dispose();
        gridHelper.geometry.dispose();
        gridHelper.material.dispose();
        scene.remove(group);
      };
    }
  }, [mounted]);
  
  if (!mounted) return null;
  
  return (
    <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full ${className}`} />
  );
}

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 1000], [0, 1]);
  const scaleAnim = useTransform(scrollProgress, [0, 1], [1, 0.9]);
  const opacityAnim = useTransform(scrollProgress, [0, 0.5], [1, 0]);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showNavbar, setShowNavbar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState({
    id: userId,
    name: 'Thomas Dusart',
    role: 'Développeur Web Senior',
    bio: 'Développeur full-stack passionné avec 8 ans d\'expérience dans la création d\'applications web modernes et réactives. Spécialisé en React, Node.js et architecture cloud.',
    avatar: '/images/img5.jpg',
    banner: '/images/img5.jpg',
    stats: {
      posts: 145,
      likes: 1324,
      comments: 89,
      shares: 32,
      saved: 18,
      followers: 512,
      following: 289
    }
  });
  
  useEffect(() => {
    setMounted(true);
    
    // Informer le MainLayout de l'état de la navbar
    const event = new CustomEvent('toggleNavbar', { detail: { show: showNavbar } });
    window.dispatchEvent(event);
  }, [showNavbar]);

  // Fonction pour basculer l'affichage de la navbar
  const toggleNavbar = () => {
    setShowNavbar(!showNavbar);
  };
  
  // Animation de l'apparition en séquence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Affichage du badge selon le rôle
  const RoleBadge = () => {
    if (userData.role === 'admin') {
      return (
        <motion.span 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        >
          Admin
        </motion.span>
      );
    } else if (userData.role === 'collaborateur') {
      return (
        <motion.span 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        >
          <Image 
            src="/images/webifyLogo1.png" 
            alt="Collaborateur" 
            width={12} 
            height={12} 
            className="inline mr-1"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/12";
            }}
          />
          Collaborateur
        </motion.span>
      );
    }
    return null;
  };

  if (!mounted) {
    return null;
  }

  const tabVariants = {
    inactive: { opacity: 0.6 },
    active: { opacity: 1 }
  };

  const underlineVariants = {
    inactive: { width: 0 },
    active: { width: '100%' }
  };

  return (
    <MainLayout showParticles={false} showFooter={false}>
      <div className="relative min-h-screen w-full pb-10">
        {/* Particules en arrière-plan */}
        <ParticlesBackground className="opacity-40" />
        
        {/* Bannière */}
        <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600/70 to-primary-600/70 w-full overflow-hidden">
          {userData.banner && (
            <Image
              src={userData.banner}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Bouton de modification de bannière */}
          {userId === '1' && (
            <motion.button
              className="absolute bottom-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiCamera className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        
        {/* Section profil */}
        <div className="container mx-auto px-4 relative -mt-16">
          <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0">
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&size=200&background=random`;
                    }}
                  />
                </div>
                
                {/* Bouton de modification d'avatar */}
                {userId === '1' && (
                  <motion.button
                    className="absolute bottom-1 right-1 p-1.5 bg-primary-500 rounded-full text-white hover:bg-primary-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCamera className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
              
              {/* Informations */}
              <div className="md:ml-6 flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {userData.role}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 space-x-2 flex">
                    {userId === '1' ? (
                      <>
                        <motion.button
                          className="btn-outline py-1.5 px-3 rounded-md text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('edit')}
                        >
                          <FiEdit2 className="mr-1.5 h-4 w-4 inline-block" />
                          <span>Éditer</span>
                        </motion.button>
                        
                        <Link href="/settings">
                          <motion.span
                            className="btn-outline py-1.5 px-3 rounded-md text-sm inline-flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiSettings className="mr-1.5 h-4 w-4" />
                            <span>Paramètres</span>
                          </motion.span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <motion.button
                          className="btn-primary py-1.5 px-3 rounded-md text-sm flex items-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FiPlus className="mr-1.5 h-4 w-4" />
                          <span>Suivre</span>
                        </motion.button>
                        
                        <Link href={`/messaging?user=${userId}`}>
                          <motion.span
                            className="btn-outline py-1.5 px-3 rounded-md text-sm inline-flex items-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FiMessageSquare className="mr-1.5 h-4 w-4" />
                            <span>Message</span>
                          </motion.span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {userData.bio}
                  </p>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white font-medium">{userData.stats.posts}</span> publications
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white font-medium">{userData.stats.followers}</span> abonnés
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white font-medium">{userData.stats.following}</span> abonnements
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white font-medium">{userData.stats.likes}</span> likes
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {userData.location && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span>📍 {userData.location}</span>
                    </div>
                  )}
                  
                  {userData.website && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span>🔗 <a href={`https://${userData.website}`} className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">{userData.website}</a></span>
                    </div>
                  )}
                  
                  {userData.joined && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span>📅 Membre depuis {userData.joined}</span>
                    </div>
                  )}
                  
                  {userId === '1' && (
                    <div className="text-gray-600 dark:text-gray-400 flex items-center">
                      <FiShield className="mr-1 h-4 w-4 text-green-500" />
                      <span>Compte vérifié</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Onglets */}
          <div className="bg-white dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg mb-8">
            <div className="flex overflow-x-auto scrollbar-none">
              {['posts', 'liked', 'saved', 'comments'].map((tab) => (
                <motion.button
                  key={tab}
                  className="px-4 py-4 flex-1 text-center relative"
                  variants={tabVariants}
                  initial="inactive"
                  animate={activeTab === tab ? "active" : "inactive"}
                  onClick={() => setActiveTab(tab)}
                >
                  <span className="capitalize font-medium">
                    {tab === 'posts' ? 'Publications' : 
                     tab === 'liked' ? 'Aimés' : 
                     tab === 'saved' ? 'Enregistrés' : 'Commentaires'}
                  </span>
                  {activeTab === tab && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                      variants={underlineVariants}
                      initial="inactive"
                      animate="active"
                      layoutId="underline"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Contenu des onglets */}
          <div className="mt-8 pb-12">
            <AnimatePresence mode="wait">
              {activeTab === 'posts' && (
                <motion.div 
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.4 } 
                  }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {[1, 2, 3, 4, 5, 6].map((post, index) => (
                    <motion.div 
                      key={post}
                      className="card overflow-hidden backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.1 * index } 
                      }}
                      whileHover={{ 
                        y: -10,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                      }}
                    >
                      <div className="relative h-48">
                        <Image 
                          src={`/images/img${(post % 5) + 1}.jpg`} 
                          alt={`Post ${post}`} 
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <span className="text-white text-sm font-medium">Il y a {post} jour{post > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Titre de la publication {post}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam egestas purus ut lectus faucibus, sit amet scelerisque sapien scelerisque.</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((person) => (
                                <div key={person} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden">
                                  <Image 
                                    src={`/images/img${(person % 5) + 1}.jpg`} 
                                    alt={`Person ${person}`} 
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{5 + post} interactions</span>
                          </div>
                          <Link href={`/posts/${post}`}>
                            <span className="text-primary-600 dark:text-primary-400 text-sm hover:underline">Voir</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {activeTab === 'liked' && (
                <motion.div
                  key="liked"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-20"
                >
                  <p className="text-gray-500 dark:text-gray-400">Les publications que vous avez aimées apparaîtront ici.</p>
                </motion.div>
              )}
              
              {activeTab === 'saved' && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-20"
                >
                  <p className="text-gray-500 dark:text-gray-400">Les publications que vous avez enregistrées apparaîtront ici.</p>
                </motion.div>
              )}
              
              {activeTab === 'comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-20"
                >
                  <p className="text-gray-500 dark:text-gray-400">Vos commentaires récents apparaîtront ici.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 