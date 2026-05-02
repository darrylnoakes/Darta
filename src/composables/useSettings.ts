import { ref, watch, type Ref } from 'vue'

const STORAGE_PREFIX = 'darta:settings:'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function deepMerge<T extends object>(defaults: T, stored: unknown): T {
  if (!isPlainObject(stored)) return { ...defaults }
  const defaultsRecord = defaults as unknown as Record<string, unknown>
  const out: Record<string, unknown> = { ...defaultsRecord }
  for (const key of Object.keys(defaultsRecord)) {
    const dv = defaultsRecord[key]
    const sv = stored[key]
    if (isPlainObject(dv) && isPlainObject(sv)) {
      out[key] = deepMerge(dv, sv)
    } else if (sv !== undefined) {
      out[key] = sv
    }
  }
  return out as T
}

export interface UseSettingsResult<T> {
  settings: Ref<T>
  saveSettings: (next: T) => void
  resetSettings: () => void
}

export function useSettings<T extends object>(
  gameId: string,
  defaults: T,
): UseSettingsResult<T> {
  const key = STORAGE_PREFIX + gameId

  function load(): T {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return { ...defaults }
      const parsed: unknown = JSON.parse(raw)
      return deepMerge(defaults, parsed)
    } catch {
      return { ...defaults }
    }
  }

  const settings = ref(load()) as Ref<T>

  function persist(value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage may be unavailable (private mode, quota); ignore silently.
    }
  }

  function saveSettings(next: T) {
    settings.value = { ...next }
    persist(settings.value)
  }

  function resetSettings() {
    settings.value = { ...defaults }
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }

  watch(settings, (v) => persist(v), { deep: true })

  return { settings, saveSettings, resetSettings }
}
