import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import {
  buildRows,
  checkWinner,
  computeScores,
  isClosed,
  type Winner,
} from '@/games/cricket/logic'
import { useSettings } from '@/composables/useSettings'
import type { CricketRowState, CricketSettings, TeamSide } from '@/types/cricket'

const DEFAULT_SETTINGS: CricketSettings = {
  numberSet: 'standard',
  scoreMode: 'cricket',
}

export const useCricketStore = defineStore('cricket', () => {
  const { settings, saveSettings, resetSettings } = useSettings<CricketSettings>(
    'cricket',
    DEFAULT_SETTINGS,
  )

  const rows = ref<CricketRowState[]>(buildRows(settings.value))
  const gameStarted = ref(false)
  const winner = ref<Winner>(null)

  const scores = computed(() => computeScores(rows.value, settings.value))
  const leftScore = computed(() => scores.value.left)
  const rightScore = computed(() => scores.value.right)

  // When the number set changes, the row structure must be rebuilt.
  // Track only that field to avoid resetting on score-mode flips.
  watch(
    () => settings.value.numberSet,
    () => {
      rows.value = buildRows(settings.value)
      gameStarted.value = false
      winner.value = null
    },
  )

  // Re-evaluate the winner when the score mode changes (no rebuild).
  watch(
    () => settings.value.scoreMode,
    () => {
      winner.value = checkWinner(rows.value, settings.value)
    },
  )

  function addHit(side: TeamSide, rowIndex: number) {
    if (winner.value) return
    const row = rows.value[rowIndex]
    if (!row) return
    if (isClosed(row)) return // a closed number cannot accept further hits
    row[side].hits++
    gameStarted.value = true
    winner.value = checkWinner(rows.value, settings.value)
  }

  function removeHit(side: TeamSide, rowIndex: number) {
    const row = rows.value[rowIndex]
    if (!row) return
    if (row[side].hits > 0) {
      row[side].hits--
    }
    winner.value = checkWinner(rows.value, settings.value)
  }

  function resetGame() {
    rows.value = buildRows(settings.value)
    gameStarted.value = false
    winner.value = null
  }

  function applySettings(next: CricketSettings) {
    saveSettings(next)
  }

  function clearSettings() {
    resetSettings()
    resetGame()
  }

  return {
    settings,
    rows,
    gameStarted,
    winner,
    leftScore,
    rightScore,
    addHit,
    removeHit,
    resetGame,
    applySettings,
    clearSettings,
  }
})
