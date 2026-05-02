import type { Component } from 'vue'

export type GameId = string

export interface GameDefinition {
  id: GameId
  label: string
  description: string
  component: () => Promise<{ default: Component }>
  settingsComponent: () => Promise<{ default: Component }>
}

export type GameRegistry = Record<GameId, GameDefinition>
