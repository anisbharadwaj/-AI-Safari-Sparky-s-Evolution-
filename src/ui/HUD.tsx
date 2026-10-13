import type { Progress } from '../utils/save'

export default function HUD({ progress, paused, onTogglePause }: { progress: Progress; paused: boolean; onTogglePause: () => void }) {
  return <aside className="hud" aria-label="Adventure progress"><div className="eyebrow">WONDER MEADOW</div><div className="hud-row"><span>Wonder Stars</span><span className="hud-stars">✦ {progress.stars}</span></div><div className="quest-line"><span>Current quest</span><b>{progress.questsCompleted ? 'Restore the Wonder Core · Complete' : 'Restore the Wonder Core'}</b></div><button className="text-button" onClick={onTogglePause}>{paused ? 'Resume adventure' : 'Pause adventure'}</button></aside>
}
