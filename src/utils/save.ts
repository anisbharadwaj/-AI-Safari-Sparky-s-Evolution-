export type Progress = {
  stars: number
  questsCompleted: number
}

const STORAGE_KEY = 'wondoverse_progress_v1'

export function loadProgress(): Progress{
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(!raw) return {stars:0,questsCompleted:0}
    const parsed = JSON.parse(raw)
    if(typeof parsed.stars === 'number' && typeof parsed.questsCompleted === 'number') return parsed
  }catch(e){ console.warn('Failed to load progress',e) }
  return {stars:0,questsCompleted:0}
}

export function saveProgress(p:Progress){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) }catch(e){ console.warn('Failed to save progress',e) }
}
