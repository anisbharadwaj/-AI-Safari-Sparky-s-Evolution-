import React, { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sky, OrbitControls } from '@react-three/drei'
import Player from './Player'
import StarCollectible from './StarCollectible'

export default function GameScene({progress,onCollectStar,onStartMath,onStartAI,paused}:{progress:any,onCollectStar:()=>void,onStartMath:()=>void,onStartAI:()=>void,paused:boolean}){
  const [collected,setCollected] = useState(false)

  useEffect(()=>{
    if(collected){ onCollectStar(); setCollected(false) }
  },[collected])

  return (
    <Canvas shadows camera={{position:[0,5,8],fov:50}}>
      <ambientLight intensity={0.6} />
      <directionalLight castShadow position={[5,10,5]} intensity={0.8} />
      <Sky sunPosition={[100,20,100]} />
      <group position={[0,0,0]}>
        <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,-0.01,0]}>
          <planeGeometry args={[200,200]} />
          <meshStandardMaterial color="#7bd389" />
        </mesh>

        <mesh position={[0,0.2,-5]}>
          <boxGeometry args={[2,0.6,2]} />
          <meshStandardMaterial color="#8ad0ff" />
        </mesh>

        <Player paused={paused} onStartMath={onStartMath} onStartAI={onStartAI} />

        <StarCollectible position={[2,1,-2]} onCollect={()=>setCollected(true)} />
      </group>
      <OrbitControls enablePan={false} enableZoom={true} />
    </Canvas>
  )
}
