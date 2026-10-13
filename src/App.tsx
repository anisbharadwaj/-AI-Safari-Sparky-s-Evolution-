import { useEffect, useState } from 'react'
import GameScene from './game/GameScene'
import HUD from './ui/HUD'
import CharacterGallery from './ui/CharacterGallery'
import { getRank, loadProgress, resetProgress, saveProgress, type Progress } from './utils/save'

type Activity = 'math' | 'ai' | null
type Panel = 'map' | 'install' | 'customize' | null
const worlds = [
  { name: 'Wonder Meadow', tone: 'meadow', state: 'available', detail: 'Explore, collect, and meet Zuno.' },
  { name: 'Numberland', tone: 'number', state: 'locked', detail: 'Unlock after 3 completed missions.' },
  { name: 'NatureQuest', tone: 'nature', state: 'locked', detail: 'Unlock after exploring the meadow.' },
  { name: 'AI Academy', tone: 'academy', state: 'available', detail: 'Train a model and discover how patterns work.' },
  { name: 'Creator Island', tone: 'creator', state: 'locked', detail: 'Build your first invention.' },
  { name: 'Language Lagoon', tone: 'lagoon', state: 'locked', detail: 'Stories, words, and floating libraries.' },
  { name: 'Space Discovery', tone: 'space', state: 'locked', detail: 'Chart the stars and visit new planets.' },
  { name: 'Logic Lab', tone: 'logic', state: 'locked', detail: 'Solve the final sequence challenge.' },
]

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [paused, setPaused] = useState(true)
  const [activity, setActivity] = useState<Activity>(null)
  const [panel, setPanel] = useState<Panel>(null)
  const [showMenu, setShowMenu] = useState(true)
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => saveProgress(progress), [progress])
  useEffect(() => {
    const onInstall = (event: Event) => { event.preventDefault(); setInstallEvent(event as BeforeInstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', onInstall)
    return () => window.removeEventListener('beforeinstallprompt', onInstall)
  }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && !showMenu) setPaused(true) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showMenu])

  const startAdventure = () => { setShowMenu(false); setPaused(false) }
  const openActivity = (next: Activity) => { setActivity(next); setPaused(true) }
  const collectStar = () => setProgress((current) => ({ ...current, stars: current.stars + 1, xp: current.xp + 10 }))
  const completeMath = () => setProgress((current) => ({ ...current, questsCompleted: Math.max(current.questsCompleted, 1), stars: current.stars + 1, xp: current.xp + 50 }))
  const completeAI = () => setProgress((current) => ({ ...current, questsCompleted: Math.max(current.questsCompleted, 2), stars: current.stars + 2, xp: current.xp + 150, aiMissionComplete: true }))
  const closeActivity = () => { setActivity(null); setPaused(false) }
  const install = async () => { if (!installEvent) return; await installEvent.prompt(); setInstallEvent(null) }

  return <div className="app-root">
    <GameScene paused={paused || showMenu || Boolean(activity || panel)} zuno={progress.zuno} onCollectStar={collectStar} onStartMath={() => openActivity('math')} onStartAI={() => openActivity('ai')} />
    <div className="vignette" aria-hidden="true" />
    <header className="brand-bar"><div className="brand-mark"><span className="brand-orb">✦</span><div><strong>WondoVerse</strong><small>Play. Discover. Create AI.</small></div></div>{!showMenu && <button className="icon-button" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume game' : 'Pause game'}>{paused ? '▶' : 'Ⅱ'}</button>}</header>
    {!showMenu && <HUD progress={progress} paused={paused} onTogglePause={() => setPaused((value) => !value)} onOpenMap={() => { setPanel('map'); setPaused(true) }} onOpenCharacter={() => { setPanel('customize'); setPaused(true) }} />}
    {!showMenu && <TouchControls />}
    {showMenu && <MainMenu progress={progress} onStart={startAdventure} onOpenMap={() => setPanel('map')} onOpenInstall={() => setPanel('install')} onOpenCharacter={() => setPanel('customize')} />}
    {!showMenu && paused && !activity && !panel && <PausePanel onResume={() => setPaused(false)} onRestart={() => { setProgress(resetProgress()); setPaused(false) }} />}
    {activity === 'math' && <MathActivity onClose={closeActivity} onComplete={completeMath} />}
    {activity === 'ai' && <AIActivity onClose={closeActivity} onComplete={completeAI} completed={progress.aiMissionComplete} />}
    {panel === 'map' && <WorldMap progress={progress} onClose={() => { setPanel(null); setPaused(false) }} />}
    {panel === 'install' && <InstallPanel canInstall={Boolean(installEvent)} onInstall={install} onClose={() => setPanel(null)} />}
    {panel === 'customize' && <CharacterGallery value={progress.zuno} xp={progress.xp} onChange={(zuno) => setProgress((current) => ({ ...current, zuno }))} onClose={() => { setPanel(null); setPaused(false) }} />}
    {!showMenu && <button className="install-chip" onClick={() => setPanel('install')} aria-label="Install WondoVerse">Install game</button>}
  </div>
}

