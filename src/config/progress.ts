import type { Level } from './levels'

/**获取已完成关卡ID列表 */
export function getCompleted(): string[] {
  const s = localStorage.getItem('tm_completed')
  if (!s) return []
  try {
    const ids = JSON.parse(s)
    if (Array.isArray(ids)) return ids as string[]
    return []
  } catch {
    return []
  }
}

/**设置关卡为已完成 */
export function setCompleted(id: string) {
  const ids = new Set(getCompleted())
  ids.add(id)
  localStorage.setItem('tm_completed', JSON.stringify(Array.from(ids)))
}

/**判断是否全部完成 */
export function isAllCompleted(lvs: Level[]): boolean {
  const done = new Set(getCompleted())
  for (const lv of lvs) {
    if (!done.has(lv.id)) return false
  }
  return true
}

/**获取下一个未完成关卡ID */
export function getNextIncomplete(currentId: string, lvs: Level[]): string | undefined {
  const done = new Set(getCompleted())
  const i = lvs.findIndex(o => o.id === currentId)
  if (i === -1) {
    // 未找到当前关卡，返回第一个未完成的关卡
    for (const lv of lvs) {
      if (!done.has(lv.id)) return lv.id
    }
    return undefined
  }
  // 从当前之后查找未完成关卡
  for (let k = i + 1; k < lvs.length; k++) {
    if (!done.has(lvs[k].id)) return lvs[k].id
  }
  // 若后续都完成，则从头开始查找剩余未完成
  for (let k = 0; k <= i; k++) {
    if (!done.has(lvs[k].id)) return lvs[k].id
  }
  return undefined
}

export type ScoreRecord = {
  score: number
  wpm: number
  accuracy: number
  backspace: number
  duration: number
  ts: number
}

function readScores(): Record<string, ScoreRecord> {
  const s = localStorage.getItem('tm_scores')
  if (!s) return {}
  try {
    const obj = JSON.parse(s)
    if (obj && typeof obj === 'object') return obj as Record<string, ScoreRecord>
    return {}
  } catch {
    return {}
  }
}

function writeScores(map: Record<string, ScoreRecord>) {
  localStorage.setItem('tm_scores', JSON.stringify(map))
}

export function setScore(id: string, rec: ScoreRecord) {
  const map = readScores()
  const prev = map[id]
  if (!prev || rec.score >= prev.score) {
    map[id] = rec
    writeScores(map)
  }
}

export function getScore(id: string): ScoreRecord | undefined {
  const map = readScores()
  return map[id]
}
