<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { gameList } from '@/games'

const app = useAppStore()
const { sidebarOpen } = storeToRefs(app)

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const filteredGames = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return gameList
  return gameList.filter(
    (g) => g.label.toLowerCase().includes(q) || g.description.toLowerCase().includes(q),
  )
})

watch(sidebarOpen, async (open) => {
  if (open) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    query.value = ''
  }
})

function close() {
  app.closeSidebar()
}
</script>

<template>
  <Transition name="overlay">
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="close" aria-hidden="true" />
  </Transition>

  <aside
    class="sidebar"
    :class="{ 'sidebar--open': sidebarOpen }"
    :aria-hidden="!sidebarOpen"
  >
    <div class="sidebar__header">
      <h2 class="sidebar__title">Games</h2>
      <button class="close-button" type="button" aria-label="Close menu" @click="close">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div class="search">
      <svg class="search__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        class="search__input"
        placeholder="Search games"
        autocomplete="off"
        spellcheck="false"
      />
    </div>

    <nav class="games" aria-label="Games list">
      <ul>
        <li v-for="game in filteredGames" :key="game.id">
          <RouterLink
            :to="`/${game.id}`"
            class="game-link"
            active-class="game-link--active"
            @click="close"
          >
            <span class="game-link__label">{{ game.label }}</span>
            <span class="game-link__description">{{ game.description }}</span>
          </RouterLink>
        </li>
        <li v-if="filteredGames.length === 0" class="empty">No games match.</li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  z-index: 9;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  max-width: 85vw;
  background: var(--color-bg-raised);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform var(--transition-base);
  z-index: 10;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.sidebar--open {
  transform: translateX(0);
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.sidebar__title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
}

.close-button {
  width: var(--tap-min);
  height: var(--tap-min);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-text);
}

.close-button svg {
  width: 22px;
  height: 22px;
}

.close-button:active {
  background: var(--color-active);
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  margin: var(--space-3) var(--space-4);
}

.search__icon {
  position: absolute;
  left: var(--space-3);
  width: 18px;
  height: 18px;
  color: var(--color-text-dim);
  pointer-events: none;
}

.search__input {
  width: 100%;
  padding: var(--space-3) var(--space-3) var(--space-3) calc(var(--space-3) + 24px);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
}

.search__input::placeholder {
  color: var(--color-text-dim);
}

.search__input:focus {
  border-color: var(--color-accent);
}

.games {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2) var(--space-3) var(--space-4);
}

.game-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-3);
  margin-bottom: var(--space-1);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
  min-height: var(--tap-min);
}

.game-link:active {
  background: var(--color-active);
}

.game-link--active {
  background: rgba(200, 185, 122, 0.14);
}

.game-link__label {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

.game-link--active .game-link__label {
  color: var(--color-accent);
}

.game-link__description {
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
}

.empty {
  padding: var(--space-3);
  color: var(--color-text-dim);
  font-size: var(--font-size-sm);
  text-align: center;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--transition-base);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
