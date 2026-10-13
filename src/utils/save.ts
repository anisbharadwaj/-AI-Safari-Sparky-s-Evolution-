export type ZunoExpression = 'happy' | 'excited' | 'curious' | 'thinking' | 'surprised' | 'sad' | 'wink' | 'determined'
export type ZunoAccessory = 'none' | 'backpack' | 'glasses' | 'hat' | 'scarf' | 'wings' | 'crown' | 'space-suit' | 'winter'
export type ZunoEvolution = 1 | 3 | 5 | 7 | 10

export type ZunoCustomization = {
  expression: ZunoExpression
  accessory: ZunoAccessory
  evolution: ZunoEvolution
}

export type Progress = {
  stars: number
  questsCompleted: number
  xp: number
  unlockedWorlds: string[]
  aiMissionComplete: boolean
  zuno: ZunoCustomization
}

const STORAGE_KEY = 'wondoverse_progress_v3'
export const defaultZuno: ZunoCustomization = { expression: 'curious', accessory: 'none', evolution: 1 }
const starterProgress: Progress = {
  stars: 0,
  questsCompleted: 0,
  xp: 0,
  unlockedWorlds: ['Wonder Meadow'],
  aiMissionComplete: false,
  zuno: defaultZuno,
}

const expressions: ZunoExpression[] = ['happy', 'excited', 'curious', 'thinking', 'surprised', 'sad', 'wink', 'determined']
const accessories: ZunoAccessory[] = ['none', 'backpack', 'glasses', 'hat', 'scarf', 'wings', 'crown', 'space-suit', 'winter']
const evolutions: ZunoEvolution[] = [1, 3, 5, 7, 10]

function isExpression(value: unknown): value is ZunoExpression { return typeof value === 'string' && expressions.includes(value as ZunoExpression) }
function isAccessory(value: unknown): value is ZunoAccessory { return typeof value === 'string' && accessories.includes(value as ZunoAccessory) }
function isEvolution(value: unknown): value is ZunoEvolution { return typeof value === 'number' && evolutions.includes(value as ZunoEvolution) }

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return starterProgress
    const parsed: Partial<Progress> & { zuno?: Partial<ZunoCustomization> } = JSON.parse(raw)
    const savedZuno = parsed.zuno ?? {}
    return {
      ...starterProgress,
      ...parsed,
      unlockedWorlds: Array.isArray(parsed.unlockedWorlds) ? parsed.unlockedWorlds : starterProgress.unlockedWorlds,
      zuno: {
        expression: isExpression(savedZuno.expression) ? savedZuno.expression : defaultZuno.expression,
        accessory: isAccessory(savedZuno.accessory) ? savedZuno.accessory : defaultZuno.accessory,
        evolution: isEvolution(savedZuno.evolution) ? savedZuno.evolution : defaultZuno.evolution,
      },
    }
  } catch {
    return starterProgress
  }
}

export function saveProgress(progress: Progress): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch { /* Local saving is best-effort. */ }
}

export function resetProgress(): Progress { return { ...starterProgress, zuno: { ...defaultZuno } } }
export function getRank(xp: number): string {
  if (xp >= 900) return 'AI Architect'
  if (xp >= 600) return 'Model Trainer'
  if (xp >= 300) return 'AI Apprentice'
  if (xp >= 100) return 'Pattern Finder'
  return 'Curious Explorer'
}
