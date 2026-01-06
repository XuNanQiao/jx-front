<template>
  <div class="jobs-container">
    <a-card title="模型作业" :bordered="false">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert
          message="模型作业"
          description="在这里管理和监控模型训练作业"
          type="info"
          show-icon
        />
        <a-empty description="暂无数据" />
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 模型作业页面
</script>

<style scoped>
.jobs-container {
  padding: 0;
}

.jobs-container :deep(.ant-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
</style>
