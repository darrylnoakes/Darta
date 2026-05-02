<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCricketStore } from '@/stores/cricket'
import CricketRow from './CricketRow.vue'

const store = useCricketStore()
const { rows, settings, leftScore, rightScore, winner } = storeToRefs(store)

const showScores = computed(() => settings.value.scoreMode === 'cricket')

const winnerLabel = computed(() => {
  if (!winner.value) return ''
  if (winner.value === 'tie') return 'Tie game'
  return winner.value === 'left' ? 'Left wins' : 'Right wins'
})
</script>

<template>
  <div class="cricket">
    <header class="totals">
      <div class="team team--left">
        <div class="team__label">Left</div>
        <div v-if="showScores" class="team__score">{{ leftScore }}</div>
      </div>
      <div class="totals__divider" aria-hidden="true" />
      <div class="team team--right">
        <div class="team__label">Right</div>
        <div v-if="showScores" class="team__score">{{ rightScore }}</div>
      </div>
    </header>

    <div class="board">
      <CricketRow v-for="(row, i) in rows" :key="row.number.id" :row-index="i" />
    </div>

    <Transition name="winner">
      <div v-if="winner" class="winner-overlay" role="status" aria-live="polite">
        <div class="winner-card">
          <div class="winner-card__title">Game over</div>
          <div class="winner-card__result">{{ winnerLabel }}</div>
          <button class="winner-card__button" @click="store.resetGame()">New game</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cricket {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-3) var(--space-4) var(--space-4);
  gap: var(--space-3);
  overflow: hidden;
}

.totals {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-raised);
  border-radius: var(--radius-md);
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  min-width: 0;
}

.team__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.team__score {
  font-family: var(--font-chalk);
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.totals__divider {
  width: 1px;
  height: 60%;
  background: var(--color-border);
}

.board {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.winner-overlay {
  position: absolute;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 5;
}

.winner-card {
  background: var(--color-bg-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  min-width: 240px;
}

.winner-card__title {
  font-size: var(--font-size-sm);
  color: var(--color-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.winner-card__result {
  font-family: var(--font-chalk);
  font-size: var(--font-size-2xl);
  color: var(--color-accent);
}

.winner-card__button {
  margin-top: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  min-height: var(--tap-min);
}

.winner-card__button:active {
  background: var(--color-active);
}

.winner-enter-active,
.winner-leave-active {
  transition: opacity var(--transition-base);
}

.winner-enter-from,
.winner-leave-to {
  opacity: 0;
}
</style>
