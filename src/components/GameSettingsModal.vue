<script setup lang="ts">
import { computed, defineAsyncComponent, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import { getGame } from '@/games'
import type { Component } from 'vue'

const app = useAppStore()
const { settingsOpen } = storeToRefs(app)
const route = useRoute()

const currentGame = computed(() => {
  const id = (route.meta as { gameId?: string }).gameId
  return getGame(id)
})

const SettingsComponent = shallowRef<Component | null>(null)

watch(
  currentGame,
  (game) => {
    if (game) {
      SettingsComponent.value = defineAsyncComponent(game.settingsComponent)
    } else {
      SettingsComponent.value = null
    }
  },
  { immediate: true },
)

function close() {
  app.closeSettings()
}
</script>

<template>
  <Transition name="fade">
    <div v-if="settingsOpen" class="modal-overlay" @click.self="close">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="`${currentGame?.label ?? 'Game'} settings`">
        <header class="modal__header">
          <h2 class="modal__title">
            {{ currentGame?.label ?? 'Game' }} settings
          </h2>
          <button class="close-button" type="button" aria-label="Close settings" @click="close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </header>
        <div class="modal__body">
          <component :is="SettingsComponent" v-if="SettingsComponent" />
          <p v-else class="empty">No settings available.</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 20;
  padding: 0;
}

.modal {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  background: var(--color-bg-raised);
  border-top: 1px solid var(--color-border);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  flex-direction: column;
  padding-bottom: env(safe-area-inset-bottom);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
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

.modal__body {
  padding: var(--space-4);
  overflow-y: auto;
}

.empty {
  color: var(--color-text-dim);
  text-align: center;
  padding: var(--space-4);
}

@media (min-width: 600px) {
  .modal-overlay {
    align-items: center;
    padding: var(--space-4);
  }
  .modal {
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .modal,
.fade-leave-active .modal {
  transition: transform var(--transition-base);
}

.fade-enter-from .modal,
.fade-leave-to .modal {
  transform: translateY(100%);
}
</style>
