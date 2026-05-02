<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getGame } from '@/games'

const route = useRoute()
const app = useAppStore()

const title = computed(() => {
  const meta = route.meta as { gameLabel?: string; gameId?: string }
  return meta.gameLabel ?? 'Darta'
})

const hasSettings = computed(() => {
  const meta = route.meta as { gameId?: string }
  return Boolean(meta.gameId && getGame(meta.gameId))
})
</script>

<template>
  <header class="app-header">
    <button
      class="icon-button icon-button--start"
      type="button"
      aria-label="Open menu"
      @click="app.toggleSidebar()"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>

    <h1 class="app-header__title">{{ title }}</h1>

    <button
      v-if="hasSettings"
      class="icon-button icon-button--end"
      type="button"
      aria-label="Game settings"
      @click="app.openSettings()"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.43.86.78"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <span v-else class="icon-button icon-button--end" aria-hidden="true" />
  </header>
</template>

<style scoped>
.app-header {
  display: grid;
  grid-template-columns: var(--tap-min) 1fr var(--tap-min);
  align-items: center;
  height: var(--header-height);
  padding: 0 var(--space-2);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  z-index: 4;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--tap-min);
  height: var(--tap-min);
  border-radius: var(--radius-md);
  color: var(--color-text);
  transition: background var(--transition-fast);
}

.icon-button:active {
  background: var(--color-active);
}

.icon-button svg {
  width: 22px;
  height: 22px;
}

.icon-button--end {
  justify-self: end;
}

.app-header__title {
  text-align: center;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.02em;
}
</style>
