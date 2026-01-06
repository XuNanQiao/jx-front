<template>
  <div class="operators-container">
    <a-card title="算子管理" :bordered="false">
      <a-space direction="vertical" :size="16" style="width: 100%">
        <a-alert
          message="算子管理"
          description="在这里管理模型的算子和操作符"
          type="info"
          show-icon
        />
        <a-empty description="暂无数据" />
      </a-space>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 算子管理页面
</script>

<style scoped>
.operators-container {
  padding: 0;
}

.operators-container :deep(.ant-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}
</style>
