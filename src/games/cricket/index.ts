import type { GameDefinition } from '@/types/game'

export const cricketDefinition: GameDefinition = {
  id: 'cricket',
  label: 'Cricket',
  description: 'Hit each number three times to open it. Score on open numbers; race to close.',
  component: () => import('./CricketGame.vue'),
  settingsComponent: () => import('./CricketSettings.vue'),
}
