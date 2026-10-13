import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import type { ZunoAccessory, ZunoCustomization } from '../utils/save'

type Props = { paused: boolean; zuno: ZunoCustomization; playerRef: MutableRefObject<Group | null>; onStartMath: () => void; onStartAI: () => void }

export default function Player({ paused, zuno, playerRef, onStartMath, onStartAI }: Props) {
  const velocity = useRef(new Vector3())
  const keys = useRef<Record<string, boolean>>({})
  const frontLeftLeg = useRef<Group>(null)
  const frontRightLeg = useRef<Group>(null)
  const backLeftLeg = useRef<Group>(null)
  const backRightLeg = useRef<Group>(null)
  const tail = useRef<Group>(null)
  const ears = useRef<Group>(null)
  const { camera, gl } = useThree()
  const cameraTarget = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      keys.current[key] = true
      if (key === 'e') onStartMath()
      if (key === 'q') onStartAI()
    }
    const up = (event: KeyboardEvent) => { keys.current[event.key.toLowerCase()] = false }
    const moveCamera = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = gl.domElement.getBoundingClientRect()
      cameraTarget.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      cameraTarget.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    gl.domElement.addEventListener('pointermove', moveCamera)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      gl.domElement.removeEventListener('pointermove', moveCamera)
    }
  }, [gl, onStartAI, onStartMath])

  useFrame((state, delta) => {
    const player = playerRef.current
    if (!player) return
    const moving = !paused && Boolean(keys.current.w || keys.current.a || keys.current.s || keys.current.d || keys.current.arrowup || keys.current.arrowdown || keys.current.arrowleft || keys.current.arrowright)
    if (!paused) {
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
      player.rotation.y = Math.atan2(velocity.current.x, Math.max(0.01, velocity.current.z)) * 0.18
    }

    const time = state.clock.elapsedTime
    const stride = moving ? Math.sin(time * 13) * 0.42 : Math.sin(time * 2.4) * 0.04
    const bob = moving ? Math.abs(Math.sin(time * 13)) * 0.035 : Math.sin(time * 2.4) * 0.025
    if (player.position.y <= 0.46) player.position.y = 0.42 + bob
    if (frontLeftLeg.current) frontLeftLeg.current.rotation.x = stride
    if (backRightLeg.current) backRightLeg.current.rotation.x = stride
    if (frontRightLeg.current) frontRightLeg.current.rotation.x = -stride
    if (backLeftLeg.current) backLeftLeg.current.rotation.x = -stride
    if (tail.current) { tail.current.rotation.z = Math.sin(time * 3.5) * 0.12; tail.current.rotation.y = Math.sin(time * 2.2) * 0.16 }
    if (ears.current) ears.current.rotation.z = Math.sin(time * 2.1) * 0.035

    const target = new Vector3(player.position.x, player.position.y + 1.05, player.position.z)
    const cameraPosition = new Vector3(player.position.x + 5.8 + cameraTarget.current.x * 1.6, player.position.y + 4.2 + cameraTarget.current.y * 0.7, player.position.z + 7.3)
    camera.position.lerp(cameraPosition, Math.min(delta * 4.5, 1))
    camera.lookAt(target)
  })

  const evolutionScale = zuno.evolution === 1 ? 0.92 : zuno.evolution === 3 ? 1 : zuno.evolution === 5 ? 1.06 : zuno.evolution === 7 ? 1.12 : 1.18
  const bodyColor = zuno.evolution >= 7 ? '#2f9ed0' : '#35bad0'
  const hornColor = zuno.evolution >= 5 ? '#ffd15e' : '#7d55e6'
  const eyeScale = zuno.expression === 'wink' ? [1, 0.18, 1] : zuno.expression === 'surprised' ? [1.18, 1.25, 1] : [1, 1, 1]
  return <group ref={playerRef} position={[0, 0.42, 1]} scale={evolutionScale}>
    <group ref={tail} position={[0, 0.54, 0.38]} rotation={[0.1, 0, 0.4]}>
      <mesh position={[0, 0, 0.28]} castShadow><sphereGeometry args={[0.29, 16, 12]} /><meshStandardMaterial color="#2c9fca" roughness={0.42} /></mesh>
      <mesh position={[0, 0.03, 0.63]} castShadow><sphereGeometry args={[0.25, 16, 12]} /><meshStandardMaterial color="#7f5be1" roughness={0.35} /></mesh>
      <mesh position={[0, 0.06, 0.9]} castShadow><coneGeometry args={[0.24, 0.55, 8]} /><meshStandardMaterial color="#ff75c8" emissive="#762a74" /></mesh>
    </group>
    <mesh position={[0, 0.66, 0]} castShadow><sphereGeometry args={[0.48, 24, 18]} /><meshStandardMaterial color={bodyColor} roughness={0.34} metalness={0.1} /></mesh>
    <mesh position={[0, 0.78, -0.24]} castShadow><sphereGeometry args={[0.41, 24, 18]} /><meshStandardMaterial color="#a2eff2" roughness={0.28} /></mesh>
    <mesh position={[0, 0.75, -0.6]} castShadow><sphereGeometry args={[0.3, 20, 14]} /><meshStandardMaterial color="#d5fbfa" roughness={0.25} /></mesh>
    <mesh position={[0, 0.69, -0.83]}><sphereGeometry args={[0.08, 12, 8]} /><meshStandardMaterial color="#183c73" /></mesh>
    <group ref={ears} position={[0, 1.05, -0.25]}>
      <mesh position={[-0.3, 0.19, 0]} rotation={[0, 0, -0.26]} castShadow><coneGeometry args={[0.23, 0.66, 5]} /><meshStandardMaterial color={bodyColor} /></mesh>
      <mesh position={[-0.3, 0.18, -0.02]} rotation={[0, 0, -0.26]}><coneGeometry args={[0.12, 0.4, 5]} /><meshStandardMaterial color="#ff8bc5" emissive="#54225d" /></mesh>
      <mesh position={[0.3, 0.19, 0]} rotation={[0, 0, 0.26]} castShadow><coneGeometry args={[0.23, 0.66, 5]} /><meshStandardMaterial color={bodyColor} /></mesh>
      <mesh position={[0.3, 0.18, -0.02]} rotation={[0, 0, 0.26]}><coneGeometry args={[0.12, 0.4, 5]} /><meshStandardMaterial color="#ff8bc5" emissive="#54225d" /></mesh>
    </group>
    <mesh position={[0, 1.22, -0.2]} rotation={[0, 0, 0.05]}><coneGeometry args={[0.14, 0.34, 5]} /><meshStandardMaterial color={hornColor} emissive={hornColor} emissiveIntensity={0.35} /></mesh>
    <mesh position={[-0.16, 0.82, -0.84]} scale={eyeScale}><sphereGeometry args={[0.07, 12, 8]} /><meshStandardMaterial color="#1d3774" emissive="#8debf3" /></mesh>
    <mesh position={[0.16, 0.82, -0.84]} scale={zuno.expression === 'wink' ? [1, 1, 1] : eyeScale}><sphereGeometry args={[0.07, 12, 8]} /><meshStandardMaterial color="#1d3774" emissive="#8debf3" /></mesh>
    <mesh position={[-0.16, 0.82, -0.89]}><sphereGeometry args={[0.026, 8, 6]} /><meshStandardMaterial color="#fff5bf" emissive="#fff5bf" /></mesh>
    <mesh position={[0.16, 0.82, -0.89]}><sphereGeometry args={[0.026, 8, 6]} /><meshStandardMaterial color="#fff5bf" emissive="#fff5bf" /></mesh>
    <mesh position={[0, 0.71, -0.91]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} /><meshStandardMaterial color={zuno.expression === 'sad' ? '#6da7e8' : '#ec68b7'} emissive={zuno.expression === 'sad' ? '#31558d' : '#9b318b'} /></mesh>
    <mesh position={[0, 0.58, -0.53]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.025, 8, 16]} /><meshStandardMaterial color="#ffdc63" emissive="#bb7b23" /></mesh>
    <mesh position={[0, 0.58, -0.57]}><octahedronGeometry args={[0.09, 0]} /><meshStandardMaterial color="#fff0a0" emissive="#ffb62d" /></mesh>
    <group ref={frontLeftLeg} position={[-0.29, 0.35, -0.26]}><mesh castShadow><capsuleGeometry args={[0.12, 0.34, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.2, -0.08]} castShadow><sphereGeometry args={[0.17, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <group ref={frontRightLeg} position={[0.29, 0.35, -0.26]}><mesh castShadow><capsuleGeometry args={[0.12, 0.34, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.2, -0.08]} castShadow><sphereGeometry args={[0.17, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <group ref={backLeftLeg} position={[-0.3, 0.3, 0.22]}><mesh castShadow><capsuleGeometry args={[0.14, 0.38, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.21, -0.05]} castShadow><sphereGeometry args={[0.18, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <group ref={backRightLeg} position={[0.3, 0.3, 0.22]}><mesh castShadow><capsuleGeometry args={[0.14, 0.38, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.21, -0.05]} castShadow><sphereGeometry args={[0.18, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <mesh position={[-0.48, 0.61, -0.1]} rotation={[0, 0, -0.45]} castShadow><capsuleGeometry args={[0.1, 0.34, 8, 12]} /><meshStandardMaterial color="#7d55e6" /></mesh>
    <mesh position={[0.48, 0.61, -0.1]} rotation={[0, 0, 0.45]} castShadow><capsuleGeometry args={[0.1, 0.34, 8, 12]} /><meshStandardMaterial color={hornColor} /></mesh>
    {zuno.evolution >= 7 && <mesh position={[0, 1.2, 0.1]}><torusGeometry args={[0.6, 0.025, 8, 24]} /><meshStandardMaterial color="#83f2f0" emissive="#36bec5" emissiveIntensity={1.2} transparent opacity={0.7} /></mesh>}
    <Accessories accessory={zuno.accessory} />
  </group>
}

function Accessories({ accessory }: { accessory: ZunoAccessory }) {
  if (accessory === 'backpack') return <group position={[0, 0.62, 0.45]}><mesh castShadow><boxGeometry args={[0.55, 0.72, 0.25]} /><meshStandardMaterial color="#714b9a" /></mesh><mesh position={[0, 0.1, -0.14]}><torusGeometry args={[0.16, 0.035, 8, 16]} /><meshStandardMaterial color="#ffcf69" /></mesh></group>
  if (accessory === 'glasses') return <group position={[0, 0.83, -0.91]}><mesh position={[-0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.105, 0.025, 8, 16]} /><meshStandardMaterial color="#ffcf69" metalness={0.6} /></mesh><mesh position={[0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.105, 0.025, 8, 16]} /><meshStandardMaterial color="#ffcf69" metalness={0.6} /></mesh><mesh position={[0, 0, 0]}><boxGeometry args={[0.08, 0.025, 0.025]} /><meshStandardMaterial color="#ffcf69" /></mesh></group>
  if (accessory === 'hat') return <group position={[0, 1.36, -0.2]}><mesh><cylinderGeometry args={[0.32, 0.4, 0.1, 16]} /><meshStandardMaterial color="#4d3a94" /></mesh><mesh position={[0, 0.28, 0]}><coneGeometry args={[0.25, 0.55, 16]} /><meshStandardMaterial color="#6953c5" /></mesh><mesh position={[0, 0.46, 0]}><octahedronGeometry args={[0.07, 0]} /><meshStandardMaterial color="#ffdb68" emissive="#d78d2c" /></mesh></group>
  if (accessory === 'scarf') return <mesh position={[0, 0.55, -0.31]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.39, 0.08, 10, 24]} /><meshStandardMaterial color="#ef709d" /></mesh>
  if (accessory === 'wings') return <group position={[0, 0.77, 0.3]}><mesh position={[-0.42, 0, 0]} rotation={[0, 0.5, -0.25]}><coneGeometry args={[0.3, 0.8, 5]} /><meshStandardMaterial color="#8ddfff" emissive="#339cb1" emissiveIntensity={0.7} transparent opacity={0.85} /></mesh><mesh position={[0.42, 0, 0]} rotation={[0, -0.5, 0.25]}><coneGeometry args={[0.3, 0.8, 5]} /><meshStandardMaterial color="#d990ff" emissive="#8344a6" emissiveIntensity={0.7} transparent opacity={0.85} /></mesh></group>
  if (accessory === 'crown') return <group position={[0, 1.42, -0.2]}>{[-0.2, 0, 0.2].map((x, index) => <mesh key={x} position={[x, index === 1 ? 0.18 : 0.08, 0]}><coneGeometry args={[0.1, index === 1 ? 0.4 : 0.26, 4]} /><meshStandardMaterial color="#ffcf62" metalness={0.55} /></mesh>)}</group>
  if (accessory === 'space-suit') return <group position={[0, 0.7, 0]}><mesh scale={[1.08, 1.06, 1.03]}><sphereGeometry args={[0.5, 20, 14]} /><meshStandardMaterial color="#f2f3ff" transparent opacity={0.28} metalness={0.35} /></mesh><mesh position={[0, 0.82, -0.48]}><torusGeometry args={[0.16, 0.035, 8, 20]} /><meshStandardMaterial color="#6de5ed" emissive="#2eb5ca" /></mesh></group>
  if (accessory === 'winter') return <group><mesh position={[0, 1.42, -0.2]}><sphereGeometry args={[0.29, 16, 12]} /><meshStandardMaterial color="#f2f5ff" /></mesh><mesh position={[0, 0.55, -0.31]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.39, 0.08, 10, 24]} /><meshStandardMaterial color="#e9f4ff" /></mesh></group>
  return null
}
