import type {
  CricketNumber,
  CricketRowState,
  CricketSettings,
  MarkState,
  TeamSide,
} from '@/types/cricket'

const STANDARD_NUMBERS: CricketNumber[] = [
  { id: '20', label: '20', scoreValue: 20 },
  { id: '19', label: '19', scoreValue: 19 },
  { id: '18', label: '18', scoreValue: 18 },
  { id: '17', label: '17', scoreValue: 17 },
  { id: '16', label: '16', scoreValue: 16 },
  { id: '15', label: '15', scoreValue: 15 },
  { id: 'Bull', label: 'B', scoreValue: 25 },
]

const EXTENDED_NUMBERS: CricketNumber[] = [
  { id: '20', label: '20', scoreValue: 20 },
  { id: '19', label: '19', scoreValue: 19 },
  { id: '18', label: '18', scoreValue: 18 },
  { id: '17', label: '17', scoreValue: 17 },
  { id: '16', label: '16', scoreValue: 16 },
  { id: '15', label: '15', scoreValue: 15 },
  { id: '14', label: '14', scoreValue: 14 },
  { id: '13', label: '13', scoreValue: 13 },
  { id: '12', label: '12', scoreValue: 12 },
  { id: '11', label: '11', scoreValue: 11 },
  { id: '10', label: '10', scoreValue: 10 },
  { id: 'Bull', label: 'B', scoreValue: 25 },
]

function buildMinnesotaNumbers(): CricketNumber[] {
  const base: CricketNumber[] = [...STANDARD_NUMBERS]
  for (const n of [20, 19, 18, 17, 16, 15]) {
    base.push({ id: `D${n}`, label: `D${n}`, scoreValue: n * 2 })
  }
  for (const n of [20, 19, 18, 17, 16, 15]) {
    base.push({ id: `T${n}`, label: `T${n}`, scoreValue: n * 3 })
  }
  return base
}

function buildTacticsNumbers(): CricketNumber[] {
  return [
    ...STANDARD_NUMBERS,
    { id: 'Doubles', label: 'D', scoreValue: 0 },
    { id: 'Triples', label: 'T', scoreValue: 0 },
  ]
}

export function getNumbers(settings: CricketSettings): CricketNumber[] {
  if (settings.numberSet === 'minnesota') return buildMinnesotaNumbers()
  if (settings.numberSet === 'tactics') return buildTacticsNumbers()
  if (settings.numberSet === 'extended') return [...EXTENDED_NUMBERS]
  return [...STANDARD_NUMBERS]
}

export function buildRows(settings: CricketSettings): CricketRowState[] {
  return getNumbers(settings).map((number) => ({
    number,
    left: { hits: 0 },
    right: { hits: 0 },
  }))
}

export function isOpen(row: CricketRowState, side: TeamSide): boolean {
  return row[side].hits >= 3
}

export function isClosed(row: CricketRowState): boolean {
  return row.left.hits >= 3 && row.right.hits >= 3
}

/** Hits beyond the opening 3 that score points. */
export function getScoringHits(row: CricketRowState, side: TeamSide): number {
  if (row[side].hits <= 3) return 0
  return row[side].hits - 3
}

export interface Scores {
  left: number
  right: number
}

export function computeScores(rows: CricketRowState[], settings: CricketSettings): Scores {
  if (settings.scoreMode === 'no-score') return { left: 0, right: 0 }
  let left = 0
  let right = 0
  for (const row of rows) {
    left += getScoringHits(row, 'left') * row.number.scoreValue
    right += getScoringHits(row, 'right') * row.number.scoreValue
  }
  return { left, right }
}

export function rowScore(row: CricketRowState, side: TeamSide, settings: CricketSettings): number {
  if (settings.scoreMode === 'no-score') return 0
  return getScoringHits(row, side) * row.number.scoreValue
}

export function allClosed(rows: CricketRowState[]): boolean {
  return rows.length > 0 && rows.every(isClosed)
}

export type Winner = TeamSide | 'tie' | null

export function checkWinner(rows: CricketRowState[], settings: CricketSettings): Winner {
  if (!allClosed(rows)) return null
  if (settings.scoreMode === 'no-score') {
    // In no-score mode the closing-out side cannot be derived from row state alone.
    // We declare a tie when all closed; the active player at game end is irrelevant here.
    return 'tie'
  }
  const { left, right } = computeScores(rows, settings)
  if (left > right) return 'left'
  if (right > left) return 'right'
  return 'tie'
}

export function getMarkState(hits: number): MarkState {
  if (hits <= 0) return 0
  if (hits === 1) return 1
  if (hits === 2) return 2
  return 'open'
}
