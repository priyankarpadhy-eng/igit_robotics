import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CoasterModel = () => {
  const mesh = useRef();
  const { viewport } = useThree();
  
  // Use a high-quality cylinder for the coaster if the specific .obj isn't locally available yet
  // This matches the "cork" material specified
  return (
    <group ref={mesh} scale={2}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <meshStandardMaterial 
          color="#c8b89a" 
          roughness={0.7} 
          metalness={0.05} 
        />
      </mesh>
      {/* Subtle details to make it look "AI" */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.02, 64]} />
        <meshStandardMaterial color="#c8b89a" roughness={0.9} />
      </mesh>
    </group>
  );
};

const Scene3D = () => {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div className="hero-3d-canvas">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 35, position: [0, 0, 6] }}>
        <ambientLight intensity={0.4} color="#f0ede8" />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#c8b89a" />
        <pointLight position={[3, 5, 3]} intensity={0.8} color="#6e3cff" />
        <pointLight position={[-4, -2, 4]} intensity={0.5} color="#ff8c3c" />
        
        <Suspense fallback={null}>
          <CoasterModel />
          <Environment preset="studio" />
          <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2.5} far={2} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
