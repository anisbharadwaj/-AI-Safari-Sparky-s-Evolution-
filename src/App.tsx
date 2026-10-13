import { useEffect, useState } from 'react'
import GameScene from './game/GameScene'
import HUD from './ui/HUD'
import { loadProgress, saveProgress, type Progress } from './utils/save'

type Activity = 'math' | 'ai' | null

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [paused, setPaused] = useState(true)
  const [activity, setActivity] = useState<Activity>(null)
  const [showMenu, setShowMenu] = useState(true)

  useEffect(() => saveProgress(progress), [progress])

  const startAdventure = () => { setShowMenu(false); setPaused(false) }
  const award = () => setProgress((current) => ({ ...current, questsCompleted: Math.max(current.questsCompleted, 1), stars: current.stars + 1 }))

  return (
    <div className="app-root">
      <GameScene paused={paused || showMenu} onCollectStar={() => setProgress((p) => ({ ...p, stars: p.stars + 1 }))} onStartMath={() => setActivity('math')} onStartAI={() => setActivity('ai')} />
      <div className="vignette" aria-hidden="true" />
      <header className="brand-bar">
        <div className="brand-mark"><span className="brand-orb">✦</span><div><strong>WondoVerse</strong><small>Play. Explore. Learn AI.</small></div></div>
        {!showMenu && <button className="icon-button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Resume game' : 'Pause game'}>{paused ? '▶' : 'Ⅱ'}</button>}
      </header>
      {!showMenu && <HUD progress={progress} paused={paused} onTogglePause={() => setPaused((p) => !p)} />}
      {!showMenu && <TouchControls />}
      {showMenu && <MainMenu progress={progress} onStart={startAdventure} />}
      {!showMenu && paused && !activity && <PausePanel onResume={() => setPaused(false)} onRestart={() => { setProgress({ stars: 0, questsCompleted: 0 }); setPaused(false) }} />}
      {activity === 'math' && <MathActivity onClose={() => setActivity(null)} onComplete={award} />}
      {activity === 'ai' && <AIActivity onClose={() => setActivity(null)} />}
    </div>
  )
}

function MainMenu({ progress, onStart }: { progress: Progress; onStart: () => void }) {
  return <main className="menu-screen"><div className="menu-card"><div className="menu-kicker">THE GREAT LEARNING ADVENTURE</div><h1>Wondo<span>Verse</span></h1><p className="tagline">A tiny world of big discoveries.</p><div className="wondo-avatar" aria-label="Wondo the WonderBot"><div className="avatar-antenna">✦</div><div className="avatar-face"><i /><i /></div><div className="avatar-smile">⌣</div></div><p className="welcome">“Hello, Explorer! Ready to discover something amazing?”</p><button className="primary-button" onClick={onStart}>Begin adventure <span>→</span></button><div className="menu-meta"><span>Wonder Meadow</span><span>{progress.stars} stars saved</span></div></div></main>
}

function PausePanel({ onResume, onRestart }: { onResume: () => void; onRestart: () => void }) {
  return <div className="overlay"><section className="panel pause-panel" role="dialog" aria-modal="true"><div className="panel-icon">Ⅱ</div><div className="eyebrow">ADVENTURE PAUSED</div><h2>Take a little breather</h2><p>Wondo is waiting in Wonder Meadow.</p><button className="primary-button" onClick={onResume}>Resume exploring</button><button className="text-button" onClick={onRestart}>Restart progress</button><div className="controls-note"><b>Move</b> WASD / arrows <b>Jump</b> Space <b>Interact</b> E</div></section></div>
}

function MathActivity({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [answer, setAnswer] = useState(''); const [feedback, setFeedback] = useState(''); const [done, setDone] = useState(false)
  const submit = () => { if (answer === '7') { setFeedback('Wonderful! 5 and 2 make 7.'); setDone(true); onComplete() } else setFeedback('Almost! Count the five stars, then add two more.') }
  return <div className="overlay"><section className="panel activity-panel" role="dialog" aria-modal="true"><div className="activity-top"><span className="subject-pill math-pill">NUMBER GROVE</span><button className="close-button" onClick={onClose} aria-label="Close activity">×</button></div><h2>Starry addition</h2><p>Wondo found five stars, then two more. How many stars altogether?</p><div className="star-row">{'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)} <b>+</b> {'★★'.split('').map((s, i) => <span key={i}>{s}</span>)}</div><div className="answer-row"><input value={answer} onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" maxLength={2} aria-label="Your answer" placeholder="?" /><button className="primary-button" onClick={submit}>{done ? 'Solved!' : 'Check answer'}</button></div>{feedback && <p className={done ? 'feedback success' : 'feedback'}>{feedback}</p>}<button className="hint-button" onClick={() => setFeedback('Hint: count all the stars in both groups.')}>Need a hint?</button></section></div>
}

function AIActivity({ onClose }: { onClose: () => void }) {
  const [trained, setTrained] = useState<string[]>([]); const [prediction, setPrediction] = useState('')
  const train = (shape: string) => setTrained((items) => items.includes(shape) ? items : [...items, shape])
  const test = (shape: string) => setPrediction(trained.includes(shape) ? `Wondo predicts: ${shape}!` : 'Wondo needs another example.')
  return <div className="overlay"><section className="panel activity-panel ai-panel" role="dialog" aria-modal="true"><div className="activity-top"><span className="subject-pill ai-pill">AI EXPERIMENT STATION</span><button className="close-button" onClick={onClose} aria-label="Close activity">×</button></div><h2>Teach Wondo patterns</h2><p>Give Wondo examples first. Then test a new shape. This is a simplified rule-based simulation.</p><div className="shape-grid"><button className="shape-card circle" onClick={() => train('circle')} aria-label="Train circle"><span>●</span><small>Train circle</small></button><button className="shape-card square" onClick={() => train('square')} aria-label="Train square"><span>■</span><small>Train square</small></button><button className="shape-card triangle" onClick={() => train('triangle')} aria-label="Train triangle"><span>▲</span><small>Train triangle</small></button></div><div className="training-status"><span>Examples learned: <b>{trained.length}</b>/3</span><div className="progress-track"><i style={{ width: `${trained.length * 33.33}%` }} /></div></div><div className="test-row">{['circle', 'square', 'triangle'].map((shape) => <button key={shape} onClick={() => test(shape)}>Test {shape}</button>)}</div>{prediction && <p className="feedback success">{prediction}</p>}<button className="hint-button" onClick={() => setTrained([])}>Reset examples</button></section></div>
}

function TouchControls() {
  const press = (key: string, type: 'keydown' | 'keyup' = 'keydown') => window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }))
  return <div className="touch-controls" aria-label="Touch controls"><div className="dpad"><button onTouchStart={() => press('ArrowLeft')} onTouchEnd={() => press('ArrowLeft', 'keyup')} aria-label="Move left">←</button><button onTouchStart={() => press('ArrowUp')} onTouchEnd={() => press('ArrowUp', 'keyup')} aria-label="Move forward">↑</button><button onTouchStart={() => press('ArrowDown')} onTouchEnd={() => press('ArrowDown', 'keyup')} aria-label="Move backward">↓</button><button onTouchStart={() => press('ArrowRight')} onTouchEnd={() => press('ArrowRight', 'keyup')} aria-label="Move right">→</button></div><button className="jump-button" onTouchStart={() => press(' ')} aria-label="Jump">JUMP</button></div>
}

