import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Sky } from '@react-three/drei'
import { Group, Mesh } from 'three'
import Player from './Player'
import StarCollectible from './StarCollectible'

type Props = { paused: boolean; onCollectStar: () => void; onStartMath: () => void; onStartAI: () => void }
type Position = [number, number, number]

export default function GameScene({ paused, onCollectStar, onStartMath, onStartAI }: Props) {
  const playerRef = useRef<Group | null>(null)
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 5, 9], fov: 48 }} className="game-canvas">
    <color attach="background" args={['#8acde5']} /><fog attach="fog" args={['#8acde5', 20, 54]} />
    <ambientLight intensity={1.45} /><directionalLight castShadow position={[-9, 14, 7]} intensity={2.8} shadow-mapSize={[1024, 1024]} shadow-camera-far={50} /><hemisphereLight color="#d4fbff" groundColor="#315b68" intensity={0.55} />
    <Sky sunPosition={[-4, 6, -8]} turbidity={7} rayleigh={1.8} />
    <group>
      <MeadowTerrain />
      <DistantMountains />
      <IslandDecor />
      <Player paused={paused} playerRef={playerRef} onStartMath={onStartMath} onStartAI={onStartAI} />
      <StarCollectible position={[2, 0.9, -2]} playerRef={playerRef} onCollect={onCollectStar} />
      <StarCollectible position={[-4, 0.8, -6]} playerRef={playerRef} onCollect={onCollectStar} />
      <StarCollectible position={[5, 0.75, -7]} playerRef={playerRef} onCollect={onCollectStar} />
    </group>
  </Canvas>
}

function MeadowTerrain() {
  return <>
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[24, 64]} /><meshStandardMaterial color="#4fae82" roughness={0.96} /></mesh>
    <mesh position={[-8, -0.4, -8]} scale={[1.4, 0.55, 1]} receiveShadow><sphereGeometry args={[4.5, 32, 16]} /><meshStandardMaterial color="#3f9a76" roughness={1} /></mesh>
    <mesh position={[9, -0.55, -10]} scale={[1.5, 0.6, 0.9]} receiveShadow><sphereGeometry args={[4.4, 32, 16]} /><meshStandardMaterial color="#438f75" roughness={1} /></mesh>
    <mesh position={[0, -0.02, -1.4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2, 15]} /><meshStandardMaterial color="#d6b66c" roughness={0.9} /></mesh>
    <mesh position={[0, 0, -4.8]} rotation={[-Math.PI / 2, 0.05, 0]}><planeGeometry args={[11, 2.1]} /><meshStandardMaterial color="#c9a65b" roughness={0.9} /></mesh>
    <WaterStream />
    <FlowerPatch position={[-2.7, 0.05, 2.5]} color="#ff7dbb" />
    <FlowerPatch position={[3.4, 0.05, 1.6]} color="#ffe56e" />
    <FlowerPatch position={[-7.5, 0.05, -1]} color="#8ddcff" />
    <Sparkles count={65} scale={[20, 4, 20]} size={2.2} speed={0.25} color="#fff0a2" opacity={0.58} />
  </>
}

function DistantMountains() {
  return <group position={[0, -0.2, -18]}>
    {[[-12, 4, 0], [-7, 5.7, -1], [-1, 4.5, 0], [5, 6, -1], [12, 4.7, 0]].map(([x, y, z], index) => <mesh key={index} position={[x, y, z]} rotation={[0, index * 0.2, 0]}><coneGeometry args={[4.8, y * 2.4, 7]} /><meshStandardMaterial color={index % 2 ? '#5b8e9a' : '#477c8d'} roughness={1} /></mesh>)}
    <mesh position={[-5, 6.2, 0.3]} scale={[0.7, 1.2, 0.7]}><coneGeometry args={[1.2, 5, 7]} /><meshStandardMaterial color="#e8f3ee" roughness={0.8} /></mesh>
    <mesh position={[7, 5.8, 0.5]} scale={[0.8, 1.1, 0.8]}><coneGeometry args={[1.2, 5, 7]} /><meshStandardMaterial color="#e8f3ee" roughness={0.8} /></mesh>
  </group>
}

