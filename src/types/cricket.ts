export type TeamSide = 'left' | 'right'
export type NumberSet = 'standard' | 'wide' | 'extended'
export type ScoreMode = 'cricket' | 'no-score'

export interface CricketNumber {
  /** A unique identifier for this row, e.g. "20", "Bull", "D20", "T15". */
  id: string
  /** Display label shown in the number column. */
  label: string
  /** Score awarded per scoring hit on this row. */
  scoreValue: number
}

export interface TeamNumberState {
  hits: number
}

export interface CricketRowState {
  number: CricketNumber
  left: TeamNumberState
  right: TeamNumberState
}

export interface CricketSettings {
  numberSet: NumberSet
  scoreMode: ScoreMode
}

export type MarkState = 0 | 1 | 2 | 'open'
