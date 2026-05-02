import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useSettings } from '@/composables/useSettings'

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns defaults when storage is empty', () => {
    const { settings } = useSettings('test', { foo: 'a', bar: 1 })
    expect(settings.value).toEqual({ foo: 'a', bar: 1 })
  })

  it('persists and reloads saved values', () => {
    const a = useSettings('test', { foo: 'a', bar: 1 })
    a.saveSettings({ foo: 'z', bar: 9 })
    const b = useSettings('test', { foo: 'a', bar: 1 })
    expect(b.settings.value).toEqual({ foo: 'z', bar: 9 })
  })

  it('deep-merges so new default keys appear even with stored data', () => {
    localStorage.setItem('darta:settings:test', JSON.stringify({ foo: 'z' }))
    const { settings } = useSettings('test', { foo: 'a', bar: 1 })
    expect(settings.value).toEqual({ foo: 'z', bar: 1 })
  })

  it('falls back to defaults on corrupted JSON', () => {
    localStorage.setItem('darta:settings:test', '{not json')
    const { settings } = useSettings('test', { foo: 'a' })
    expect(settings.value).toEqual({ foo: 'a' })
  })

  it('resetSettings clears storage and restores defaults', () => {
    const { settings, saveSettings, resetSettings } = useSettings('test', { foo: 'a' })
    saveSettings({ foo: 'z' })
    resetSettings()
    expect(settings.value).toEqual({ foo: 'a' })
    expect(localStorage.getItem('darta:settings:test')).toBe(null)
  })
})
