import type { ZunoAccessory, ZunoCustomization, ZunoEvolution, ZunoExpression } from '../utils/save'

type Props = { value: ZunoCustomization; xp: number; onChange: (value: ZunoCustomization) => void; onClose: () => void }
const expressionItems: { id: ZunoExpression; label: string; eyes: string }[] = [
  { id: 'happy', label: 'Happy', eyes: '◡ ◡' }, { id: 'excited', label: 'Excited', eyes: '^ ^' }, { id: 'curious', label: 'Curious', eyes: '• •' }, { id: 'thinking', label: 'Thinking', eyes: '◌ •' },
  { id: 'surprised', label: 'Surprised', eyes: 'O O' }, { id: 'sad', label: 'Sad', eyes: '╥ ╥' }, { id: 'wink', label: 'Wink', eyes: '• —' }, { id: 'determined', label: 'Determined', eyes: '▰ ▰' },
]
const accessoryItems: { id: ZunoAccessory; label: string; mark: string }[] = [
  { id: 'none', label: 'Everyday', mark: 'Z' }, { id: 'backpack', label: 'Backpack', mark: 'B' }, { id: 'glasses', label: 'Glasses', mark: 'G' }, { id: 'hat', label: 'Star hat', mark: 'H' }, { id: 'scarf', label: 'Scarf', mark: 'S' }, { id: 'wings', label: 'Wings', mark: 'W' }, { id: 'crown', label: 'Crown', mark: 'C' }, { id: 'space-suit', label: 'Space suit', mark: 'A' }, { id: 'winter', label: 'Winter', mark: 'I' },
]
const evolutionItems: { id: ZunoEvolution; label: string; detail: string }[] = [
  { id: 1, label: 'Base form', detail: 'Curious companion' }, { id: 3, label: 'Glow patterns', detail: 'Learner unlocked' }, { id: 5, label: 'Crystal horns', detail: 'Pattern finder' }, { id: 7, label: 'Wing upgrade', detail: 'AI apprentice' }, { id: 10, label: 'Legendary form', detail: 'AI architect' },
]

export default function CharacterGallery({ value, xp, onChange, onClose }: Props) {
  const update = (patch: Partial<ZunoCustomization>) => onChange({ ...value, ...patch })
  const maxEvolution: ZunoEvolution = xp >= 900 ? 10 : xp >= 630 ? 7 : xp >= 360 ? 5 : xp >= 180 ? 3 : 1
  return <div className="overlay"><section className="panel character-panel" role="dialog" aria-modal="true">
    <div className="activity-top"><div><div className="eyebrow">ZUNO CHARACTER STUDIO</div><h2>Make Zuno yours</h2></div><button className="close-button" onClick={onClose} aria-label="Close character studio">×</button></div>
    <div className="zuno-preview"><div className={`preview-zuno evolution-${value.evolution}`}><span className="preview-horn left" /><span className="preview-horn right" /><span className="preview-eye left">{value.expression === 'wink' ? '—' : '●'}</span><span className="preview-eye right">●</span><span className="preview-mark">◇</span><span className="preview-mouth">{value.expression === 'sad' ? '⌢' : value.expression === 'determined' ? '—' : '⌣'}</span><span className="preview-tail" /><span className="preview-accessory">{accessoryItems.find((item) => item.id === value.accessory)?.mark}</span></div><div><div className="eyebrow">CURRENT LOOK</div><strong>{evolutionItems.find((item) => item.id === value.evolution)?.label}</strong><p>{value.expression} · {accessoryItems.find((item) => item.id === value.accessory)?.label}</p></div></div>
    <div className="gallery-section"><div className="gallery-heading"><span>Expressions</span><small>How Zuno feels</small></div><div className="expression-grid">{expressionItems.map((item) => <button key={item.id} className={`expression-card ${value.expression === item.id ? 'selected' : ''}`} onClick={() => update({ expression: item.id })}><span className="expression-face"><i>{item.eyes}</i></span><small>{item.label}</small></button>)}</div></div>
    <div className="gallery-section"><div className="gallery-heading"><span>Accessories</span><small>Collect and style</small></div><div className="accessory-grid">{accessoryItems.map((item) => <button key={item.id} className={`accessory-card ${value.accessory === item.id ? 'selected' : ''}`} onClick={() => update({ accessory: item.id })}><span>{item.mark}</span><small>{item.label}</small></button>)}</div></div>
    <div className="gallery-section"><div className="gallery-heading"><span>Evolution stages</span><small>Earned with XP</small></div><div className="evolution-grid">{evolutionItems.map((item) => { const unlocked = maxEvolution >= item.id; return <button key={item.id} disabled={!unlocked} className={`evolution-card ${value.evolution === item.id ? 'selected' : ''} ${unlocked ? '' : 'locked'}`} onClick={() => update({ evolution: item.id })}><span className={`evolution-orb evolution-${item.id}`}>{unlocked ? item.id : '·'}</span><small>{item.label}</small><em>{unlocked ? item.detail : `Reach ${item.id * 90} XP`}</em></button> })}</div></div>
    <button className="primary-button full-button" onClick={onClose}>Use this design</button>
  </section></div>
}