function IslandDecor() {
  return <>
    <CentralFountain />
    <AcademyBuilding position={[-5, 0, -4]} />
    <VillageHouse position={[5.5, 0, -3.5]} rotation={0.12} color="#e88769" />
    <VillageHouse position={[8, 0, -5.5]} rotation={-0.24} color="#f0c46b" small />
    <VillageHouse position={[-8.5, 0, -3]} rotation={0.35} color="#75c8d2" small />
    <Bridge />
    <CrystalCave />
    <PortalPlaza />
    <Tree position={[-7, 0, -8]} scale={1.25} />
    <Tree position={[7.5, 0, -8]} scale={1.1} />
    <Tree position={[-8, 0, 1]} scale={0.9} />
    <Tree position={[8, 0, 2]} scale={1.2} />
    <Tree position={[3.8, 0, 3]} scale={0.82} />
    <Tree position={[-4, 0, 4]} scale={0.75} />
    <Butterflies />
    <FloatingIsland position={[-7, 7, -14]} color="#6c96bb" />
    <FloatingIsland position={[8, 8.5, -18]} color="#7d87b7" />
  </>
}

function CentralFountain() {
  const water = useRef<Mesh>(null)
  useFrame((state) => { if (water.current) water.current.position.y = 1.48 + Math.sin(state.clock.elapsedTime * 2.4) * 0.04 })
  return <group position={[0, 0, -4.2]}>
    <mesh position={[0, 0.22, 0]} receiveShadow><cylinderGeometry args={[2.8, 3.15, 0.45, 12]} /><meshStandardMaterial color="#e7bd72" roughness={0.72} /></mesh>
    <mesh position={[0, 0.5, 0]}><torusGeometry args={[2.1, 0.15, 10, 32]} /><meshStandardMaterial color="#fff0bf" emissive="#ffe9a8" /></mesh>
    <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[1.9, 2.05, 0.18, 32]} /><meshStandardMaterial color="#4bb7cf" metalness={0.35} roughness={0.2} /></mesh>
    <mesh ref={water} position={[0, 1.48, 0]}><sphereGeometry args={[0.24, 16, 12]} /><meshStandardMaterial color="#9ff8fa" emissive="#48c7d2" emissiveIntensity={1.8} /></mesh>
    <mesh position={[0, 1.15, 0]}><coneGeometry args={[0.18, 0.8, 8]} /><meshStandardMaterial color="#5e50c8" emissive="#36358c" /></mesh>
    <Sparkles count={20} scale={[4, 2, 4]} size={3} speed={0.5} color="#fff3a2" />
  </group>
}

function AcademyBuilding({ position }: { position: Position }) {
  const pulse = useRef<Mesh>(null)
  useFrame((state) => { if (pulse.current) pulse.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.04) })
  return <group position={position}>
    <mesh position={[0, 1.2, 0]} castShadow><boxGeometry args={[3.8, 2.5, 3]} /><meshStandardMaterial color="#224f78" roughness={0.48} /></mesh>
    <mesh position={[0, 2.9, 0]} castShadow><coneGeometry args={[2.8, 2.1, 6]} /><meshStandardMaterial color="#5c6cd0" roughness={0.42} /></mesh>
    <mesh position={[0, 4.15, 0]} castShadow><coneGeometry args={[0.38, 1.35, 6]} /><meshStandardMaterial color="#ffcf68" emissive="#ba7e2f" /></mesh>
    <mesh position={[0, 1.35, -1.55]}><planeGeometry args={[1.1, 1.15]} /><meshStandardMaterial color="#89eef1" emissive="#2bb8cb" emissiveIntensity={1.7} /></mesh>
    {[-1.3, 1.3].map((x) => <mesh key={x} position={[x, 1.35, -1.57]}><cylinderGeometry args={[0.18, 0.18, 2.1, 8]} /><meshStandardMaterial color="#e7bd72" metalness={0.4} /></mesh>)}
    <mesh ref={pulse} position={[0, 2.25, -1.7]}><octahedronGeometry args={[0.34, 1]} /><meshStandardMaterial color="#78f1ed" emissive="#20ced0" emissiveIntensity={2} transparent opacity={0.88} /></mesh>
    <Sparkles count={26} position={[0, 2.4, -1.6]} scale={[4, 4, 1]} size={3} speed={0.35} color="#89eef1" />
  </group>
}