type MenuProps = { progress: Progress; onStart: () => void; onOpenMap: () => void; onOpenInstall: () => void; onOpenCharacter: () => void }
function MainMenu({ progress, onStart, onOpenMap, onOpenInstall, onOpenCharacter }: MenuProps) {
  return <main className="menu-screen"><div className="menu-card"><div className="menu-kicker">THE GREAT LEARNING ADVENTURE</div><h1>Wondo<span>Verse</span></h1><p className="tagline">A living world where curiosity becomes capability.</p><div className="wondo-avatar" aria-label="Zuno the AI learning companion"><div className="avatar-antenna">✦</div><div className="avatar-face"><i /><i /></div><div className="avatar-smile">⌣</div><span className="avatar-badge">ZUNO</span></div><p className="welcome">Meet Zuno, your curious companion. Explore Wonder Meadow, collect stars, and teach a tiny model how to recognise patterns.</p><div className="menu-actions"><button className="primary-button" onClick={onStart}>{progress.xp ? 'Continue adventure' : 'Begin adventure'} <span>→</span></button><button className="secondary-button" onClick={onOpenMap}>View world map</button><button className="secondary-button" onClick={onOpenCharacter}>Style Zuno</button></div><div className="menu-meta"><span>{getRank(progress.xp)}</span><span>{progress.xp} XP</span><button onClick={onOpenInstall}>Install to device</button></div></div></main>
}

function PausePanel({ onResume, onRestart }: { onResume: () => void; onRestart: () => void }) { return <div className="overlay"><section className="panel pause-panel" role="dialog" aria-modal="true"><div className="panel-icon">Ⅱ</div><div className="eyebrow">ADVENTURE PAUSED</div><h2>Take a little breather</h2><p>Zuno is waiting in Wonder Meadow.</p><button className="primary-button" onClick={onResume}>Resume exploring</button><button className="text-button" onClick={onRestart}>Restart progress</button><div className="controls-note"><b>Move</b> WASD / arrows <b>Jump</b> Space <b>Interact</b> E / Q</div></section></div> }

