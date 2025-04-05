'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

// Composant pour les points 3D
function Points({ count = 5000, mouse }) {
  const points = useRef();
  
  // Générer des positions aléatoires
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const random = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribuer les particules dans tout l'espace de visualisation
      positions[i3] = (Math.random() - 0.5) * 30; // x
      positions[i3 + 1] = Math.random() * 30; // y - toutes commencent en haut
      positions[i3 + 2] = (Math.random() - 0.5) * 30; // z
      
      // Couleur bleue avec variation
      colors[i3] = 0.1 + Math.random() * 0.2;      // R
      colors[i3 + 1] = 0.5 + Math.random() * 0.4;  // G
      colors[i3 + 2] = 0.8 + Math.random() * 0.2;  // B
      
      // Taille variable pour donner de la profondeur
      scales[i] = Math.random() * 2.5;
      
      // Valeurs aléatoires pour l'animation
      random[i3] = Math.random();
      random[i3 + 1] = Math.random();
      random[i3 + 2] = Math.random();
      
      // Vitesse de chute aléatoire
      speeds[i] = 0.02 + Math.random() * 0.08;
    }
    
    return {
      positions,
      colors,
      scales,
      random,
      speeds
    };
  }, [count]);
  
  // Animation des particules
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array;
    const initialPositions = particles.positions;
    const randomValues = particles.random;
    const speeds = particles.speeds;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Animation de flottement avec des sinus
      positions[i3] = initialPositions[i3] + Math.sin(time * 0.2 + randomValues[i3]) * 0.2; // mouvement latéral
      
      // Effet de pluie - tomber constamment vers le bas
      positions[i3 + 1] -= speeds[i]; // Vitesse de chute variable
      
      // Mouvement latéral subtil
      positions[i3 + 2] = initialPositions[i3 + 2] + Math.sin(time * 0.1 + randomValues[i3 + 2]) * 0.2;
      
      // Réinitialiser les particules qui sortent de la vue (en bas)
      if (positions[i3 + 1] < -15) {
        positions[i3 + 1] = 15; // Repositionner en haut
        positions[i3] = (Math.random() - 0.5) * 30; // Nouvelle position x aléatoire
        positions[i3 + 2] = (Math.random() - 0.5) * 30; // Nouvelle position z aléatoire
      }
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotation très lente pour plus de dynamisme
    points.current.rotation.y = time * 0.02;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particles.positions.length / 3} 
          array={particles.positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particles.colors.length / 3} 
          array={particles.colors} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-scale" 
          count={particles.scales.length} 
          array={particles.scales} 
          itemSize={1} 
        />
      </bufferGeometry>
      <PointMaterial 
        transparent
        vertexColors
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticlesBackground({ className }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className={`fixed inset-0 -z-10 opacity-90 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <Suspense fallback={null}>
          <Points />
        </Suspense>
      </Canvas>
    </div>
  );
} 