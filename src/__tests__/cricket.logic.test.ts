import { describe, expect, it } from 'vitest'
import {
  allClosed,
  buildRows,
  checkWinner,
  computeScores,
  getMarkState,
  getScoringHits,
  isClosed,
  isOpen,
  rowScore,
} from '@/games/cricket/logic'
import type { CricketRowState, CricketSettings } from '@/types/cricket'

const standard: CricketSettings = { numberSet: 'standard', scoreMode: 'cricket' }
const minnesota: CricketSettings = { numberSet: 'minnesota', scoreMode: 'cricket' }
const tactics: CricketSettings = { numberSet: 'tactics', scoreMode: 'cricket' }
const noScore: CricketSettings = { numberSet: 'standard', scoreMode: 'no-score' }

function findRow(rows: CricketRowState[], id: string): CricketRowState {
  const row = rows.find((r) => r.number.id === id)
  if (!row) throw new Error(`Missing row ${id}`)
  return row
}

describe('buildRows', () => {
  it('produces 7 rows in standard mode', () => {
    const rows = buildRows(standard)
    expect(rows).toHaveLength(7)
    expect(rows.map((r) => r.number.id)).toEqual(['20', '19', '18', '17', '16', '15', 'Bull'])
  })

  it('produces 19 rows in minnesota mode', () => {
    const rows = buildRows(minnesota)
    expect(rows).toHaveLength(7 + 6 + 6)
    expect(rows.map((r) => r.number.id)).toContain('D20')
    expect(rows.map((r) => r.number.id)).toContain('T15')
  })

  it('produces 9 rows in tactics mode', () => {
    const rows = buildRows(tactics)
    expect(rows).toHaveLength(9)
    expect(rows.map((r) => r.number.id)).toContain('Doubles')
    expect(rows.map((r) => r.number.id)).toContain('Triples')
  })

  it('Tactics Doubles and Triples have scoreValue 0', () => {
    const rows = buildRows(tactics)
    expect(findRow(rows, 'Doubles').number.scoreValue).toBe(0)
    expect(findRow(rows, 'Triples').number.scoreValue).toBe(0)
  })

  it('Bull has scoreValue 25', () => {
    const rows = buildRows(standard)
    expect(findRow(rows, 'Bull').number.scoreValue).toBe(25)
  })

  it('Doubles score 2x and Triples score 3x', () => {
    const rows = buildRows(minnesota)
    expect(findRow(rows, 'D20').number.scoreValue).toBe(40)
    expect(findRow(rows, 'T20').number.scoreValue).toBe(60)
  })

  it('starts every row at 0 hits for both sides', () => {
    const rows = buildRows(standard)
    for (const r of rows) {
      expect(r.left.hits).toBe(0)
      expect(r.right.hits).toBe(0)
    }
  })
})

describe('isOpen / isClosed', () => {
  it('isOpen is false below 3 hits, true at 3+', () => {
    const row = buildRows(standard)[0]
    expect(isOpen(row, 'left')).toBe(false)
    row.left.hits = 2
    expect(isOpen(row, 'left')).toBe(false)
    row.left.hits = 3
    expect(isOpen(row, 'left')).toBe(true)
    row.left.hits = 5
    expect(isOpen(row, 'left')).toBe(true)
  })

  it('isClosed only when both sides reach 3+', () => {
    const row = buildRows(standard)[0]
    row.left.hits = 3
    expect(isClosed(row)).toBe(false)
    row.right.hits = 2
    expect(isClosed(row)).toBe(false)
    row.right.hits = 3
    expect(isClosed(row)).toBe(true)
  })
})

describe('getScoringHits', () => {
  it('returns 0 when not yet open', () => {
    const row = buildRows(standard)[0]
    row.left.hits = 2
    expect(getScoringHits(row, 'left')).toBe(0)
  })

  it('returns 0 on the opening hit (#3) — opens but does not score', () => {
    const row = buildRows(standard)[0]
    row.left.hits = 3
    expect(getScoringHits(row, 'left')).toBe(0)
  })

  it('returns hits − 3 when open and opponent has not closed', () => {
    const row = buildRows(standard)[0]
    row.left.hits = 6
    expect(getScoringHits(row, 'left')).toBe(3)
  })

  it('retains scoring hits once opponent closes', () => {
    const row = buildRows(standard)[0]
    row.left.hits = 7
    row.right.hits = 3
    expect(getScoringHits(row, 'left')).toBe(4)
  })
})

