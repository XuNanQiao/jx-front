<template>
  <a-layout class="basic-layout">
    <!-- 顶部导航栏 -->
    <AppHeader />

    <!-- 主内容区 -->
    <a-layout-content class="main-content">
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
// 用户信息已在 main.ts 中初始化到全局状态
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background: var(--bg-primary);
}

.main-content {
  /* padding: var(--spacing-lg); */
  min-height: calc(100vh - 64px);
  background: var(--bg-primary);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }
}
</style>
