'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiUsers, FiActivity, FiBarChart2, FiCalendar, 
  FiTrendingUp, FiGrid, FiList, FiFilter, FiDownload,
  FiEye, FiThumbsUp, FiMessageSquare, FiShare2
} from 'react-icons/fi';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import * as THREE from 'three';

// Éléments décoratifs futuristes
const FuturisticElements = () => (
  <>
    <motion.div 
      className="absolute top-20 right-10 w-4 h-20 bg-gradient-to-b from-primary-300 to-primary-600 rounded-full opacity-30 dark:opacity-40 hidden md:block"
      animate={{
        y: [0, 20, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    <motion.div 
      className="absolute bottom-20 left-10 w-4 h-20 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full opacity-30 dark:opacity-40 hidden md:block"
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
    
    {/* Barres verticales animées */}
    <div className="absolute left-0 bottom-0 h-40 w-full overflow-hidden opacity-30 pointer-events-none">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-1 bg-gradient-to-t from-primary-500 to-primary-200 dark:from-primary-600 dark:to-primary-900"
          style={{ 
            left: `${i * 10 + Math.random() * 5}%`,
            height: `${20 + Math.random() * 80}px`,
            opacity: 0.5 + Math.random() * 0.5
          }}
          animate={{
            height: [
              `${20 + Math.random() * 80}px`,
              `${40 + Math.random() * 60}px`,
              `${20 + Math.random() * 80}px`
            ],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 1
          }}
        />
      ))}
    </div>
  </>
);

// Composant de carte de statistique
const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      className="card p-6 flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      
      <div className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? '+' : ''}{change}% <span className="text-gray-500 dark:text-gray-400">depuis le mois dernier</span>
      </div>
    </motion.div>
  );
};

