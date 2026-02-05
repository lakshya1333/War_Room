'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Html } from '@react-three/drei';
import { XR } from '@react-three/xr';
import * as THREE from 'three';
import type { AttackTreeNode } from '../types';

interface NetworkNode3DProps {
  node: AttackTreeNode;
  position: [number, number, number];
  onNodeClick?: (node: AttackTreeNode) => void;
}

function NetworkNode3D({ node, position, onNodeClick }: NetworkNode3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const getSeverityColor = () => {
    switch (node.severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.5, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onNodeClick?.(node)}
      >
        <meshStandardMaterial
          color={getSeverityColor()}
          emissive={getSeverityColor()}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-zinc-700">
            <div className="font-bold">{node.name}</div>
            <div className="text-xs text-zinc-400">{node.severity}</div>
          </div>
        </Html>
      )}
      
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.name.substring(0, 15)}
      </Text>
    </group>
  );
}

function DataFlowParticles({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      pos[i * 3] = from[0] + (to[0] - from[0]) * t;
      pos[i * 3 + 1] = from[1] + (to[1] - from[1]) * t;
      pos[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;
    }
    return pos;
  }, [from, to]);

  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = state.clock.elapsedTime;
      
      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount + time * 0.2) % 1;
        positions[i * 3] = from[0] + (to[0] - from[0]) * t;
        positions[i * 3 + 1] = from[1] + (to[1] - from[1]) * t;
        positions[i * 3 + 2] = from[2] + (to[2] - from[2]) * t;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#00ff00"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface NetworkTopology3DProps {
  attackTree: AttackTreeNode[];
  vrMode?: boolean;
}

function Scene({ attackTree, onNodeClick }: { attackTree: AttackTreeNode[]; onNodeClick?: (node: AttackTreeNode) => void }) {
  // Calculate positions for nodes in a spiral pattern
  const nodePositions = useMemo(() => {
    return attackTree.map((_, index) => {
      const angle = (index / attackTree.length) * Math.PI * 4;
      const radius = 3 + index * 0.5;
      const height = Math.sin(angle) * 2;
      return [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ] as [number, number, number];
    });
  }, [attackTree]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0000" />

      {/* Grid floor */}
      <gridHelper args={[50, 50, '#00ff00', '#003300']} position={[0, -5, 0]} />

      {/* Nodes */}
      {attackTree.map((node, index) => (
        <NetworkNode3D
          key={node.id}
          node={node}
          position={nodePositions[index]}
          onNodeClick={onNodeClick}
        />
      ))}

      {/* Connections */}
      {attackTree.map((node, index) => {
        if (index === 0) return null;
        const parentIndex = Math.floor((index - 1) / 2);
        return (
          <group key={`connection-${node.id}`}>
            <Line
              points={[nodePositions[parentIndex], nodePositions[index]]}
              color="#00ff00"
              lineWidth={2}
              opacity={0.5}
              transparent
            />
            <DataFlowParticles
              from={nodePositions[parentIndex]}
              to={nodePositions[index]}
            />
          </group>
        );
      })}

      {/* Camera controls */}
      <OrbitControls
        enableZoom
        enablePan
        enableRotate
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function NetworkTopology3D({ attackTree, vrMode = false }: NetworkTopology3DProps) {
  const [selectedNode, setSelectedNode] = React.useState<AttackTreeNode | null>(null);

  if (attackTree.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        <div className="text-center">
          <div className="text-lg font-mono">Waiting for reconnaissance data...</div>
          <div className="text-sm">3D network topology will appear here</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
        <Scene attackTree={attackTree} onNodeClick={setSelectedNode} />
      </Canvas>

      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/90 border border-zinc-700 p-4 rounded-lg backdrop-blur-md">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{selectedNode.name}</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-zinc-400 mb-2">
            Severity: <span className={`font-bold ${
              selectedNode.severity === 'critical' ? 'text-red-500' :
              selectedNode.severity === 'high' ? 'text-orange-500' :
              selectedNode.severity === 'medium' ? 'text-yellow-500' :
              'text-blue-500'
            }`}>{selectedNode.severity}</span>
          </div>
          <div className="text-sm">{selectedNode.description}</div>
        </div>
      )}
    </div>
  );
}
