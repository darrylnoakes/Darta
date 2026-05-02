<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCricketStore } from '@/stores/cricket'
import { useLongPress } from '@/composables/useLongPress'
import { getMarkState, isClosed } from '@/games/cricket/logic'
import MarkSymbol from '@/components/MarkSymbol.vue'
import type { TeamSide } from '@/types/cricket'

const props = defineProps<{
  side: TeamSide
  rowIndex: number
}>()

const store = useCricketStore()
const { rows } = storeToRefs(store)

const row = computed(() => rows.value[props.rowIndex])
const hits = computed(() => row.value[props.side].hits)
const markState = computed(() => getMarkState(hits.value))
const closed = computed(() => isClosed(row.value))

const { handlers } = useLongPress({
  onTap: () => store.addHit(props.side, props.rowIndex),
  onLongPress: () => store.removeHit(props.side, props.rowIndex),
})
</script>

<template>
  <button
    type="button"
    class="marks-cell"
    :class="{ 'marks-cell--closed': closed, 'marks-cell--open': markState === 'open' && !closed }"
    :aria-label="`${side === 'left' ? 'Left' : 'Right'} marks for ${row.number.label}: ${hits} hits. Tap to add, long press to remove.`"
    v-bind="handlers"
  >
    <MarkSymbol :state="markState" :closed="closed" />
  </button>
</template>

<style scoped>
.marks-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--tap-min);
  height: 100%;
  width: 100%;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  transition: background var(--transition-fast), border-color var(--transition-fast);
  touch-action: manipulation;
}

.marks-cell:active {
  background: var(--color-active);
}

.marks-cell--open {
  border-color: var(--color-border-strong);
  background: rgba(232, 228, 217, 0.06);
}

.marks-cell--closed {
  border-style: dashed;
  border-color: rgba(232, 228, 217, 0.1);
}
</style>