function VillageHouse({ position, rotation, color, small = false }: { position: Position; rotation: number; color: string; small?: boolean }) {
  const scale = small ? 0.72 : 1
  return <group position={position} rotation={[0, rotation, 0]} scale={scale}>
    <mesh position={[0, 0.9, 0]} castShadow><boxGeometry args={[2.4, 1.8, 2]} /><meshStandardMaterial color="#f5dfbd" roughness={0.8} /></mesh>
    <mesh position={[0, 2.1, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[1.75, 1.15, 4]} /><meshStandardMaterial color={color} roughness={0.72} /></mesh>
    <mesh position={[0, 0.82, -1.03]}><planeGeometry args={[0.55, 0.85]} /><meshStandardMaterial color="#5e4a74" /></mesh>
    <mesh position={[-0.7, 1.05, -1.04]}><planeGeometry args={[0.42, 0.42]} /><meshStandardMaterial color="#8de4e4" emissive="#3baab4" /></mesh>
  </group>
}

function Bridge() {
  return <group position={[0, 0.18, -8]} rotation={[0, 0.08, 0]}>
    <mesh receiveShadow><boxGeometry args={[3.4, 0.24, 6]} /><meshStandardMaterial color="#9c674b" roughness={0.86} /></mesh>
    {[-1.28, 1.28].map((x) => <mesh key={x} position={[x, 0.48, 0]}><boxGeometry args={[0.18, 0.82, 6.2]} /><meshStandardMaterial color="#edc46e" /></mesh>)}
    {[-2.25, -1.1, 0, 1.1, 2.25].map((z) => <mesh key={z} position={[0, 0.38, z]}><boxGeometry args={[3.35, 0.08, 0.12]} /><meshStandardMaterial color="#d9945a" /></mesh>)}
  </group>
}

function CrystalCave() {
  return <group position={[-5, 0.7, -4]}>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[1.7, 2.05, 0.7, 8]} /><meshStandardMaterial color="#355879" roughness={1} /></mesh>
    {[-0.7, 0, 0.7].map((x, index) => <mesh key={x} position={[x, index * 0.18 + 0.5, -0.3]} rotation={[0, index * 0.4, 0]}><coneGeometry args={[0.22, 1.3 + index * 0.2, 6]} /><meshStandardMaterial color={index === 1 ? '#ff75c8' : '#55d9ef'} emissive={index === 1 ? '#b72f9d' : '#198fae'} emissiveIntensity={1.5} /></mesh>)}
    <mesh position={[0, 1, -0.72]}><torusGeometry args={[0.72, 0.1, 8, 24, Math.PI]} /><meshStandardMaterial color="#78d9ef" emissive="#2f83b4" /></mesh>
  </group>
}

function PortalPlaza() {
  return <group position={[9, 0.2, -1]}>
    <mesh receiveShadow><cylinderGeometry args={[2, 2.35, 0.35, 12]} /><meshStandardMaterial color="#d7b46d" /></mesh>
    <mesh position={[0, 1.6, 0]} rotation={[0, 0, 0]}><torusGeometry args={[1.15, 0.18, 12, 32, Math.PI * 1.25]} /><meshStandardMaterial color="#ff82cb" emissive="#b52d8c" emissiveIntensity={1.5} /></mesh>
    <mesh position={[0, 1.6, -0.02]}><circleGeometry args={[0.8, 32]} /><meshStandardMaterial color="#3c559c" emissive="#253b87" emissiveIntensity={0.7} transparent opacity={0.75} /></mesh>
    <Sparkles count={28} position={[0, 1.6, 0]} scale={[3, 3, 1]} size={3} speed={0.8} color="#ff9bd5" />
  </group>
}

