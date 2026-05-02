import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { gameList } from '@/games'

const gameRoutes: RouteRecordRaw[] = gameList.map((game) => ({
  path: `/${game.id}`,
  name: game.id,
  component: game.component,
  meta: { gameId: game.id, gameLabel: game.label },
}))

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: gameList[0] ? `/${gameList[0].id}` : '/cricket' },
  ...gameRoutes,
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
