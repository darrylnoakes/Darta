<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import GameSettingsModal from '@/components/GameSettingsModal.vue'
</script>

<template>
  <AppHeader />
  <main class="app-main">
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </RouterView>
  </main>
  <AppSidebar />
  <GameSettingsModal />
</template>

<style scoped>
.app-main {
  flex: 1 1 auto;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
</style>