function Tree({ position, scale = 1 }: { position: Position; scale?: number }) {
  const leaves = useRef<Group>(null)
  useFrame((state) => { if (leaves.current) leaves.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.018 })
  return <group position={position} scale={scale}>
    <mesh position={[0, 1.15, 0]} castShadow><cylinderGeometry args={[0.2, 0.34, 2.3, 10]} /><meshStandardMaterial color="#85573e" roughness={1} /></mesh>
    <group ref={leaves}>
      <mesh position={[0, 2.35, 0]} castShadow><sphereGeometry args={[1.05, 18, 14]} /><meshStandardMaterial color="#26875e" roughness={0.94} /></mesh>
      <mesh position={[-0.62, 2.28, 0.18]} castShadow><sphereGeometry args={[0.7, 16, 12]} /><meshStandardMaterial color="#3eaa70" roughness={0.94} /></mesh>
      <mesh position={[0.65, 2.6, 0.1]} castShadow><sphereGeometry args={[0.73, 16, 12]} /><meshStandardMaterial color="#63bf79" roughness={0.94} /></mesh>
      <mesh position={[0.1, 3.1, 0]} castShadow><sphereGeometry args={[0.55, 16, 12]} /><meshStandardMaterial color="#7fd488" roughness={0.94} /></mesh>
    </group>
  </group>
}

function FlowerPatch({ position, color }: { position: Position; color: string }) {
  return <group position={position}>{[-0.25, 0, 0.25].map((x, index) => <group key={x} position={[x, 0.15 + index * 0.03, (index % 2) * 0.18]}><mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.018, 0.018, 0.45, 5]} /><meshStandardMaterial color="#3e9160" /></mesh><mesh position={[0, 0.46, 0]}><sphereGeometry args={[0.11, 10, 8]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} /></mesh></group>)}</group>
}

function WaterStream() {
  const stream = useRef<Group>(null)
  useFrame((state) => { if (stream.current) stream.current.position.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.06 })
  return <group ref={stream} position={[7, 0.035, -5]} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh><planeGeometry args={[2.8, 19]} /><meshStandardMaterial color="#58cfe0" transparent opacity={0.78} roughness={0.14} metalness={0.2} /></mesh>
    <mesh position={[0, 0.1, 0.01]}><planeGeometry args={[0.45, 18]} /><meshStandardMaterial color="#b7f8f2" transparent opacity={0.32} /></mesh>
  </group>
}

function Butterflies() {
  const group = useRef<Group>(null)
  useFrame((state) => { if (group.current) { group.current.position.x = Math.sin(state.clock.elapsedTime * 0.45) * 1.2; group.current.position.z = Math.cos(state.clock.elapsedTime * 0.35) * 0.8 } })
  return <group ref={group} position={[1.8, 1.4, 0.8]}><Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}><mesh position={[-0.15, 0, 0]} rotation={[0.3, 0.2, 0.3]}><circleGeometry args={[0.12, 12]} /><meshStandardMaterial color="#ff92c8" emissive="#9f3c85" /></mesh><mesh position={[0.15, 0, 0]} rotation={[-0.3, -0.2, -0.3]}><circleGeometry args={[0.12, 12]} /><meshStandardMaterial color="#89dfff" emissive="#2e8ba8" /></mesh></Float></group>
}

function FloatingIsland({ position, color }: { position: Position; color: string }) {
  return <group position={position}>
    <mesh rotation={[0, 0, Math.PI]}><coneGeometry args={[1.7, 2.3, 7]} /><meshStandardMaterial color="#647995" roughness={1} /></mesh>
    <mesh position={[0, 1.1, 0]}><cylinderGeometry args={[1.35, 1.55, 0.28, 8]} /><meshStandardMaterial color={color} /></mesh>
    <Tree position={[0, 1.25, 0]} scale={0.45} />
  </group>
}
