<template>
  <div class="input-output-container">
    <a-card title="模型输入输出" :bordered="false">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert
          message="模型输入输出管理"
          description="在这里管理模型的输入和输出数据"
          type="info"
          show-icon
        />
        <a-empty description="暂无数据" />
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 模型输入输出页面
</script>

<style scoped>
.input-output-container {
  padding: 0;
}

.input-output-container :deep(.ant-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
</style>
