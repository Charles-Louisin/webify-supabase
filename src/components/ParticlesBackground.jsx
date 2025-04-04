'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

// Composant pour les points 3D
function Points({ count = 2000, mouse }) {
  const points = useRef();
  
  // Générer des positions aléatoires
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const random = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
      
      // Couleur bleue avec variation
      colors[i3] = 0.1 + Math.random() * 0.2;
      colors[i3 + 1] = 0.5 + Math.random() * 0.3;
      colors[i3 + 2] = 0.8 + Math.random() * 0.2;
      
      scales[i] = Math.random();
      
      // Valeurs aléatoires pour l'animation
      random[i3] = Math.random();
      random[i3 + 1] = Math.random();
      random[i3 + 2] = Math.random();
    }
    
    return {
      positions,
      colors,
      scales,
      random
    };
  }, [count]);
  
  // Animation des particules
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array;
    const initialPositions = particles.positions;
    const randomValues = particles.random;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Animation de flottement avec des sinus
      positions[i3] = initialPositions[i3] + Math.sin(time * 0.2 + randomValues[i3]) * 0.1;
      positions[i3 + 1] = initialPositions[i3 + 1] + Math.sin(time * 0.3 + randomValues[i3 + 1]) * 0.1;
      positions[i3 + 2] = initialPositions[i3 + 2] + Math.sin(time * 0.1 + randomValues[i3 + 2]) * 0.1;
    }
    
    points.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotation lente
    points.current.rotation.y = time * 0.05;
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
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticlesBackground({ className }) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Points />
        </Suspense>
      </Canvas>
    </div>
  );
} 