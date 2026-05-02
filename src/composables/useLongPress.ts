import { onBeforeUnmount, ref } from 'vue'

export interface UseLongPressOptions {
  onTap: () => void
  onLongPress: () => void
  longPressMs?: number
}

export interface UseLongPressHandlers {
  onPointerdown: (e: PointerEvent) => void
  onPointerup: (e: PointerEvent) => void
  onPointerleave: (e: PointerEvent) => void
  onPointercancel: (e: PointerEvent) => void
  onContextmenu: (e: Event) => void
}

export function useLongPress(options: UseLongPressOptions): {
  handlers: UseLongPressHandlers
} {
  const longPressMs = options.longPressMs ?? 500
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)
  const longPressFired = ref(false)

  function clear() {
    if (timer.value !== null) {
      clearTimeout(timer.value)
      timer.value = null
    }
  }

  const handlers: UseLongPressHandlers = {
    onPointerdown(e: PointerEvent) {
      // Ignore non-primary buttons (e.g. right-click)
      if (e.button !== undefined && e.button !== 0) return
      longPressFired.value = false
      clear()
      timer.value = setTimeout(() => {
        longPressFired.value = true
        timer.value = null
        options.onLongPress()
      }, longPressMs)
    },
    onPointerup() {
      if (timer.value !== null) {
        clear()
        if (!longPressFired.value) options.onTap()
      }
      longPressFired.value = false
    },
    onPointerleave() {
      clear()
      longPressFired.value = false
    },
    onPointercancel() {
      clear()
      longPressFired.value = false
    },
    onContextmenu(e: Event) {
      e.preventDefault()
    },
  }

  onBeforeUnmount(clear)

  return { handlers }
}
