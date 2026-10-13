import React, { useEffect, useState } from 'react'
import GameScene from './game/GameScene'
import HUD from './ui/HUD'
import { loadProgress, saveProgress, Progress } from './utils/save'

export default function App(){
  const [progress, setProgress] = useState<Progress>(()=>loadProgress())
  const [paused, setPaused] = useState(false)
  const [showMath, setShowMath] = useState(false)
  const [showAI, setShowAI] = useState(false)

  useEffect(()=>{
    saveProgress(progress)
  },[progress])

  return (
    <div className="app-root">
      <header className="main-menu">
        <h1>WondoVerse: Wonder Meadow</h1>
        <button onClick={()=>setPaused(false)}>Play</button>
        <button onClick={()=>{setPaused(true)}}>Pause</button>
      </header>

      <main className="game-area">
        <GameScene
          progress={progress}
          onCollectStar={() => setProgress(p=>({...p, stars: p.stars+1}))}
          onStartMath={()=>setShowMath(true)}
          onStartAI={()=>setShowAI(true)}
          paused={paused}
        />
      </main>

      <HUD
        progress={progress}
        onTogglePause={()=>setPaused(p=>!p)}
      />

      {showMath && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h2>Math Activity</h2>
            <p>Solve to help restore the Wonder Core</p>
            <SimpleMath onComplete={() => { setShowMath(false); setProgress(p=>({...p, questsCompleted: p.questsCompleted+1})) }} />
            <button onClick={()=>setShowMath(false)}>Close</button>
          </div>
        </div>
      )}

      {showAI && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h2>AI Lab — Teach Wondo</h2>
            <SimpleAISim onClose={()=>setShowAI(false)} />
            <button onClick={()=>setShowAI(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  )
}

function SimpleMath({onComplete}:{onComplete:()=>void}){
  const [a] = useState(()=>Math.floor(Math.random()*5)+1)
  const [b] = useState(()=>Math.floor(Math.random()*5)+1)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string|null>(null)

  function submit(){
    if(parseInt(answer) === a+b){
      setFeedback('Correct!')
      setTimeout(()=>onComplete(),800)
    } else {
      setFeedback('Try again — remember to count the objects')
    }
  }

  return (
    <div>
      <p>How many stars? {a} + {b} = ?</p>
      <div style={{display:'flex',gap:8}}>
        <input value={answer} onChange={e=>setAnswer(e.target.value)} inputMode="numeric" aria-label="answer" />
        <button onClick={submit}>Submit</button>
      </div>
      {feedback && <p>{feedback}</p>}
    </div>
  )
}

function SimpleAISim({onClose}:{onClose:()=>void}){
  // Very small rule-based teaching simulation
  const [examples, setExamples] = useState<Array<{shape:'circle'|'square'|'triangle',label:string}>>([])
  const [mode, setMode] = useState<'teach'|'test'>('teach')
  const [lastPrediction, setLastPrediction] = useState<string|null>(null)

  function addExample(shape:'circle'|'square'|'triangle'){
    const label = prompt(`Label the ${shape} (e.g., A/B)`,'A') || 'A'
    setExamples(e=>[...e,{shape,label}])
  }

  function predict(shape:'circle'|'square'|'triangle'){
    // simple majority label among examples with same shape
    const same = examples.filter(e=>e.shape===shape)
    if(same.length===0){ setLastPrediction('Unknown — add examples'); return }
    const counts = same.reduce((acc,ex)=>{ acc[ex.label]=(acc[ex.label]||0)+1; return acc },{} as Record<string,number>)
    const winner = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0][0]
    setLastPrediction(`Predicted: ${winner}`)
  }

  return (
    <div>
      <p>Teach Wondo by labeling examples of shapes. Then switch to Test to see predictions.</p>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <button onClick={()=>addExample('circle')}>Add circle example</button>
        <button onClick={()=>addExample('square')}>Add square example</button>
        <button onClick={()=>addExample('triangle')}>Add triangle example</button>
        <button onClick={()=>setMode(m=>m==='teach'?'test':'teach')}>{mode==='teach'?'Switch to Test':'Switch to Teach'}</button>
      </div>
      <div style={{marginTop:8}}>
        <strong>Examples:</strong>
        <ul>
          {examples.map((ex,i)=>(<li key={i}>{ex.shape} → {ex.label}</li>))}
        </ul>
      </div>
      {mode==='test' && (
        <div>
          <p>Test prediction:</p>
          <button onClick={()=>predict('circle')}>Test circle</button>
          <button onClick={()=>predict('square')}>Test square</button>
          <button onClick={()=>predict('triangle')}>Test triangle</button>
          {lastPrediction && <p>{lastPrediction}</p>}
        </div>
      )}
    </div>
  )
}
