import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useLongPress } from '@/composables/useLongPress'

function makeComponent(onTap: () => void, onLongPress: () => void, longPressMs?: number) {
  return defineComponent({
    setup() {
      const { handlers } = useLongPress({ onTap, onLongPress, longPressMs })
      return () => h('div', { class: 'target', ...handlers })
    },
  })
}

function pointerEvent(type: string, init: PointerEventInit = {}): PointerEvent {
  // jsdom doesn't implement PointerEvent fully; fall back to MouseEvent shape.
  const ev = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent
  Object.defineProperty(ev, 'button', { value: init.button ?? 0 })
  return ev
}

describe('useLongPress', () => {
  it('fires onTap on quick pointerup', async () => {
    vi.useFakeTimers()
    const onTap = vi.fn()
    const onLongPress = vi.fn()
    const wrapper = mount(makeComponent(onTap, onLongPress, 500))
    const el = wrapper.find('.target').element as HTMLElement

    el.dispatchEvent(pointerEvent('pointerdown'))
    vi.advanceTimersByTime(100)
    el.dispatchEvent(pointerEvent('pointerup'))
    await nextTick()

    expect(onTap).toHaveBeenCalledTimes(1)
    expect(onLongPress).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('fires onLongPress after threshold and not onTap on release', async () => {
    vi.useFakeTimers()
    const onTap = vi.fn()
    const onLongPress = vi.fn()
    const wrapper = mount(makeComponent(onTap, onLongPress, 500))
    const el = wrapper.find('.target').element as HTMLElement

    el.dispatchEvent(pointerEvent('pointerdown'))
    vi.advanceTimersByTime(500)
    expect(onLongPress).toHaveBeenCalledTimes(1)
    el.dispatchEvent(pointerEvent('pointerup'))
    await nextTick()

    expect(onTap).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('pointerleave cancels both callbacks', async () => {
    vi.useFakeTimers()
    const onTap = vi.fn()
    const onLongPress = vi.fn()
    const wrapper = mount(makeComponent(onTap, onLongPress, 500))
    const el = wrapper.find('.target').element as HTMLElement

    el.dispatchEvent(pointerEvent('pointerdown'))
    vi.advanceTimersByTime(200)
    el.dispatchEvent(pointerEvent('pointerleave'))
    vi.advanceTimersByTime(500)
    el.dispatchEvent(pointerEvent('pointerup'))
    await nextTick()

    expect(onTap).not.toHaveBeenCalled()
    expect(onLongPress).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('respects custom longPressMs', async () => {
    vi.useFakeTimers()
    const onTap = vi.fn()
    const onLongPress = vi.fn()
    const wrapper = mount(makeComponent(onTap, onLongPress, 200))
    const el = wrapper.find('.target').element as HTMLElement

    el.dispatchEvent(pointerEvent('pointerdown'))
    vi.advanceTimersByTime(200)
    expect(onLongPress).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('ignores non-primary pointer buttons', async () => {
    vi.useFakeTimers()
    const onTap = vi.fn()
    const onLongPress = vi.fn()
    const wrapper = mount(makeComponent(onTap, onLongPress, 200))
    const el = wrapper.find('.target').element as HTMLElement

    el.dispatchEvent(pointerEvent('pointerdown', { button: 2 }))
    vi.advanceTimersByTime(500)
    el.dispatchEvent(pointerEvent('pointerup'))
    await nextTick()

    expect(onTap).not.toHaveBeenCalled()
    expect(onLongPress).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})
