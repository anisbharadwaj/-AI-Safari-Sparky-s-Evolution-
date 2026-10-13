import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, Vector3 } from 'three'

type Props = { paused: boolean; playerRef: MutableRefObject<Group | null>; onStartMath: () => void; onStartAI: () => void }

export default function Player({ paused, playerRef, onStartMath, onStartAI }: Props) {
  const velocity = useRef(new Vector3())
  const keys = useRef<Record<string, boolean>>({})
  const { camera } = useThree()

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      keys.current[key] = true
      if (key === 'e') onStartMath()
      if (key === 'q') onStartAI()
    }
    const up = (event: KeyboardEvent) => { keys.current[event.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [onStartAI, onStartMath])

  useFrame((_, delta) => {
    const player = playerRef.current
    if (paused || !player) return
    const forward = Number(Boolean(keys.current.w || keys.current.arrowup)) - Number(Boolean(keys.current.s || keys.current.arrowdown))
    const strafe = Number(Boolean(keys.current.d || keys.current.arrowright)) - Number(Boolean(keys.current.a || keys.current.arrowleft))
    velocity.current.x += strafe * 7 * delta
    velocity.current.z += forward * 7 * delta
    velocity.current.x *= 0.84
    velocity.current.z *= 0.84
    if (player.position.y <= 0.42 && (keys.current[' '] || keys.current.space)) velocity.current.y = 6
    velocity.current.y -= 12 * delta
    player.position.x = Math.max(-14, Math.min(14, player.position.x + velocity.current.x * delta))
    player.position.z = Math.max(-14, Math.min(7, player.position.z + velocity.current.z * delta))
    player.position.y = Math.max(0.42, player.position.y + velocity.current.y * delta)
    if (player.position.y === 0.42) velocity.current.y = 0
    const target = new Vector3(player.position.x, player.position.y + 1, player.position.z)
    camera.position.lerp(new Vector3(player.position.x + 5.5, player.position.y + 4, player.position.z + 7), 0.08)
    camera.lookAt(target)
    player.rotation.y = Math.atan2(velocity.current.x, Math.max(0.01, velocity.current.z)) * 0.18
  })

  return <group ref={playerRef} position={[0, 0.42, 1]}>
    <mesh castShadow><capsuleGeometry args={[0.38, 0.55, 8, 16]} /><meshStandardMaterial color="#36bfd0" roughness={0.35} metalness={0.15} /></mesh>
    <mesh position={[0, 0.52, 0]} castShadow><sphereGeometry args={[0.42, 20, 14]} /><meshStandardMaterial color="#90e8ee" /></mesh>
    <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.09, 0.2, 5]} /><meshStandardMaterial color="#ffca56" emissive="#d88a24" /></mesh>
    <mesh position={[-0.15, 0.55, -0.36]}><sphereGeometry args={[0.08, 12, 8]} /><meshStandardMaterial color="#173e79" /></mesh>
    <mesh position={[0.15, 0.55, -0.36]}><sphereGeometry args={[0.08, 12, 8]} /><meshStandardMaterial color="#173e79" /></mesh>
    <mesh position={[0, 0.32, -0.39]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} /><meshStandardMaterial color="#ff75c8" emissive="#d33a9d" /></mesh>
    <mesh position={[0, 0.25, -0.4]}><octahedronGeometry args={[0.1, 0]} /><meshStandardMaterial color="#ffe36e" emissive="#ffb62d" /></mesh>
    <mesh position={[-0.48, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.11, 0.3, 6, 8]} /><meshStandardMaterial color="#8d5de8" /></mesh>
    <mesh position={[0.48, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.11, 0.3, 6, 8]} /><meshStandardMaterial color="#8d5de8" /></mesh>
  </group>
}
