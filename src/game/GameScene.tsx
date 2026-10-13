import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import Player from './Player'
import StarCollectible from './StarCollectible'

type Props = { paused: boolean; onCollectStar: () => void; onStartMath: () => void; onStartAI: () => void }

export default function GameScene({ paused, onCollectStar, onStartMath, onStartAI }: Props) {
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 5, 9], fov: 48 }} className="game-canvas"><color attach="background" args={['#9bdcf0']} /><fog attach="fog" args={['#9bdcf0', 18, 42]} /><ambientLight intensity={1.8} /><directionalLight castShadow position={[-8, 12, 5]} intensity={2.2} shadow-mapSize={[1024, 1024]} /><Sky sunPosition={[-4, 6, -8]} turbidity={8} rayleigh={2} />
    <group><mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[24, 64]} /><meshStandardMaterial color="#5dba83" /></mesh><IslandDecor /><Player paused={paused} onStartMath={onStartMath} onStartAI={onStartAI} /><StarCollectible position={[2, 0.9, -2]} onCollect={onCollectStar} /><StarCollectible position={[-4, 0.8, -6]} onCollect={onCollectStar} /><StarCollectible position={[5, 0.75, -7]} onCollect={onCollectStar} /></group>
  </Canvas>
}

function IslandDecor() { return <><mesh position={[0, .35, -4]} castShadow><cylinderGeometry args={[2.4, 2.8, .7, 8]} /><meshStandardMaterial color="#f6c86b" /></mesh><mesh position={[0, 1.05, -4]} castShadow><torusGeometry args={[1.05, .12, 8, 24]} /><meshStandardMaterial color="#f8e8b0" /></mesh><mesh position={[-5, .35, -4]} castShadow><boxGeometry args={[2.6, .7, 2.2]} /><meshStandardMaterial color="#7256b8" /></mesh><mesh position={[5, .3, -3]} castShadow><boxGeometry args={[2.6, .6, 2.6]} /><meshStandardMaterial color="#eb8f67" /></mesh><Tree position={[-7, 0, -7]} /><Tree position={[7, 0, -8]} /><Tree position={[-8, 0, 1]} /><Tree position={[8, 0, 2]} /><Tree position={[3, 0, 3]} /><mesh position={[0, .03, -1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.2, 12]} /><meshStandardMaterial color="#d7b66f" /></mesh></> }
function Tree({ position }: { position: [number, number, number] }) { return <group position={position}><mesh position={[0, 1, 0]} castShadow><cylinderGeometry args={[.18, .28, 2, 8]} /><meshStandardMaterial color="#8b5e42" /></mesh><mesh position={[0, 2.2, 0]} castShadow><icosahedronGeometry args={[1.3, 1]} /><meshStandardMaterial color="#45a872" /></mesh><mesh position={[.55, 2.65, .1]} castShadow><icosahedronGeometry args={[.65, 1]} /><meshStandardMaterial color="#76c98a" /></mesh></group> }
