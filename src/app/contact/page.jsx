'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';

export default function Contact() {
  const [mounted, setMounted] = useState(false);
  const [formStatus, setFormStatus] = useState(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Animation pour le curseur de carte
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Effet pour le rendu côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simuler l'envoi du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setFormStatus('loading');
    
    // Simulation d'un appel API
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Réinitialiser après 5 secondes
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1500);
  };

  // Gérer les changements de champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Effet pour l'animation de la carte
  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    const handleMouseMove = (e) => {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const map = mapRef.current;
    if (map) {
      map.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (map) {
        map.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mounted]);

  // Animation pour le titre
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Variantes pour les champs du formulaire
  const formFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + custom * 0.1, duration: 0.5 }
    })
  };

  if (!mounted) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20 px-4">
          <div className="container mx-auto">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-center text-white mb-6"
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              {Array.from("Contactez-Nous").map((letter, index) => (
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
              Nous sommes à votre écoute. Partagez vos idées, posez vos questions ou discutons simplement de votre prochain projet.
            </motion.p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Envoyez-nous un message</h2>
              
              {formStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">Message envoyé !</h3>
                  <p className="text-green-700 dark:text-green-400">
                    Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <motion.div 
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="Votre nom"
                      />
                    </motion.div>
                    
                    <motion.div
                      variants={formFieldVariants}
                      initial="hidden"
                      animate="visible"
                      custom={1}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                        placeholder="votre@email.com"
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="mb-6"
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sujet
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="À propos de..."
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="mb-6"
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
                      placeholder="Votre message ici..."
                    />
                  </motion.div>
                  
                  <motion.div
                    variants={formFieldVariants}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                  >
                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all
                        ${formStatus === 'loading' 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {formStatus === 'loading' ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : "Envoyer le message"}
                    </button>
                  </motion.div>
                </form>
              )}
            </motion.div>
            
            {/* Carte et infos de contact */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Carte interactive */}
              <div 
                ref={mapRef}
                className="relative h-64 mb-8 rounded-xl overflow-hidden bg-blue-100 dark:bg-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 dark:from-blue-900/30 dark:to-indigo-900/30"></div>
                
                {/* Points sur la carte */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-red-500 rounded-full">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                {/* Effet de suivi du curseur */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    top: mousePosition.y,
                    left: mousePosition.x,
                    width: '100px',
                    height: '100px',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0) 70%)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">Carte interactive</p>
                </div>
              </div>
              
              {/* Informations de contact */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Nos coordonnées</h2>
                
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Adresse</h3>
                      <p className="text-gray-600 dark:text-gray-300">123 Avenue Principale<br />75000 Paris, France</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start" 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Téléphone</h3>
                      <p className="text-gray-600 dark:text-gray-300">+33 (0)1 23 45 67 89</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">contact@webify.fr</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Heures d'ouverture</h3>
                      <p className="text-gray-600 dark:text-gray-300">Lundi - Vendredi: 9h - 18h</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Réseaux sociaux */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Suivez-nous</h3>
                  <div className="flex space-x-4">
                    {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
                      <motion.a
                        key={social}
                        href={`#${social}`}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 transition-colors"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                        whileHover={{ y: -3, scale: 1.1 }}
                      >
                        <span className="sr-only">{social}</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Section FAQ */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 py-20 px-4 mt-16">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              Questions fréquemment posées
            </motion.h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "Quels services proposez-vous ?",
                  answer: "Nous offrons une gamme complète de services de développement web, de la conception de sites vitrines aux applications web complexes, en passant par le développement mobile et les stratégies de présence en ligne."
                },
                {
                  question: "Comment se déroule un projet avec votre équipe ?",
                  answer: "Nous commençons par une phase de découverte pour comprendre vos besoins, suivie d'une proposition détaillée. Après validation, nous entamons la conception et le développement avec des points réguliers. Une fois le projet terminé, nous assurons un suivi et une maintenance continue."
                },
                {
                  question: "Quels sont vos délais de réalisation ?",
                  answer: "Les délais varient selon la complexité du projet. Un site vitrine peut être livré en 2-4 semaines, tandis qu'une application sur mesure peut prendre 2-6 mois. Nous établissons toujours un calendrier précis au début du projet."
                },
                {
                  question: "Proposez-vous des services de maintenance ?",
                  answer: "Oui, nous offrons des contrats de maintenance adaptés à vos besoins, incluant des mises à jour régulières, corrections de bugs, améliorations continues et support technique réactif."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer p-6 text-gray-900 dark:text-white">
                      <span>{faq.question}</span>
                      <span className="transition group-open:rotate-180">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}