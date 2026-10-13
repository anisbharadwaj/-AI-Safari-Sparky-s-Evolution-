import { useRef, useState, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group, Mesh } from 'three'

type Props = { position: [number, number, number]; playerRef: MutableRefObject<Group | null>; onCollect: () => void }

export default function StarCollectible({ position, playerRef, onCollect }: Props) {
  const ref = useRef<Mesh>(null)
  const [collected, setCollected] = useState(false)
  useFrame((state, delta) => {
    if (!ref.current || collected) return
    ref.current.rotation.y += delta
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15
    const player = playerRef.current
    if (!player) return
    const dx = player.position.x - ref.current.position.x
    const dz = player.position.z - ref.current.position.z
    if (Math.sqrt(dx * dx + dz * dz) < 1) { setCollected(true); onCollect() }
  })
  if (collected) return null
  return <mesh ref={ref} position={position} castShadow><icosahedronGeometry args={[0.25, 1]} /><meshStandardMaterial color="#ffe066" emissive="#ffd24d" /></mesh>
}
