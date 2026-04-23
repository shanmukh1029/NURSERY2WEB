import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField({ count = 1500 }) {
  const points = useRef();

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;     // x
      p[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      p[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }
    return p;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x -= delta / 30;
      points.current.rotation.y -= delta / 40;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#aacc9a"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function WebGLParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleField />
      </Canvas>
    </div>
  );
}
