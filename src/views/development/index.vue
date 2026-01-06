<template>
  <div class="development-container">
    <a-card title="模型开发" :bordered="false">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert message="模型开发" description="在这里进行模型的开发和训练" type="info" show-icon />
        <a-empty description="暂无数据" />
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 模型开发页面
</script>

<style scoped>
.development-container {
  padding: 0;
}

.development-container :deep(.ant-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
</style>
