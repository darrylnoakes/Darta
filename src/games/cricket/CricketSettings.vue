<script setup lang="ts">
import { reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCricketStore } from '@/stores/cricket'
import type { NumberSet, ScoreMode } from '@/types/cricket'

const store = useCricketStore()
const { settings } = storeToRefs(store)

const local = reactive({
  numberSet: settings.value.numberSet,
  scoreMode: settings.value.scoreMode,
})

watch(settings, (s) => {
  local.numberSet = s.numberSet
  local.scoreMode = s.scoreMode
})

function setNumberSet(value: NumberSet) {
  local.numberSet = value
  store.applySettings({ ...settings.value, numberSet: value })
}

function setScoreMode(value: ScoreMode) {
  local.scoreMode = value
  store.applySettings({ ...settings.value, scoreMode: value })
}

function confirmReset() {
  if (window.confirm('Reset the current game? All marks will be cleared.')) {
    store.resetGame()
  }
}
</script>

<template>
  <div class="cricket-settings">
    <section class="group">
      <h3 class="group__title">Numbers</h3>
      <div class="options">
        <label class="option" :class="{ 'option--active': local.numberSet === 'standard' }">
          <input
            type="radio"
            name="numberSet"
            value="standard"
            :checked="local.numberSet === 'standard'"
            @change="setNumberSet('standard')"
          />
          <span class="option__label">Standard</span>
          <span class="option__hint">20–15 + Bull</span>
        </label>
        <label class="option" :class="{ 'option--active': local.numberSet === 'wide' }">
          <input
            type="radio"
            name="numberSet"
            value="wide"
            :checked="local.numberSet === 'wide'"
            @change="setNumberSet('wide')"
          />
          <span class="option__label">Wide</span>
          <span class="option__hint">20–10 + Bull</span>
        </label>
        <label class="option" :class="{ 'option--active': local.numberSet === 'extended' }">
          <input
            type="radio"
            name="numberSet"
            value="extended"
            :checked="local.numberSet === 'extended'"
            @change="setNumberSet('extended')"
          />
          <span class="option__label">Extended</span>
          <span class="option__hint">+ Doubles & Triples</span>
        </label>
      </div>
    </section>

    <section class="group">
      <h3 class="group__title">Scoring</h3>
      <div class="options">
        <label class="option" :class="{ 'option--active': local.scoreMode === 'cricket' }">
          <input
            type="radio"
            name="scoreMode"
            value="cricket"
            :checked="local.scoreMode === 'cricket'"
            @change="setScoreMode('cricket')"
          />
          <span class="option__label">Cricket</span>
          <span class="option__hint">Score on open numbers</span>
        </label>
        <label class="option" :class="{ 'option--active': local.scoreMode === 'no-score' }">
          <input
            type="radio"
            name="scoreMode"
            value="no-score"
            :checked="local.scoreMode === 'no-score'"
            @change="setScoreMode('no-score')"
          />
          <span class="option__label">No score</span>
          <span class="option__hint">Track open / close only</span>
        </label>
      </div>
    </section>

    <section class="group">
      <button type="button" class="reset-button" @click="confirmReset">Reset game</button>
    </section>
  </div>
</template>

<style scoped>
.cricket-settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.group__title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-dim);
  margin-bottom: var(--space-1);
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.option {
  display: flex;
  flex-direction: column;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast);
  min-height: var(--tap-min);
}

.option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option__label {
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.option__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-dim);
  margin-top: 2px;
}

.option--active {
  border-color: var(--color-accent);
  background: rgba(200, 185, 122, 0.12);
}

.option--active .option__label {
  color: var(--color-accent);
}

.reset-button {
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  min-height: var(--tap-min);
  transition: background var(--transition-fast);
}

.reset-button:active {
  background: var(--color-active);
}
</style>
