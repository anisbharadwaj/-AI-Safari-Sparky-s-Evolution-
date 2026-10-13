import { getRank, type Progress } from '../utils/save'

type Props = { progress: Progress; paused: boolean; onTogglePause: () => void; onOpenMap: () => void }

export default function HUD({ progress, paused, onTogglePause, onOpenMap }: Props) {
  const levelProgress = Math.min(100, (progress.xp % 100) || (progress.xp ? 100 : 0))
  return <aside className="hud" aria-label="Adventure progress">
    <div className="hud-heading"><div><div className="eyebrow">WONDER MEADOW</div><strong>{getRank(progress.xp)}</strong></div><span className="hud-stars">✦ {progress.stars}</span></div>
    <div className="xp-row"><span>Experience</span><span>{progress.xp} XP</span></div>
    <div className="progress-track"><i style={{ width: `${levelProgress}%` }} /></div>
    <div className="quest-line"><span>Active mission</span><b>{progress.aiMissionComplete ? 'First model · Complete' : 'Teach Zuno to see patterns'}</b></div>
    <div className="hud-actions"><button className="text-button" onClick={onOpenMap}>World map</button><button className="text-button" onClick={onTogglePause}>{paused ? 'Resume' : 'Pause'}</button></div>
  </aside>
}
