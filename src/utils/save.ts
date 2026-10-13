export type Progress = {
  stars: number
  questsCompleted: number
  xp: number
  unlockedWorlds: string[]
  aiMissionComplete: boolean
}

const STORAGE_KEY = 'wondoverse_progress_v2'
const starterProgress: Progress = {
  stars: 0,
  questsCompleted: 0,
  xp: 0,
  unlockedWorlds: ['Wonder Meadow'],
  aiMissionComplete: false,
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return starterProgress
    const parsed: Partial<Progress> = JSON.parse(raw)
    return {
      ...starterProgress,
      ...parsed,
      unlockedWorlds: Array.isArray(parsed.unlockedWorlds) ? parsed.unlockedWorlds : starterProgress.unlockedWorlds,
    }
  } catch {
    return starterProgress
  }
}

export function saveProgress(progress: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Local saving is best-effort so the lesson remains playable.
  }
}

export function resetProgress(): Progress {
  return { ...starterProgress }
}

export function getRank(xp: number): string {
  if (xp >= 900) return 'AI Architect'
  if (xp >= 600) return 'Model Trainer'
  if (xp >= 300) return 'AI Apprentice'
  if (xp >= 100) return 'Pattern Finder'
  return 'Curious Explorer'
}
