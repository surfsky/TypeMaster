import type { Level } from './levels'

export type ScoreRecord = {
  score: number
  wpm: number
  accuracy: number
  backspace: number
  duration: number
  ts: number
}

/**
 * 管理用户进度，包括已完成的关卡和分数
 */
export class ProgressManager {
  private static readonly COMPLETED_KEY = 'tm_completed'
  private static readonly SCORES_KEY = 'tm_scores'

  //------------------------------------------------------
  // 关卡完成情况管理
  //------------------------------------------------------

  /**
   * 获取已完成关卡的ID列表
   * @returns 已完成关卡ID的数组
   */
  public static getCompleted(): string[] {
    const s = localStorage.getItem(this.COMPLETED_KEY)
    if (!s) return []
    try {
      const ids = JSON.parse(s)
      if (Array.isArray(ids)) return ids as string[]
      return []
    } catch {
      return []
    }
  }

  /**
   * 将关卡标记为已完成
   * @param id 要标记为已完成的关卡ID
   */
  public static setCompleted(id: string): void {
    const ids = new Set(this.getCompleted())
    ids.add(id)
    localStorage.setItem(this.COMPLETED_KEY, JSON.stringify(Array.from(ids)))
  }

  /**
   * 检查是否所有提供的关卡都已完成
   * @param lvs 要检查的关卡数组
   * @returns 如果所有关卡都已完成则返回true，否则返回false
   */
  public static isAllCompleted(lvs: Level[]): boolean {
    const done = new Set(this.getCompleted())
    for (const lv of lvs) {
      if (!done.has(lv.id)) return false
    }
    return true
  }

  /**
   * 获取下一个未完成关卡的ID
   * @param currentId 当前关卡的ID
   * @param lvs 所有关卡的数组
   * @returns 下一个未完成关卡的ID，如果全部完成则返回undefined
   */
  public static getNextIncomplete(currentId: string, lvs: Level[]): string | undefined {
    const done = new Set(this.getCompleted())
    const i = lvs.findIndex(o => o.id === currentId)

    if (i === -1) {
      // 如果未找到当前关卡，则返回第一个未完成的关卡
      return lvs.find(lv => !done.has(lv.id))?.id
    }

    // 从当前关卡之后查找未完成的关卡
    for (let k = i + 1; k < lvs.length; k++) {
      if (!done.has(lvs[k].id)) return lvs[k].id
    }

    // 如果未找到，则从头开始查找
    for (let k = 0; k < i; k++) {
      if (!done.has(lvs[k].id)) return lvs[k].id
    }

    return undefined
  }

  //------------------------------------------------------
  // 分数管理
  //------------------------------------------------------

  /**
   * 从本地存储中读取所有分数
   * @returns 一个将关卡ID映射到分数记录的Record
   */
  private static readScores(): Record<string, ScoreRecord> {
    const s = localStorage.getItem(this.SCORES_KEY)
    if (!s) return {}
    try {
      const obj = JSON.parse(s)
      if (obj && typeof obj === 'object') return obj as Record<string, ScoreRecord>
      return {}
    } catch {
      return {}
    }
  }

  /**
   * 将所有分数写入本地存储
   * @param map 一个将关卡ID映射到分数记录的Record
   */
  private static writeScores(map: Record<string, ScoreRecord>): void {
    localStorage.setItem(this.SCORES_KEY, JSON.stringify(map))
  }

  /**
   * 设置关卡分数，仅当是新高分时保存
   * @param id 关卡ID
   * @param rec 要保存的分数记录
   */
  public static setScore(id: string, rec: ScoreRecord): void {
    const map = this.readScores()
    const prev = map[id]
    if (!prev || rec.score >= prev.score) {
      map[id] = rec
      this.writeScores(map)
    }
  }

  /**
   * 获取特定关卡的分数
   * @param id 关卡ID
   * @returns 分数记录，如果未找到分数则返回undefined
   */
  public static getScore(id: string): ScoreRecord | undefined {
    const map = this.readScores()
    return map[id]
  }
}
