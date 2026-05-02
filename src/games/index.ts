import type { GameDefinition, GameRegistry } from '@/types/game'
import { cricketDefinition } from './cricket'

export const gameRegistry: GameRegistry = {
  [cricketDefinition.id]: cricketDefinition,
}

export const gameList: GameDefinition[] = Object.values(gameRegistry)

export function getGame(id: string | undefined): GameDefinition | undefined {
  if (!id) return undefined
  return gameRegistry[id]
}
