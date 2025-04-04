'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import * as d3 from 'd3';

// Données des compétences techniques
const technicalSkills = [
  { name: 'JavaScript', level: 90, color: '#F7DF1E', icon: '/icons/javascript.svg' },
  { name: 'React.js', level: 85, color: '#61DAFB', icon: '/icons/react.svg' },
  { name: 'Next.js', level: 80, color: '#000000', icon: '/icons/nextjs.svg' },
  { name: 'Node.js', level: 75, color: '#339933', icon: '/icons/nodejs.svg' },
  { name: 'Tailwind CSS', level: 85, color: '#38B2AC', icon: '/icons/tailwind.svg' },
  { name: 'Supabase', level: 70, color: '#3ECF8E', icon: '/icons/supabase.svg' },
  { name: 'Three.js', level: 65, color: '#000000', icon: '/icons/threejs.svg' },
  { name: 'TypeScript', level: 80, color: '#3178C6', icon: '/icons/typescript.svg' },
  { name: 'GSAP', level: 75, color: '#88CE02', icon: '/icons/gsap.svg' },
  { name: 'Framer Motion', level: 80, color: '#FF4D4D', icon: '/icons/framer.svg' }
];

// Données des soft skills
const softSkills = [
  { name: 'Communication', level: 90 },
  { name: 'Travail d\'équipe', level: 95 },
  { name: 'Résolution de problèmes', level: 85 },
  { name: 'Adaptabilité', level: 80 },
  { name: 'Gestion du temps', level: 85 },
  { name: 'Créativité', level: 90 }
];

// Composant pour les barres de compétences
const SkillBar = ({ skill, animationDelay }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(skill.level);
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [skill.level, animationDelay]);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {skill.icon && (
            <div className="mr-3 w-6 h-6 relative">
              <div 
                className="w-6 h-6 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${skill.icon})` }}
              />
            </div>
          )}
          <span className="font-medium text-gray-800 dark:text-gray-200">{skill.name}</span>
        </div>
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{skill.level}%</span>
      </div>
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: skill.color || "#0EA5E9",
            transition: "width 1s ease-out"
          }}
        />
      </div>
    </div>
  );
};

