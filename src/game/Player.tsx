import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, Vector3 } from 'three'

type Props = { paused: boolean; playerRef: MutableRefObject<Group | null>; onStartMath: () => void; onStartAI: () => void }

export default function Player({ paused, playerRef, onStartMath, onStartAI }: Props) {
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

  return <group ref={playerRef} position={[0, 0.42, 1]}>
    <group ref={tail} position={[0, 0.54, 0.38]} rotation={[0.1, 0, 0.4]}>
      <mesh position={[0, 0, 0.28]} castShadow><sphereGeometry args={[0.29, 16, 12]} /><meshStandardMaterial color="#2c9fca" roughness={0.42} /></mesh>
      <mesh position={[0, 0.03, 0.63]} castShadow><sphereGeometry args={[0.25, 16, 12]} /><meshStandardMaterial color="#7f5be1" roughness={0.35} /></mesh>
      <mesh position={[0, 0.06, 0.9]} castShadow><coneGeometry args={[0.24, 0.55, 8]} /><meshStandardMaterial color="#ff75c8" emissive="#762a74" /></mesh>
    </group>
    <mesh position={[0, 0.66, 0]} castShadow><sphereGeometry args={[0.48, 24, 18]} /><meshStandardMaterial color="#35bad0" roughness={0.34} metalness={0.1} /></mesh>
    <mesh position={[0, 0.78, -0.24]} castShadow><sphereGeometry args={[0.41, 24, 18]} /><meshStandardMaterial color="#a2eff2" roughness={0.28} /></mesh>
    <mesh position={[0, 0.75, -0.6]} castShadow><sphereGeometry args={[0.3, 20, 14]} /><meshStandardMaterial color="#d5fbfa" roughness={0.25} /></mesh>
    <mesh position={[0, 0.69, -0.83]}><sphereGeometry args={[0.08, 12, 8]} /><meshStandardMaterial color="#183c73" /></mesh>
    <group ref={ears} position={[0, 1.05, -0.25]}>
      <mesh position={[-0.3, 0.19, 0]} rotation={[0, 0, -0.26]} castShadow><coneGeometry args={[0.23, 0.66, 5]} /><meshStandardMaterial color="#2ec1d5" /></mesh>
      <mesh position={[-0.3, 0.18, -0.02]} rotation={[0, 0, -0.26]}><coneGeometry args={[0.12, 0.4, 5]} /><meshStandardMaterial color="#ff8bc5" emissive="#54225d" /></mesh>
      <mesh position={[0.3, 0.19, 0]} rotation={[0, 0, 0.26]} castShadow><coneGeometry args={[0.23, 0.66, 5]} /><meshStandardMaterial color="#2ec1d5" /></mesh>
      <mesh position={[0.3, 0.18, -0.02]} rotation={[0, 0, 0.26]}><coneGeometry args={[0.12, 0.4, 5]} /><meshStandardMaterial color="#ff8bc5" emissive="#54225d" /></mesh>
    </group>
    <mesh position={[0, 1.22, -0.2]} rotation={[0, 0, 0.05]}><coneGeometry args={[0.14, 0.34, 5]} /><meshStandardMaterial color="#7d55e6" emissive="#38206f" /></mesh>
    <mesh position={[-0.16, 0.82, -0.84]}><sphereGeometry args={[0.07, 12, 8]} /><meshStandardMaterial color="#1d3774" emissive="#8debf3" /></mesh>
    <mesh position={[0.16, 0.82, -0.84]}><sphereGeometry args={[0.07, 12, 8]} /><meshStandardMaterial color="#1d3774" emissive="#8debf3" /></mesh>
    <mesh position={[-0.16, 0.82, -0.89]}><sphereGeometry args={[0.026, 8, 6]} /><meshStandardMaterial color="#fff5bf" emissive="#fff5bf" /></mesh>
    <mesh position={[0.16, 0.82, -0.89]}><sphereGeometry args={[0.026, 8, 6]} /><meshStandardMaterial color="#fff5bf" emissive="#fff5bf" /></mesh>
    <mesh position={[0, 0.71, -0.91]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} /><meshStandardMaterial color="#ec68b7" emissive="#9b318b" /></mesh>
    <mesh position={[0, 0.58, -0.53]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.13, 0.025, 8, 16]} /><meshStandardMaterial color="#ffdc63" emissive="#bb7b23" /></mesh>
    <mesh position={[0, 0.58, -0.57]}><octahedronGeometry args={[0.09, 0]} /><meshStandardMaterial color="#fff0a0" emissive="#ffb62d" /></mesh>
    <group ref={frontLeftLeg} position={[-0.29, 0.35, -0.26]}><mesh castShadow><capsuleGeometry args={[0.12, 0.34, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.2, -0.08]} castShadow><sphereGeometry args={[0.17, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <group ref={frontRightLeg} position={[0.29, 0.35, -0.26]}><mesh castShadow><capsuleGeometry args={[0.12, 0.34, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.2, -0.08]} castShadow><sphereGeometry args={[0.17, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <group ref={backLeftLeg} position={[-0.3, 0.3, 0.22]}><mesh castShadow><capsuleGeometry args={[0.14, 0.38, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.21, -0.05]} castShadow><sphereGeometry args={[0.18, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <group ref={backRightLeg} position={[0.3, 0.3, 0.22]}><mesh castShadow><capsuleGeometry args={[0.14, 0.38, 8, 12]} /><meshStandardMaterial color="#258dbd" /></mesh><mesh position={[0, -0.21, -0.05]} castShadow><sphereGeometry args={[0.18, 14, 10]} /><meshStandardMaterial color="#ffd467" /></mesh></group>
    <mesh position={[-0.48, 0.61, -0.1]} rotation={[0, 0, -0.45]} castShadow><capsuleGeometry args={[0.1, 0.34, 8, 12]} /><meshStandardMaterial color="#7d55e6" /></mesh>
    <mesh position={[0.48, 0.61, -0.1]} rotation={[0, 0, 0.45]} castShadow><capsuleGeometry args={[0.1, 0.34, 8, 12]} /><meshStandardMaterial color="#7d55e6" /></mesh>
  </group>
}
