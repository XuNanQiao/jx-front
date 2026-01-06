<template>
  <div class="deployment-container">
    <a-card title="模型部署" :bordered="false">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert
          message="模型部署"
          description="在这里管理模型的部署和发布"
          type="info"
          show-icon
        />
        <a-empty description="暂无数据" />
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 模型部署页面
</script>

<style scoped>
.deployment-container {
  padding: 0;
}

.deployment-container :deep(.ant-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
</style>