// Composant de sélecteur de période
const PeriodSelector = ({ period, setPeriod }) => {
  const periods = ['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Cette année'];
  
  return (
    <div className="flex space-x-2">
      {periods.map((p) => (
        <motion.button
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            period === p 
              ? 'bg-primary-600 text-white dark:bg-primary-500' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
          }`}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          {p}
        </motion.button>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [period, setPeriod] = useState('Cette semaine');
  const [viewMode, setViewMode] = useState('grid');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Données de statistiques (en situation réelle, ces données viendraient d'une API)
  const stats = [
    { 
      title: 'Utilisateurs', 
      value: '2,543', 
      change: 12.5, 
      icon: <FiUsers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    { 
      title: 'Sessions', 
      value: '18,216', 
      change: 8.2, 
      icon: <FiActivity className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      title: 'Projets', 
      value: '145', 
      change: 3.7, 
      icon: <FiGrid className="w-6 h-6 text-green-600 dark:text-green-400" />,
      color: 'bg-green-100 dark:bg-green-900/30'
    },
    { 
      title: 'Publications', 
      value: '362', 
      change: -2.1, 
      icon: <FiBarChart2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />,
      color: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];
  
  // Données pour la section "Utilisateurs les plus actifs"
  const topUsers = [
    { id: 1, name: 'Marie Dupont', role: 'collaborateur', avatar: '/images/img1.jpg', interactions: 187, growth: 14 },
    { id: 2, name: 'Thomas Petit', role: 'collaborateur', avatar: '/images/img4.jpg', interactions: 132, growth: 8 },
    { id: 3, name: 'Sophie Bernard', role: 'admin', avatar: '/images/img3.jpg', interactions: 97, growth: 2 },
    { id: 4, name: 'Lucas Martin', role: 'user', avatar: '/images/img2.jpg', interactions: 78, growth: -5 },
    { id: 5, name: 'Camille Dubois', role: 'user', avatar: '/images/img5.jpg', interactions: 65, growth: 7 },
  ];
  
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-0 pt-24 relative">
      {/* Fond de particules */}
      <ParticlesBackground className="opacity-50" />
      
      {/* Éléments décoratifs futuristes */}
      <FuturisticElements />
      
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Bienvenue sur votre dashboard administrateur</p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <button className="btn-primary rounded-md px-4 py-2 flex items-center">
              <FiDownload className="mr-2 h-4 w-4" />
              <span>Exporter</span>
            </button>
            
            <div className="flex rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}
              >
                <FiGrid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}
              >
                <FiList className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filtres et période */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <PeriodSelector period={period} setPeriod={setPeriod} />
          
          <div className="mt-4 sm:mt-0 flex items-center">
            <button className="flex items-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiFilter className="mr-2 h-4 w-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        
        {/* Graphiques et tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Graphique principal - activité */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Activité de la plateforme</h2>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FiFilter className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-72 flex items-center justify-center">
              {/* Placeholder pour un graphique */}
              <div className="text-gray-500 dark:text-gray-400 text-center">
                <FiBarChart2 className="w-12 h-12 mx-auto mb-3" />
                <p>Graphique d'activité (intégrer une bibliothèque comme Chart.js, Recharts, etc.)</p>
              </div>
            </div>
            
            {/* Métriques sous le graphique */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <FiEye className="w-5 h-5 mx-auto text-blue-500" />
                <p className="mt-1 text-2xl font-medium text-gray-900 dark:text-white">21.8k</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Vues</p>
              </div>
              
              <div className="text-center">
                <FiThumbsUp className="w-5 h-5 mx-auto text-green-500" />
                <p className="mt-1 text-2xl font-medium text-gray-900 dark:text-white">8.5k</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Likes</p>
              </div>
              
              <div className="text-center">
                <FiMessageSquare className="w-5 h-5 mx-auto text-orange-500" />
                <p className="mt-1 text-2xl font-medium text-gray-900 dark:text-white">4.2k</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Commentaires</p>
              </div>
              
              <div className="text-center">
                <FiShare2 className="w-5 h-5 mx-auto text-purple-500" />
                <p className="mt-1 text-2xl font-medium text-gray-900 dark:text-white">1.9k</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Partages</p>
              </div>
            </div>
          </div>
          
          {/* Utilisateurs les plus actifs */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Utilisateurs les plus actifs</h2>
              <Link href="/admin/users" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                Voir tous
              </Link>
            </div>
            
            <div className="space-y-4">
              {topUsers.map((user) => (
                <motion.div 
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                        }}
                      />
                      {user.role === 'admin' && (
                        <span className="absolute -top-1 -right-1 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-400 text-xs font-medium px-1.5 rounded-full">Admin</span>
                      )}
                      {user.role === 'collaborateur' && (
                        <span className="absolute -top-1 -right-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-400 text-xs font-medium px-1.5 rounded-full">Collab</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.interactions} interactions</p>
                    </div>
                  </div>
                  
                  <div className={`text-xs font-medium ${user.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {user.growth > 0 ? '+' : ''}{user.growth}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contenu récent */}
        <div className="card overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contenu récent</h2>
            <div className="flex items-center space-x-2">
              <select className="input py-1 px-2 text-sm">
                <option>Tous les types</option>
                <option>Projets</option>
                <option>Publications</option>
                <option>Commentaires</option>
              </select>
              <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <FiFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auteur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Titre du contenu {item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Utilisateur {item}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item % 3 === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                        item % 3 === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                      }`}>
                        {item % 3 === 0 ? 'Projet' : item % 3 === 1 ? 'Publication' : 'Commentaire'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(Date.now() - 86400000 * item).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center"><FiEye className="mr-1 h-4 w-4 text-gray-400" /> {Math.floor(Math.random() * 100)}</span>
                        <span className="flex items-center"><FiThumbsUp className="mr-1 h-4 w-4 text-gray-400" /> {Math.floor(Math.random() * 50)}</span>
                        <span className="flex items-center"><FiMessageSquare className="mr-1 h-4 w-4 text-gray-400" /> {Math.floor(Math.random() * 20)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3">Voir</a>
                      <a href="#" className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">Modifier</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">5</span> sur <span className="font-medium">42</span> résultats
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Précédent
              </button>
              <button className="px-3 py-1 border border-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded-md text-sm font-medium text-primary-600 dark:text-primary-400">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 