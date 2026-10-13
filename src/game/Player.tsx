import React, { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

export default function Player({paused,onStartMath,onStartAI}:{paused:boolean,onStartMath:()=>void,onStartAI:()=>void}){
  const ref = useRef<any>()
  const velocity = useRef(new Vector3())
  const speed = 3
  const jumpSpeed = 5
  const keys = useRef<Record<string,boolean>>({})
  const { camera } = useThree()

  useEffect(()=>{
    const handleKey = (e: KeyboardEvent)=>{
      if(e.type==='keydown') keys.current[e.key.toLowerCase()] = true
      else keys.current[e.key.toLowerCase()] = false

      if(e.key === 'e') onStartMath()
      if(e.key === 'q') onStartAI()
    }
    window.addEventListener('keydown', handleKey)
    window.addEventListener('keyup', handleKey)
    return ()=>{
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('keyup', handleKey)
    }
  },[])

  useFrame((state,delta)=>{
    if(paused) return
    const forward = (keys.current['w'] || keys.current['arrowup']) ? 1 : 0
    const back = (keys.current['s'] || keys.current['arrowdown']) ? 1 : 0
    const left = (keys.current['a'] || keys.current['arrowleft']) ? 1 : 0
    const right = (keys.current['d'] || keys.current['arrowright']) ? 1 : 0
    const jump = keys.current[' '] || keys.current['space']

    const moveZ = forward - back
    const moveX = right - left

    // simple acceleration
    velocity.current.x += moveX * speed * delta
    velocity.current.z += moveZ * speed * delta

    // apply damping
    velocity.current.x *= 0.8
    velocity.current.z *= 0.8

    // jump / gravity
    if(ref.current.position.y <= 0.3){
      // grounded
      if(jump){ velocity.current.y = jumpSpeed }
      else velocity.current.y = 0
    }
    velocity.current.y -= 9.8 * delta

    // integrate
    ref.current.position.x += velocity.current.x * delta
    ref.current.position.y += velocity.current.y * delta
    ref.current.position.z += velocity.current.z * delta

    // ground collision
    if(ref.current.position.y < 0.3){ ref.current.position.y = 0.3; velocity.current.y = 0 }

    // simple world boundaries
    ref.current.position.x = Math.max(-20, Math.min(20, ref.current.position.x))
    ref.current.position.z = Math.max(-20, Math.min(20, ref.current.position.z))

    // camera follow
    const camTarget = new Vector3(ref.current.position.x, ref.current.position.y + 1.2, ref.current.position.z)
    camera.position.lerp(new Vector3(ref.current.position.x + 4, ref.current.position.y + 3, ref.current.position.z + 6), 0.1)
    camera.lookAt(camTarget)
  })

  return (
    <group ref={ref} position={[0,0.3,0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.4,16,16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* antenna */}
      <mesh position={[0,0.6,0]}>
        <coneGeometry args={[0.08,0.2,8]} />
        <meshStandardMaterial color="#ffd24d" />
      </mesh>
    </group>
  )
}
