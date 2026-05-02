<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCricketStore } from '@/stores/cricket'
import { isClosed, rowScore } from '@/games/cricket/logic'
import CricketMarks from './CricketMarks.vue'

const props = defineProps<{
  rowIndex: number
}>()

const store = useCricketStore()
const { rows, settings } = storeToRefs(store)

const row = computed(() => rows.value[props.rowIndex])
const closed = computed(() => isClosed(row.value))
const showScores = computed(() => settings.value.scoreMode === 'cricket')
const leftRowScore = computed(() => rowScore(row.value, 'left', settings.value))
const rightRowScore = computed(() => rowScore(row.value, 'right', settings.value))
</script>

<template>
  <div class="cricket-row" :class="{ 'cricket-row--closed': closed }">
    <div class="score-cell score-cell--left" aria-hidden="true">
      <span v-if="showScores && leftRowScore > 0">{{ leftRowScore }}</span>
    </div>

    <CricketMarks side="left" :row-index="rowIndex" />

    <div class="number-cell">
      <span class="number-label">{{ row.number.label }}</span>
    </div>

    <CricketMarks side="right" :row-index="rowIndex" />

    <div class="score-cell score-cell--right" aria-hidden="true">
      <span v-if="showScores && rightRowScore > 0">{{ rightRowScore }}</span>
    </div>
  </div>
</template>

<style scoped>
.cricket-row {
  display: grid;
  grid-template-columns: 2.4rem 1fr 3rem 1fr 2.4rem;
  gap: var(--space-2);
  align-items: stretch;
  height: 52px;
}

.cricket-row--closed .number-label {
  opacity: 0.35;
  text-decoration: line-through;
}

.score-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-chalk);
  font-size: var(--font-size-lg);
  color: var(--color-accent);
  min-width: 0;
}

.score-cell--left {
  justify-content: flex-end;
}

.score-cell--right {
  justify-content: flex-start;
}

.number-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.number-label {
  font-family: var(--font-chalk);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
  transition: opacity var(--transition-fast);
}
</style>