function MathActivity({ onClose, onComplete }: { onClose: () => void; onComplete: () => void }) {
  const [answer, setAnswer] = useState(''); const [feedback, setFeedback] = useState(''); const [done, setDone] = useState(false)
  const submit = () => { if (answer === '7') { setFeedback('Wonderful. A dataset can start with simple labelled examples.'); setDone(true); onComplete() } else setFeedback('Almost. Count five stars, then add two more.') }
  return <div className="overlay"><section className="panel activity-panel" role="dialog" aria-modal="true"><div className="activity-top"><span className="subject-pill math-pill">NUMBER GROVE</span><button className="close-button" onClick={onClose} aria-label="Close activity">×</button></div><h2>Starry addition</h2><p>Zuno found five stars, then two more. How many stars altogether?</p><div className="star-row">★★★★★ <b>+</b> ★★</div><div className="answer-row"><input value={answer} onChange={(event) => setAnswer(event.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" maxLength={2} aria-label="Your answer" placeholder="?" /><button className="primary-button" onClick={submit}>{done ? 'Solved' : 'Check answer'}</button></div>{feedback && <p className={done ? 'feedback success' : 'feedback'}>{feedback}</p>}<button className="hint-button" onClick={() => setFeedback('Hint: count all the stars in both groups.')}>Need a hint?</button></section></div>
}

function AIActivity({ onClose, onComplete, completed }: { onClose: () => void; onComplete: () => void; completed: boolean }) {
  const [trained, setTrained] = useState<string[]>([]); const [prediction, setPrediction] = useState(''); const [tested, setTested] = useState<string[]>([])
  const train = (shape: string) => setTrained((items) => items.includes(shape) ? items : [...items, shape])
  const test = (shape: string) => { setTested((items) => items.includes(shape) ? items : [...items, shape]); setPrediction(trained.includes(shape) ? `Prediction: ${shape} · confidence 92%` : 'Prediction uncertain. Add a labelled example first.') }
  const finished = trained.length === 3 && tested.length === 3
  return <div className="overlay"><section className="panel activity-panel ai-panel" role="dialog" aria-modal="true"><div className="activity-top"><span className="subject-pill ai-pill">AI ACADEMY · VISION LAB</span><button className="close-button" onClick={onClose} aria-label="Close activity">×</button></div><div className="mission-title"><div><div className="eyebrow">MISSION 01 / PATTERN RECOGNITION</div><h2>Teach Zuno to see</h2></div><span className="mission-reward">+150 XP</span></div><p>Build a tiny training set by labelling examples. Then test each unseen shape. This is a transparent rule-based simulation, not a neural network.</p><div className="lesson-steps"><span className={trained.length ? 'active' : ''}>1 · Label</span><span className={trained.length === 3 ? 'active' : ''}>2 · Train</span><span className={tested.length === 3 ? 'active' : ''}>3 · Test</span></div><div className="shape-grid"><button className="shape-card circle" onClick={() => train('circle')}><span>●</span><small>Label circle</small></button><button className="shape-card square" onClick={() => train('square')}><span>■</span><small>Label square</small></button><button className="shape-card triangle" onClick={() => train('triangle')}><span>▲</span><small>Label triangle</small></button></div><div className="training-status"><span>Training examples <b>{trained.length}</b>/3</span><div className="progress-track"><i style={{ width: `${trained.length * 33.33}%` }} /></div></div><div className="test-row">{['circle', 'square', 'triangle'].map((shape) => <button key={shape} onClick={() => test(shape)}>Test {shape}</button>)}</div>{prediction && <p className={prediction.includes('92%') ? 'feedback success' : 'feedback'}>{prediction}</p>}{finished && !completed && <button className="primary-button full-button" onClick={onComplete}>Save mission reward</button>}{completed && <p className="feedback success">Mission complete. Zuno is getting better at spotting patterns.</p>}<button className="hint-button" onClick={() => { setTrained([]); setTested([]); setPrediction('') }}>Reset examples</button></section></div>
}

function WorldMap({ progress, onClose }: { progress: Progress; onClose: () => void }) { return <div className="overlay"><section className="panel map-panel" role="dialog" aria-modal="true"><div className="activity-top"><div><div className="eyebrow">WORLD ATLAS</div><h2>Choose a discovery</h2></div><button className="close-button" onClick={onClose} aria-label="Close world map">×</button></div><div className="world-grid">{worlds.map((world) => <article className={`world-card ${world.tone} ${world.state}`} key={world.name}><div className="world-orb">{world.state === 'locked' ? '◇' : '✦'}</div><div><strong>{world.name}</strong><small>{world.detail}</small></div><span>{world.state === 'locked' ? 'LOCKED' : world.name === 'AI Academy' && progress.aiMissionComplete ? 'COMPLETE' : 'READY'}</span></article>)}</div><p className="map-note">Wonder Meadow and AI Academy are playable in this first chapter. The remaining regions already have a place in Zuno’s atlas and unlock as the adventure grows.</p><button className="primary-button full-button" onClick={onClose}>Return to meadow</button></section></div> }
function InstallPanel({ canInstall, onInstall, onClose }: { canInstall: boolean; onInstall: () => void; onClose: () => void }) { return <div className="overlay"><section className="panel install-panel" role="dialog" aria-modal="true"><div className="panel-icon">↥</div><div className="eyebrow">PLAY ANYWHERE</div><h2>Install WondoVerse</h2><p>{canInstall ? 'Add the game to your home screen for a focused, app-like experience with local progress.' : 'Your browser has not offered installation yet. On mobile, use the browser menu and choose “Add to home screen”.'}</p>{canInstall && <button className="primary-button full-button" onClick={onInstall}>Add to device</button>}<button className="text-button" onClick={onClose}>Keep playing in browser</button></section></div> }

function TouchControls() { const press = (key: string, type: 'keydown' | 'keyup' = 'keydown') => window.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true })); return <div className="touch-controls" aria-label="Touch controls"><div className="dpad"><button onTouchStart={() => press('ArrowLeft')} onTouchEnd={() => press('ArrowLeft', 'keyup')} aria-label="Move left">←</button><button onTouchStart={() => press('ArrowUp')} onTouchEnd={() => press('ArrowUp', 'keyup')} aria-label="Move forward">↑</button><button onTouchStart={() => press('ArrowDown')} onTouchEnd={() => press('ArrowDown', 'keyup')} aria-label="Move backward">↓</button><button onTouchStart={() => press('ArrowRight')} onTouchEnd={() => press('ArrowRight', 'keyup')} aria-label="Move right">→</button></div><button className="jump-button" onTouchStart={() => press(' ')} aria-label="Jump">JUMP</button></div> }

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> }