// Composant pour le graphique radar des soft skills
const RadarChart = ({ skills }) => {
  const [chartData, setChartData] = useState(null);
  const size = 300;
  const margin = 70;
  const radius = (size - 2 * margin) / 2;
  const center = size / 2;
  
  useEffect(() => {
    // Angles pour chaque axe
    const angles = skills.map((_, i) => ({
      angle: (Math.PI * 2 * i) / skills.length
    }));
    
    // Coordonnées des points
    const points = skills.map((skill, i) => ({
      x: center + radius * Math.cos(angles[i].angle - Math.PI / 2) * (skill.level / 100),
      y: center + radius * Math.sin(angles[i].angle - Math.PI / 2) * (skill.level / 100),
      name: skill.name,
      level: skill.level
    }));
    
    // Points pour créer le polygone
    const pathPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    
    // Axes
    const axes = angles.map(a => ({
      x1: center,
      y1: center,
      x2: center + radius * Math.cos(a.angle - Math.PI / 2),
      y2: center + radius * Math.sin(a.angle - Math.PI / 2)
    }));
    
    // Cercles concentriques
    const circles = [0.25, 0.5, 0.75, 1].map(percentage => ({
      cx: center,
      cy: center,
      r: radius * percentage
    }));
    
    // Labels des compétences
    const labels = skills.map((skill, i) => ({
      x: center + (radius + 20) * Math.cos(angles[i].angle - Math.PI / 2),
      y: center + (radius + 20) * Math.sin(angles[i].angle - Math.PI / 2),
      name: skill.name,
      textAnchor: 
        Math.cos(angles[i].angle - Math.PI / 2) > 0.1 ? 'start' :
        Math.cos(angles[i].angle - Math.PI / 2) < -0.1 ? 'end' : 'middle',
      alignmentBaseline:
        Math.sin(angles[i].angle - Math.PI / 2) > 0.1 ? 'hanging' :
        Math.sin(angles[i].angle - Math.PI / 2) < -0.1 ? 'text-top' : 'middle'
    }));
    
    setChartData({
      size,
      center,
      points,
      pathPoints,
      axes,
      circles,
      labels
    });
    
  }, [skills, center, radius]);
  
  if (!chartData) return <div>Chargement...</div>;
  
  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Cercles concentriques */}
        {chartData.circles.map((circle, i) => (
          <motion.circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={0}
            initial={{ r: 0 }}
            animate={{ r: circle.r }}
            transition={{ duration: 1, delay: 0.5 }}
            fill="none"
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}
        
        {/* Axes */}
        {chartData.axes.map((axis, i) => (
          <motion.line
            key={i}
            x1={axis.x1}
            y1={axis.y1}
            x2={axis.x1}
            y2={axis.y1}
            initial={{ x2: axis.x1, y2: axis.y1 }}
            animate={{ x2: axis.x2, y2: axis.y2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            stroke="rgba(99, 102, 241, 0.5)"
            strokeWidth="1"
          />
        ))}
        
        {/* Polygone de données */}
        <motion.polygon
          points=""
          initial={{ points: `${chartData.center},${chartData.center}` }}
          animate={{ points: chartData.pathPoints }}
          transition={{ duration: 1, delay: 1 }}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366F1"
          strokeWidth="2"
        />
        
        {/* Points de données */}
        {chartData.points.map((point, i) => (
          <motion.circle
            key={i}
            cx={chartData.center}
            cy={chartData.center}
            r={4}
            initial={{ cx: chartData.center, cy: chartData.center }}
            animate={{ cx: point.x, cy: point.y }}
            transition={{ duration: 1, delay: 1.2 }}
            fill="#6366F1"
            className="cursor-pointer"
          >
            <title>{point.name}: {point.level}%</title>
          </motion.circle>
        ))}
        
        {/* Labels */}
        {chartData.labels.map((label, i) => (
          <motion.text
            key={i}
            x={chartData.center}
            y={chartData.center}
            initial={{ x: chartData.center, y: chartData.center, opacity: 0 }}
            animate={{ x: label.x, y: label.y, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            textAnchor={label.textAnchor}
            alignmentBaseline={label.alignmentBaseline}
            className="text-xs font-medium fill-current text-gray-700 dark:text-gray-300"
          >
            {label.name}
          </motion.text>
        ))}
      </svg>
    </div>
  );
};

// Composant pour les icônes flottantes
const FloatingIcons = () => {
  // Données des icônes
  const icons = [
    { icon: '/icons/javascript.svg', size: 50, x: '10%', y: '20%', delay: 0 },
    { icon: '/icons/react.svg', size: 60, x: '80%', y: '15%', delay: 0.2 },
    { icon: '/icons/nextjs.svg', size: 45, x: '75%', y: '85%', delay: 0.4 },
    { icon: '/icons/nodejs.svg', size: 55, x: '15%', y: '85%', delay: 0.6 },
    { icon: '/icons/tailwind.svg', size: 50, x: '50%', y: '90%', delay: 0.8 },
    { icon: '/icons/supabase.svg', size: 45, x: '90%', y: '50%', delay: 1 }
  ];
  
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-30 pointer-events-none">
      {icons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ 
            top: icon.y, 
            left: icon.x,
            width: icon.size,
            height: icon.size,
            backgroundImage: `url(${icon.icon})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: [0, -15, 0],
            transition: {
              opacity: { duration: 0.5, delay: icon.delay },
              y: { 
                repeat: Infinity, 
                duration: 4 + Math.random() * 2,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: icon.delay
              }
            }
          }}
        />
      ))}
    </div>
  );
};

export default function Skills() {
  return (
    <MainLayout>
      {/* Icônes flottantes en arrière-plan */}
      <FloatingIcons />
      
      {/* En-tête de page */}
      <section className="container mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Nos <span className="text-primary-600 dark:text-primary-400">Compétences</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Découvrez notre maîtrise des dernières technologies et nos capacités à développer des solutions innovantes.
          </p>
        </motion.div>
        
        {/* Compétences techniques et soft skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Compétences techniques */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg glassmorphism"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Compétences Techniques
            </h2>
            <div className="space-y-2">
              {technicalSkills.map((skill, index) => (
                <SkillBar 
                  key={skill.name} 
                  skill={skill} 
                  animationDelay={300 + index * 100} 
                />
              ))}
            </div>
          </motion.div>
          
          {/* Soft skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg glassmorphism"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Soft Skills
            </h2>
            <RadarChart skills={softSkills} />
          </motion.div>
        </div>
      </section>
      
      {/* Section Technologies */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Notre <span className="text-primary-600 dark:text-primary-400">Stack Technologique</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Des outils modernes et performants pour créer des expériences web exceptionnelles.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {technicalSkills.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md glassmorphism flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 mb-4 relative">
                <div 
                  className="w-16 h-16 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${tech.icon})` }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {tech.name}
              </h3>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => {
                  const filled = Math.round(tech.level / 20) > i;
                  return (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${filled ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Appel à l'action */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 shadow-xl text-center text-white relative overflow-hidden"
        >
          {/* Effet d'onde lumineuse */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ x: '-100%', opacity: 0.5 }}
              animate={{ 
                x: '100%', 
                opacity: [0.2, 0.5, 0.2],
                transition: { 
                  x: { duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'linear' },
                  opacity: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
                }
              }}
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
            />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Donnez vie à votre projet numérique
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Nos compétences techniques et notre expertise sont à votre service pour transformer votre vision en réalité.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 bg-white text-primary-700 rounded-full hover:bg-gray-100 transition-colors font-medium"
            >
              Discuter de votre projet
            </motion.button>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
} 