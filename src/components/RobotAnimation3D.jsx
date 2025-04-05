'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Robot 3D simple avec des formes géométriques
function Robot({ position, color = '#3ECF8E', ...props }) {
  const group = useRef();
  const [targetPosition, setTargetPosition] = useState([...position]);
  const [hovering, setHovering] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [direction, setDirection] = useState(1);
  
  // Animation du robot
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Animation de flottement
    group.current.rotation.y += delta * 0.5;
    
    // Mouvement vers la position cible
    group.current.position.x += (targetPosition[0] - group.current.position.x) * delta * 2;
    group.current.position.y += (targetPosition[1] - group.current.position.y) * delta * 2;
    group.current.position.z += (targetPosition[2] - group.current.position.z) * delta * 2;
    
    // Changement de direction aléatoire
    if (Math.random() < 0.005) {
      setDirection(Math.random() > 0.5 ? 1 : -1);
    }
    
    // Animation de saut aléatoire
    if (Math.random() < 0.01 && !jumping) {
      setJumping(true);
      setTimeout(() => setJumping(false), 500);
    }
    
    // Déplacement aléatoire toutes les 2-3 secondes
    if (Math.random() < 0.005) {
      const newX = position[0] + (Math.random() - 0.5) * 4;
      const newY = position[1] + (Math.random() - 0.5) * 1;
      setTargetPosition([newX, newY, position[2]]);
    }
    
    // Animation de saut
    if (jumping) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 10) * 0.3;
    }
  });
  
  return (
    <group 
      ref={group} 
      position={position} 
      scale={hovering ? 1.2 : 1}
      onPointerOver={() => setHovering(true)}
      onPointerOut={() => setHovering(false)}
      {...props}
    >
      {/* Corps du robot */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Tête */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <MeshTransmissionMaterial 
          color={color} 
          thickness={0.2}
          roughness={0}
          transmission={0.95} 
          ior={1.5}
        />
      </mesh>
      
      {/* Yeux */}
      <mesh castShadow receiveShadow position={[0.1, 0.55, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.1, 0.55, 0.2]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      
      {/* Bras */}
      <mesh castShadow receiveShadow position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4 * direction]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 4 * direction]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Jambes */}
      <mesh castShadow receiveShadow position={[0.15, -0.5, 0]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.15, -0.5, 0]}>
        <capsuleGeometry args={[0.05, 0.3, 8, 16]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Antenne */}
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#F6CF57" emissive="#F6CF57" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

// Composant pour afficher plusieurs robots
export function RobotAnimation3D({ count = 1, positions = [[0, 0, 0]], ...props }) {
  return (
    <Canvas 
      shadows 
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      {...props}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {positions.map((position, index) => (
        <Float 
          key={index}
          speed={2} 
          rotationIntensity={0.5} 
          floatIntensity={0.5}
        >
          <Robot position={position} />
        </Float>
      ))}
    </Canvas>
  );
}

// Composant qui affiche un robot près d'une image
export function StaticRobot3D({ position = [0, 0, 0], ...props }) {
  return (
    <div className="relative w-28 h-28" {...props}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Robot position={position} color="#3ECF8E" />
        </Float>
      </Canvas>
    </div>
  );
} 