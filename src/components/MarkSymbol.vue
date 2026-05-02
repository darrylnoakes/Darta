<script setup lang="ts">
import type { MarkState } from '@/types/cricket'

defineProps<{
  state: MarkState
  closed?: boolean
}>()
</script>

<template>
  <span class="mark" :class="[`mark--${state}`, { 'mark--closed': closed }]">
    <template v-if="state === 1"><span class="glyph glyph--slash">／</span></template>
    <template v-else-if="state === 2"><span class="glyph glyph--cross">✕</span></template>
    <template v-else-if="state === 'open'">
      <svg class="glyph glyph--open" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" />
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" />
      </svg>
    </template>
  </span>
</template>

<style scoped>
.mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text);
  transition: opacity var(--transition-fast), color var(--transition-fast);
}

.glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-chalk);
  font-weight: 600;
  line-height: 1;
}

.glyph--slash {
  font-size: 2rem;
  transform: translateY(-1px);
}

.glyph--cross {
  font-size: 1.85rem;
}

.glyph--open {
  width: 1.85rem;
  height: 1.85rem;
}

.mark--closed {
  opacity: 0.35;
}
</style>
