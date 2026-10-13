import React from 'react'

export default function HUD({progress, onTogglePause}:{progress:any, onTogglePause:()=>void}){
  return (
    <div className="hud">
      <div>Wonder Stars: {progress.stars}</div>
      <div>Quests: {progress.questsCompleted}</div>
      <button onClick={onTogglePause} aria-label="Pause">Pause</button>
    </div>
  )
}
