'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import gsap from 'gsap';
import { Suspense } from 'react';

// Composant 3D du robot Android
function Model({ action = 'greet', onComplete, onTapPhoto = () => {}, ...props }) {
  const group = useRef();
  const [animationState, setAnimationState] = useState('entering');
  const [isTapping, setIsTapping] = useState(false);
  
  // Définir un intervalle pour taper sur la photo occasionnellement
  useEffect(() => {
    const tapInterval = setInterval(() => {
      if (Math.random() > 0.7 && !isTapping) { // 30% de chance de taper
        tapPhoto();
      }
    }, 5000); // Vérifier toutes les 5 secondes
    
    return () => clearInterval(tapInterval);
  }, [isTapping]);
  
  // Fonction pour taper sur la photo
  const tapPhoto = () => {
    if (isTapping) return;
    
    setIsTapping(true);
    
    // Animation du bras qui tape
    gsap.to(group.current.rotation, {
      z: -0.3,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(group.current.rotation, {
          z: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            onTapPhoto(); // Déclenche l'animation de la photo
            setIsTapping(false);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (animationState === 'entering') {
      // Animation d'entrée
      gsap.fromTo(
        group.current.position,
        { x: -5 },
        {
          x: 0,
          duration: 1.5,
          ease: 'power3.out',
          onComplete: () => {
            setAnimationState('action');
          },
        }
      );
    } else if (animationState === 'action') {
      // Animation selon l'action demandée
      if (action === 'greet') {
        // Animation de salutation
        gsap.to(group.current.rotation, {
          y: Math.PI * 2,
          duration: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            setTimeout(() => setAnimationState('idle'), 1000);
          },
        });
      } else if (action === 'deliver') {
        // Animation de livraison
        gsap.to(group.current.position, {
          y: group.current.position.y - 0.5,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            setTimeout(() => setAnimationState('idle'), 1000);
          },
        });
      }
    } else if (animationState === 'exiting') {
      // Animation de sortie
      gsap.to(group.current.position, {
        x: 5,
        duration: 1.5,
        ease: 'power3.in',
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });
    }
  }, [animationState, action, onComplete]);

  // Animation continue
  useFrame(() => {
    if (animationState === 'action' || animationState === 'idle') {
      // Légère rotation continue pour donner de la vie
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group} {...props} dispose={null} scale={0.7}>
      {/* Robot stylisé avec des formes géométriques */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4285F4" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0.5]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#EA4335" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 1, 32]} />
        <meshStandardMaterial color="#34A853" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Bras droit - celui qui peut taper la photo */}
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#FBBC05" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.7, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#4285F4" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Bras gauche */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#FBBC05" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function AndroidRobot({ action = 'greet', onComplete, onTapPhoto = () => {}, size = 160 }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Suspense fallback={null}>
          <Float rotationIntensity={0.2}>
            <Model action={action} onComplete={onComplete} onTapPhoto={onTapPhoto} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
} 