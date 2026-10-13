export type Progress = {
  stars: number
  questsCompleted: number
  level: number
  xp: number
  badges: string[]
}

const STORAGE_KEY = 'wondoverse_progress_v2'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { stars: 0, questsCompleted: 0, level: 1, xp: 0, badges: [] }
    const parsed = JSON.parse(raw)
    return {
      stars: typeof parsed.stars === 'number' ? parsed.stars : 0,
      questsCompleted: typeof parsed.questsCompleted === 'number' ? parsed.questsCompleted : 0,
      level: typeof parsed.level === 'number' ? parsed.level : 1,
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
    }
  } catch (error) {
    console.warn('Failed to load progress', error)
  }
  return { stars: 0, questsCompleted: 0, level: 1, xp: 0, badges: [] }
}

export function saveProgress(progress: Progress) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) } catch (error) { console.warn('Failed to save progress', error) }
}

export const xpForNextLevel = (level: number) => 80 + (level - 1) * 40

export function addXp(progress: Progress, amount: number): Progress {
  let xp = progress.xp + amount
  let level = progress.level
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level)
    level += 1
  }
  return { ...progress, xp, level }
}

export function resetProgress(): Progress { return { stars: 0, questsCompleted: 0, level: 1, xp: 0, badges: [] } }

export function awardBadge(progress: Progress, badge: string): Progress {
  return progress.badges.includes(badge) ? progress : { ...progress, badges: [...progress.badges, badge] }
}

export function progressPercent(progress: Progress) {
  return Math.min(100, Math.round((progress.xp / xpForNextLevel(progress.level)) * 100))
}

export function xpLabel(progress: Progress) { return `${progress.xp}/${xpForNextLevel(progress.level)} XP` }

export function levelTitle(level: number) {
  return ['Curious Sprout', 'Pattern Scout', 'Data Detective', 'Model Maker', 'AI Inventor'][Math.min(level - 1, 4)]
}

export function badgeLabel(badge: string) { return badge === 'pattern' ? 'Pattern Spotter' : badge === 'math' ? 'Number Navigator' : badge }

export function nextLesson(progress: Progress) {
  return progress.questsCompleted === 0 ? 'Teach a pattern' : progress.questsCompleted === 1 ? 'Sort the data' : 'Build a smart helper'
}

export function questDescription(progress: Progress) {
  return progress.questsCompleted === 0 ? 'Show Sparky examples so it can learn.' : progress.questsCompleted === 1 ? 'Help Sparky find the rule in a dataset.' : 'Create a mini AI helper from your ideas.'
}

export function markLessonComplete(progress: Progress, lesson: string): Progress {
  const next = addXp({ ...progress, questsCompleted: Math.max(progress.questsCompleted, 1) }, 40)
  return lesson === 'pattern' ? awardBadge(next, 'pattern') : lesson === 'math' ? awardBadge(next, 'math') : next
}

export function addStar(progress: Progress): Progress { return addXp({ ...progress, stars: progress.stars + 1 }, 5) }

export function hasCompleted(progress: Progress, badge: string) { return progress.badges.includes(badge) }
