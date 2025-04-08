'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSearchParams } from 'next/navigation';
import { FiSearch, FiSend, FiPaperclip, FiImage, FiSmile, FiMic, FiUser, FiVideo, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { ParticlesBackground } from '@/components/ParticlesBackground';

// Données factices pour les conversations
const conversations = [
  {
    id: 1,
    name: 'Sophie Martin',
    avatar: '/images/img1.jpg',
    lastMessage: 'Bonjour, comment avance le projet ?',
    timestamp: '10:23',
    unread: 2,
    online: true
  },
  {
    id: 2,
    name: 'Thomas Dubois',
    avatar: '/images/img2.jpg',
    lastMessage: 'J\'ai envoyé les maquettes par email',
    timestamp: 'Hier',
    unread: 0,
    online: false
  },
  {
    id: 3,
    name: 'Emma Leroy',
    avatar: '/images/img3.jpg',
    lastMessage: 'Super, merci beaucoup !',
    timestamp: 'Hier',
    unread: 0,
    online: true
  },
  {
    id: 4,
    name: 'Lucas Bernard',
    avatar: '/images/img4.jpg',
    lastMessage: 'On peut prévoir une réunion demain ?',
    timestamp: 'Lun',
    unread: 1,
    online: false
  },
  {
    id: 5,
    name: 'Julie Petit',
    avatar: '/images/img5.jpg',
    lastMessage: 'Les modifications sont en ligne',
    timestamp: 'Dim',
    unread: 0,
    online: true
  },
  {
    id: 6,
    name: 'Nicolas Moreau',
    avatar: '/images/img1.jpg',
    lastMessage: 'Parfait, je vais regarder ça',
    timestamp: '12 Jan',
    unread: 0,
    online: false
  },
  {
    id: 7,
    name: 'Marie Lambert',
    avatar: '/images/img2.jpg',
    lastMessage: 'J\'ai une question sur le design',
    timestamp: '8 Jan',
    unread: 0,
    online: true
  }
];

// Données factices pour les messages
const generateMessages = (contactId) => {
  const today = new Date();
  
  return [
    {
      id: 1,
      senderId: contactId,
      text: 'Bonjour, comment ça va aujourd\'hui ?',
      timestamp: new Date(today.setHours(today.getHours() - 2)),
      status: 'read'
    },
    {
      id: 2,
      senderId: 'me',
      text: 'Salut ! Ça va bien, merci. Je travaille sur le nouveau projet.',
      timestamp: new Date(today.setMinutes(today.getMinutes() + 5)),
      status: 'read'
    },
    {
      id: 3,
      senderId: contactId,
      text: 'Super ! Comment ça avance ?',
      timestamp: new Date(today.setMinutes(today.getMinutes() + 10)),
      status: 'read'
    },
    {
      id: 4,
      senderId: 'me',
      text: 'Bien ! J\'ai presque terminé la première phase. Je t\'enverrai les maquettes demain.',
      timestamp: new Date(today.setMinutes(today.getMinutes() + 7)),
      status: 'read'
    },
    {
      id: 5,
      senderId: contactId,
      text: 'Parfait, j\'ai hâte de voir ça ! Est-ce que tu as utilisé le nouveau framework dont on a parlé ?',
      timestamp: new Date(today.setMinutes(today.getMinutes() + 12)),
      status: 'read'
    },
    {
      id: 6,
      senderId: 'me',
      text: 'Oui, c\'est vraiment efficace. Ça m\'a fait gagner beaucoup de temps.',
      timestamp: new Date(today.setMinutes(today.getMinutes() + 8)),
      status: 'delivered'
    }
  ];
};

export default function MessagingPage() {
  const searchParams = useSearchParams();
  const initialContactId = searchParams.get('user') || '1';
  
  const [activeContact, setActiveContact] = useState(parseInt(initialContactId));
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const messagesEndRef = useRef(null);
  const { theme } = useTheme();
  
  // Filtrer les conversations selon la recherche
  const filteredConversations = conversations.filter(
    conv => conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Récupérer les infos du contact actif
  const activeContactInfo = conversations.find(c => c.id === activeContact);
  
  useEffect(() => {
    setMounted(true);
    
    // Charger les messages du contact sélectionné
    setMessages(generateMessages(activeContact));
    
    // Détection du mode mobile
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, [activeContact]);
  
  useEffect(() => {
    // Si on a sélectionné un contact en mode mobile, afficher la conversation
    if (isMobileView && activeContact) {
      setShowConversation(true);
    }
  }, [activeContact, isMobileView]);
  
  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleBackToContacts = () => {
    setShowConversation(false);
  };
  
  const handleContactClick = (contactId) => {
    setActiveContact(contactId);
    if (isMobileView) {
      setShowConversation(true);
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: Date.now(),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simuler une réponse après un délai aléatoire
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMsg.id ? {...msg, status: 'delivered'} : msg
        )
      );
      
      // 50% de chance de recevoir une réponse
      if (Math.random() > 0.5) {
        setTimeout(() => {
          const responseMsg = {
            id: Date.now(),
            senderId: activeContact,
            text: `Ceci est une réponse automatique à "${newMessage}"`,
            timestamp: new Date(),
            status: 'read'
          };
          
          setMessages(prevMessages => [...prevMessages, responseMsg]);
        }, 1000 + Math.random() * 2000);
      }
    }, 500 + Math.random() * 1000);
  };
  
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (!mounted) {
    return null;
  }
  
  const isDark = theme === 'dark';
  
  return (
    <div className="relative pt-16 md:pt-20 pb-0 md:pb-16 min-h-screen h-[calc(100vh-56px)] md:h-auto">
      {/* Fond de particules */}
      <ParticlesBackground className="opacity-30" />
      
      <div className="container mx-auto h-full px-0 md:px-4 py-0">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-none md:rounded-xl shadow-xl overflow-hidden border-0 md:border border-gray-200 dark:border-gray-800 h-full md:h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Sidebar des conversations - cachée en mode mobile quand une conversation est ouverte */}
            <AnimatePresence mode="wait">
              {(!isMobileView || (isMobileView && !showConversation)) && (
                <motion.div 
                  className="w-full md:w-80 md:max-w-xs border-r border-gray-200 dark:border-gray-800 flex flex-col"
                  initial={{ x: isMobileView ? -300 : 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Messages</h2>
                    
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto flex-grow">
                    <AnimatePresence>
                      {filteredConversations.map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${activeContact === conversation.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                          onClick={() => handleContactClick(conversation.id)}
                        >
                          <div className="flex items-center">
                            <div className="relative">
                              <Image
                                src={conversation.avatar}
                                alt={conversation.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.name)}&background=random`;
                                }}
                              />
                              {conversation.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                              )}
                            </div>
                            
                            <div className="ml-3 flex-grow">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-900 dark:text-white">{conversation.name}</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.timestamp}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[140px]">
                                  {conversation.lastMessage}
                                </p>
                                {conversation.unread > 0 && (
                                  <span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {conversation.unread}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Conversation principale - prend tout l'écran en mode mobile */}
            <AnimatePresence mode="wait">
              {(!isMobileView || (isMobileView && showConversation)) && (
                <motion.div 
                  className="flex-grow flex flex-col bg-gray-50 dark:bg-gray-900"
                  initial={{ x: isMobileView ? 300 : 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeContactInfo ? (
                    <>
                      {/* En-tête de la conversation */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-800/90 backdrop-blur-sm">
                        <div className="flex items-center">
                          {isMobileView && (
                            <button 
                              onClick={handleBackToContacts}
                              className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              <FiArrowLeft className="h-5 w-5" />
                            </button>
                          )}
                          <div className="relative">
                            <Image
                              src={activeContactInfo.avatar}
                              alt={activeContactInfo.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContactInfo.name)}&background=random`;
                              }}
                            />
                            {activeContactInfo.online && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-900 dark:text-white">{activeContactInfo.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activeContactInfo.online ? 'En ligne' : 'Hors ligne'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <FiPhone className="h-5 w-5" />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <FiVideo className="h-5 w-5" />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                            <FiUser className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Corps de la conversation */}
                      <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                        <div className="flex flex-col space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                            >
                              {message.senderId !== 'me' && (
                                <div className="flex-shrink-0 mr-2">
                                  <Image
                                    src={activeContactInfo.avatar}
                                    alt={activeContactInfo.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                    onError={(e) => {
                                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContactInfo.name)}&background=random&size=32`;
                                    }}
                                  />
                                </div>
                              )}
                              
                              <div className="max-w-[70%]">
                                <div
                                  className={`p-3 rounded-xl ${
                                    message.senderId === 'me' 
                                      ? 'bg-primary-500 text-white rounded-tr-none' 
                                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                                  }`}
                                >
                                  <p>{message.text}</p>
                                </div>
                                <div className="flex items-center mt-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatMessageTime(message.timestamp)}
                                  </p>
                                  
                                  {message.senderId === 'me' && (
                                    <div className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                      {message.status === 'sending' && <span>Envoi en cours...</span>}
                                      {message.status === 'delivered' && <span>Envoyé</span>}
                                      {message.status === 'read' && <span>Lu</span>}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                      
                      {/* Zone de saisie */}
                      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/90 backdrop-blur-sm">
                        <form onSubmit={handleSendMessage} className="flex items-center">
                          <button
                            type="button"
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <FiPaperclip className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <FiImage className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <FiSmile className="h-5 w-5" />
                          </button>
                          
                          <input
                            type="text"
                            className="flex-grow mx-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                            placeholder="Écrivez votre message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          
                          <button
                            type="button"
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <FiMic className="h-5 w-5" />
                          </button>
                          
                          <button
                            type="submit"
                            className="ml-1 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center"
                          >
                            <FiSend className="h-5 w-5" />
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 dark:text-gray-600 text-7xl mb-4">💬</div>
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Aucune conversation sélectionnée</h3>
                        <p className="text-gray-500 dark:text-gray-400">Sélectionnez une conversation pour commencer à discuter</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 