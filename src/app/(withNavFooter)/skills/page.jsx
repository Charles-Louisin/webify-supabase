'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import * as THREE from 'three';
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaDatabase, FaFigma, FaDocker, FaGitAlt } from 'react-icons/fa';
import { SiJavascript, SiTypescript, SiNextdotjs, SiTailwindcss, SiMongodb, SiFirebase, SiSupabase, SiAdobexd } from 'react-icons/si';

// Composant pour les barres de compétences techniques
const SkillBar = ({ skill, level, color }) => {
  const barRef = useRef(null);
  const isInView = useInView(barRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        width: `${level}%`,
        transition: {
          duration: 1.2,
          ease: [0.43, 0.13, 0.23, 0.96]
        }
      });
    }
  }, [isInView, level, controls]);

  return (
    <div className="mb-8" ref={barRef}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-100 font-orbitron">{skill}</h3>
        <span className="text-sm text-gray-300">{level}%</span>
      </div>
      <div className="h-3 rounded-full bg-gray-800 overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={controls}
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="bg-gradient-to-r from-white/10 to-transparent h-full" />
        </div>
      </div>
    </div>
  );
};

// Composant pour le diagramme radar des soft skills
const RadarChart = ({ skills }) => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const isInView = useInView(canvasRef, { once: false, amount: 0.5 });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (!svgRef.current || !mounted || !isInView) return;
    
    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Supprime les anciens éléments pour éviter les duplications
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Dessiner les cercles de fond
    const circles = [0.2, 0.4, 0.6, 0.8, 1];
    circles.forEach(percentage => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX);
      circle.setAttribute('cy', centerY);
      circle.setAttribute('r', radius * percentage);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
      circle.setAttribute('stroke-width', '1');
      svg.appendChild(circle);
    });
    
    // Dessiner les lignes de l'axe
    const numSkills = skills.length;
    const angleStep = (Math.PI * 2) / numSkills;
    
    skills.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2; // Commencer à midi
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
      
      // Ajouter les labels des compétences
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);
      label.setAttribute('x', labelX);
      label.setAttribute('y', labelY);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('fill', 'white');
      label.setAttribute('font-size', '12');
      label.setAttribute('font-family', 'Orbitron, sans-serif');
      label.textContent = skill.name;
      svg.appendChild(label);
    });
    
    // Dessiner la forme du radar
    const points = skills.map((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const distance = skill.level / 100;
      const x = centerX + radius * distance * Math.cos(angle);
      const y = centerY + radius * distance * Math.sin(angle);
      return `${x},${y}`;
    });
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points.join(' '));
    polygon.setAttribute('fill', 'rgba(236, 72, 153, 0.2)');
    polygon.setAttribute('stroke', 'rgba(236, 72, 153, 0.8)');
    polygon.setAttribute('stroke-width', '2');
    svg.appendChild(polygon);
    
    // Ajouter des points aux sommets
    skills.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const distance = skill.level / 100;
      const x = centerX + radius * distance * Math.cos(angle);
      const y = centerY + radius * distance * Math.sin(angle);
      
      const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      point.setAttribute('cx', x);
      point.setAttribute('cy', y);
      point.setAttribute('r', '4');
      point.setAttribute('fill', '#ec4899');
      svg.appendChild(point);
    });
    
  }, [mounted, isInView, skills]);
  
  return (
    <div ref={canvasRef} className="w-full aspect-square max-w-md mx-auto relative">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

// Composant pour les icônes flottantes des technologies
const FloatingIcons = () => {
  const icons = [
    { Icon: FaReact, color: "#61DAFB", size: 40, delay: 0 },
    { Icon: SiNextdotjs, color: "#FFFFFF", size: 38, delay: 0.1 },
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
    { Icon: FaFigma, color: "#F24E1E", size: 30, delay: 1.3 },
    { Icon: SiAdobexd, color: "#FF61F6", size: 32, delay: 1.4 },
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

export default function Skills() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const threeSceneRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    setMounted(true);

    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

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
        const particleCount = 2000;
        
        const posArray = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 20;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.02,
          color: 0x7dd3fc,
          transparent: true,
          opacity: 0.4,
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
        };
        
        window.addEventListener('resize', handleResize);
        
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
  }, [mounted]);

  // Données des compétences techniques
  const technicalSkills = [
    { skill: "React & Next.js", level: 95, color: "bg-blue-500" },
    { skill: "JavaScript / TypeScript", level: 90, color: "bg-primary-500" },
    { skill: "HTML5 & CSS3", level: 92, color: "bg-blue-500" },
    { skill: "Node.js & Express", level: 85, color: "bg-primary-500" },
    { skill: "Tailwind CSS", level: 90, color: "bg-blue-500" },
    { skill: "MongoDB", level: 80, color: "bg-primary-500" },
    { skill: "SQL & PostgreSQL", level: 75, color: "bg-blue-500" },
    { skill: "Firebase & Supabase", level: 85, color: "bg-primary-500" },
    { skill: "Git & DevOps", level: 78, color: "bg-blue-500" },
    { skill: "UI/UX Design", level: 82, color: "bg-primary-500" },
  ];

  // Données des soft skills
  const softSkills = [
    { name: "Communication", level: 90 },
    { name: "Travail d'équipe", level: 85 },
    { name: "Résolution de problèmes", level: 95 },
    { name: "Gestion de projet", level: 80 },
    { name: "Adaptabilité", level: 90 },
    { name: "Leadership", level: 75 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (!mounted) return null;

  return (
    <main className="relative bg-gray-950 min-h-screen">
      {/* Canvas Three.js pour l'arrière-plan */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      
      {/* Icônes flottantes */}
      <FloatingIcons />
      
      <div className="relative z-10 pt-0">
        <div className="container mx-auto px-4 py-20">
          {/* En-tête de la page */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary-400 font-orbitron">
              MES COMPÉTENCES
            </h1>
            <div className="h-1 w-40 bg-gradient-to-r from-blue-500 to-primary-500 mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Je combine expertise technique et compétences transversales pour réaliser des projets web innovants et performants.
            </p>
          </motion.div>
          
          {/* Section des compétences techniques */}
          <section ref={sectionRef} className="mb-32">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              animate={controls}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-orbitron mb-4">
                  Compétences Techniques
                </h2>
                <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-primary-500 mx-auto"></div>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                <div>
                  {technicalSkills.slice(0, 5).map((skill, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <SkillBar 
                        skill={skill.skill} 
                        level={skill.level} 
                        color={skill.color} 
                      />
                    </motion.div>
                  ))}
                </div>
                <div>
                  {technicalSkills.slice(5, 10).map((skill, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <SkillBar 
                        skill={skill.skill} 
                        level={skill.level} 
                        color={skill.color} 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
          
          {/* Section des soft skills */}
          <section className="mb-32">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-orbitron mb-4">
                  Soft Skills
                </h2>
                <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-primary-500 mx-auto mb-6"></div>
                <p className="text-gray-300 max-w-2xl mx-auto mb-10">
                  Au-delà des compétences techniques, ces qualités sont essentielles pour collaborer efficacement et mener à bien chaque projet.
                </p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-xl">
                <RadarChart skills={softSkills} />
              </div>
            </motion.div>
          </section>
          
          {/* Section de la stack technologique */}
          <section>
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-orbitron mb-4">
                  Ma Stack Technologique
                </h2>
                <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-primary-500 mx-auto mb-6"></div>
                <p className="text-gray-300 max-w-2xl mx-auto mb-10">
                  Voici les technologies et outils que j'utilise quotidiennement pour créer des applications web modernes.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {[
                  { Icon: FaReact, name: "React", color: "#61DAFB" },
                  { Icon: SiNextdotjs, name: "Next.js", color: "#FFFFFF" },
                  { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
                  { Icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
                  { Icon: FaNodeJs, name: "Node.js", color: "#339933" },
                  { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
                  { Icon: FaHtml5, name: "HTML5", color: "#E34F26" },
                  { Icon: FaCss3Alt, name: "CSS3", color: "#1572B6" },
                  { Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
                  { Icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
                  { Icon: SiSupabase, name: "Supabase", color: "#3ECF8E" },
                  { Icon: FaDocker, name: "Docker", color: "#2496ED" },
                  { Icon: FaGitAlt, name: "Git", color: "#F05032" },
                  { Icon: FaFigma, name: "Figma", color: "#F24E1E" },
                  { Icon: SiAdobexd, name: "Adobe XD", color: "#FF61F6" },
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-xl p-4 flex flex-col items-center text-center group"
                    whileHover={{ y: -5, boxShadow: `0 10px 20px -5px rgba(${tech.color}, 0.3)` }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <tech.Icon size={40} color={tech.color} className="mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-gray-300 font-medium">{tech.name}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
} 