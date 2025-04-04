'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import gsap from 'gsap';
import { Suspense } from 'react';

// Composant 3D du robot Android
function Model({ action = 'greet', onComplete, ...props }) {
  const group = useRef();
  const [animationState, setAnimationState] = useState('entering');

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
            setTimeout(() => setAnimationState('exiting'), 1000);
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
            setTimeout(() => setAnimationState('exiting'), 1000);
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
    if (animationState === 'action') {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={group} {...props} dispose={null} scale={0.5}>
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
    </group>
  );
}

export function AndroidRobot({ action = 'greet', onComplete, size = 120 }) {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <Suspense fallback={null}>
          <Float rotationIntensity={0.2}>
            <Model action={action} onComplete={onComplete} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
} 