describe('computeScores', () => {
  it('returns zeros in no-score mode regardless of state', () => {
    const rows = buildRows(noScore)
    const r = findRow(rows, '20')
    r.left.hits = 6
    expect(computeScores(rows, noScore)).toEqual({ left: 0, right: 0 })
  })

  it('scores a single open number correctly', () => {
    const rows = buildRows(standard)
    const r = findRow(rows, '20')
    r.left.hits = 5
    expect(computeScores(rows, standard)).toEqual({ left: 40, right: 0 })
  })

  it('Bull scoring uses 25 per scoring hit', () => {
    const rows = buildRows(standard)
    const r = findRow(rows, 'Bull')
    r.right.hits = 5
    expect(computeScores(rows, standard)).toEqual({ left: 0, right: 50 })
  })

  it('sums scores across multiple rows', () => {
    const rows = buildRows(standard)
    findRow(rows, '20').left.hits = 5 // +40
    findRow(rows, '19').left.hits = 4 // +19
    findRow(rows, 'Bull').right.hits = 4 // +25
    expect(computeScores(rows, standard)).toEqual({ left: 59, right: 25 })
  })

  it('retains score once opponent closes', () => {
    const rows = buildRows(standard)
    const r = findRow(rows, '20')
    r.left.hits = 5 // 2 scoring hits
    r.right.hits = 3 // closes the number
    expect(computeScores(rows, standard).left).toBe(40)
  })
})

describe('rowScore', () => {
  it('returns scoring hits × scoreValue for a side', () => {
    const rows = buildRows(standard)
    const r = findRow(rows, '17')
    r.left.hits = 6
    expect(rowScore(r, 'left', standard)).toBe(51)
    expect(rowScore(r, 'right', standard)).toBe(0)
  })
})

describe('allClosed / checkWinner', () => {
  it('allClosed false when any row has < 3 on either side', () => {
    const rows = buildRows(standard)
    for (const r of rows) {
      r.left.hits = 3
      r.right.hits = 3
    }
    rows[0].left.hits = 2
    expect(allClosed(rows)).toBe(false)
  })

  it('allClosed true once every row has both sides ≥ 3', () => {
    const rows = buildRows(standard)
    for (const r of rows) {
      r.left.hits = 3
      r.right.hits = 3
    }
    expect(allClosed(rows)).toBe(true)
  })

  it('checkWinner returns null while game ongoing', () => {
    const rows = buildRows(standard)
    expect(checkWinner(rows, standard)).toBe(null)
  })

  it('checkWinner returns the higher-score side', () => {
    const rows = buildRows(standard)
    for (const r of rows) {
      r.left.hits = 3
      r.right.hits = 3
    }
    // left scored 40 on '20' before right closed it
    findRow(rows, '20').left.hits = 5
    expect(checkWinner(rows, standard)).toBe('left')
  })

  it('checkWinner returns "tie" in no-score mode when all closed', () => {
    const rows = buildRows(noScore)
    for (const r of rows) {
      r.left.hits = 3
      r.right.hits = 3
    }
    expect(checkWinner(rows, noScore)).toBe('tie')
  })

  it('checkWinner returns "tie" when scores are equal and all closed', () => {
    const rows = buildRows(standard)
    for (const r of rows) {
      r.left.hits = 3
      r.right.hits = 3
    }
    expect(checkWinner(rows, standard)).toBe('tie')
  })
})

describe('getMarkState', () => {
  it('maps hit counts to mark states', () => {
    expect(getMarkState(0)).toBe(0)
    expect(getMarkState(1)).toBe(1)
    expect(getMarkState(2)).toBe(2)
    expect(getMarkState(3)).toBe('open')
    expect(getMarkState(7)).toBe('open')
  })
})
