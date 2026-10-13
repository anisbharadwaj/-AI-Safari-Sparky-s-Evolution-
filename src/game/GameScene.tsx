import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import type { Group } from 'three'
import Player from './Player'
import StarCollectible from './StarCollectible'

type Props = { paused: boolean; onCollectStar: () => void; onStartMath: () => void; onStartAI: () => void }

export default function GameScene({ paused, onCollectStar, onStartMath, onStartAI }: Props) {
  const playerRef = useRef<Group | null>(null)
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 5, 9], fov: 48 }} className="game-canvas">
    <color attach="background" args={['#8ed9ef']} /><fog attach="fog" args={['#8ed9ef', 18, 48]} /><ambientLight intensity={1.7} /><directionalLight castShadow position={[-8, 12, 5]} intensity={2.4} shadow-mapSize={[1024, 1024]} /><Sky sunPosition={[-4, 6, -8]} turbidity={8} rayleigh={2} />
    <group><mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[24, 64]} /><meshStandardMaterial color="#55b985" /></mesh><IslandDecor /><Player paused={paused} playerRef={playerRef} onStartMath={onStartMath} onStartAI={onStartAI} /><StarCollectible position={[2, 0.9, -2]} playerRef={playerRef} onCollect={onCollectStar} /><StarCollectible position={[-4, 0.8, -6]} playerRef={playerRef} onCollect={onCollectStar} /><StarCollectible position={[5, 0.75, -7]} playerRef={playerRef} onCollect={onCollectStar} /></group>
  </Canvas>
}

function IslandDecor() { return <><mesh position={[0, 0.35, -4]} castShadow><cylinderGeometry args={[2.4, 2.8, 0.7, 8]} /><meshStandardMaterial color="#f6c86b" /></mesh><mesh position={[0, 1.05, -4]} castShadow><torusGeometry args={[1.05, 0.12, 8, 24]} /><meshStandardMaterial color="#f8e8b0" emissive="#fff2bd" /></mesh><mesh position={[-5, 0.35, -4]} castShadow><boxGeometry args={[2.6, 0.7, 2.2]} /><meshStandardMaterial color="#3678c9" /></mesh><mesh position={[5, 0.3, -3]} castShadow><boxGeometry args={[2.6, 0.6, 2.6]} /><meshStandardMaterial color="#ed8f67" /></mesh><Bridge /><CrystalCave /><Tree position={[-7, 0, -7]} /><Tree position={[7, 0, -8]} /><Tree position={[-8, 0, 1]} /><Tree position={[8, 0, 2]} /><Tree position={[3, 0, 3]} /><mesh position={[0, 0.03, -1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.2, 12]} /><meshStandardMaterial color="#d7b66f" /></mesh></> }
function Bridge() { return <group position={[0, 0.15, -7]} rotation={[0, 0.08, 0]}><mesh receiveShadow><boxGeometry args={[3.2, 0.25, 6]} /><meshStandardMaterial color="#ad704e" /></mesh>{[-1.2, 1.2].map((x) => <mesh key={x} position={[x, 0.45, 0]}><boxGeometry args={[0.18, 0.8, 6.2]} /><meshStandardMaterial color="#f2c76c" /></mesh>)}</group> }
function CrystalCave() { return <group position={[-5, 0.7, -4]}>{[-0.7, 0, 0.7].map((x, index) => <mesh key={x} position={[x, index * 0.18, -0.3]} rotation={[0, index * 0.4, 0]}><coneGeometry args={[0.22, 1.3 + index * 0.2, 6]} /><meshStandardMaterial color={index === 1 ? '#ff75c8' : '#55d9ef'} emissive={index === 1 ? '#b72f9d' : '#198fae'} /></mesh>)}</group> }
function Tree({ position }: { position: [number, number, number] }) { return <group position={position}><mesh position={[0, 1, 0]} castShadow><cylinderGeometry args={[0.18, 0.28, 2, 8]} /><meshStandardMaterial color="#8b5e42" /></mesh><mesh position={[0, 2.2, 0]} castShadow><icosahedronGeometry args={[1.3, 1]} /><meshStandardMaterial color="#45a872" /></mesh><mesh position={[0.55, 2.65, 0.1]} castShadow><icosahedronGeometry args={[0.65, 1]} /><meshStandardMaterial color="#76c98a" /></mesh></group> }
