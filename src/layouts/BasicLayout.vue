<!--
 * @Author: ZHAO
 * @Date: 2026-01-07 16:34:15
 * @LastEditTime: 2026-01-16 15:42:57
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\layouts\BasicLayout.vue
 * 
-->
<template>
  <a-layout class="basic-layout">
    <!-- 顶部导航栏 -->
    <AppHeader />

    <!-- 主内容区 -->
    <a-layout-content class="main-content">
      <div class="content-wrapper">
        <a-config-provider :theme="theme">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </a-config-provider>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import { tokenThem } from '@/styles/them';
import theme from '@/styles/them.json';
// 用户信息已在 main.ts 中初始化到全局状态
</script>

<style scoped>
.basic-layout {
  min-height: 100vh;
  background: var(--bg-primary);
}

.main-content {
  height: calc(100vh - 48px);
  width: 100vw;
  overflow-y: auto; /* 仅在需要时显示滚动条，避免布局抖动 */
  overflow-x: hidden;
  min-height: calc(100vh - 64px);
  background: var(--bg-primary);
}

.content-wrapper {
  width: 100%;
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
