import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function StarCollectible({position=[0,1,0], onCollect}:{position?:[number,number,number], onCollect:()=>void}){
  const ref = useRef<any>()
  const [collected, setCollected] = useState(false)

  useFrame((state,delta)=>{
    if(!ref.current) return
    ref.current.rotation.y += delta
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime*2)*0.15

    // simple proximity collect
    const player = state.scene.children.find(c=>c.type==='Group') as any
    if(player){
      const dx = player.position.x - ref.current.position.x
      const dz = player.position.z - ref.current.position.z
      const dist = Math.sqrt(dx*dx+dz*dz)
      if(dist < 1 && !collected){ setCollected(true); onCollect() }
    }
  })

  if(collected) return null

  return (
    <mesh ref={ref} position={position} castShadow>
      <icosahedronGeometry args={[0.25,0]} />
      <meshStandardMaterial color="#ffe066" emissive="#ffd24d" />
    </mesh>
  )
}
