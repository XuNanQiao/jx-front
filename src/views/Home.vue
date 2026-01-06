<template>
  <div class="home-container">
    <a-card title="欢迎使用" :bordered="false">
      <p class="description">
        这是一个基于 Vue3 + Vite + Pinia + TypeScript + Ant Design Vue 构建的管理系统框架。
      </p>

      <a-row :gutter="16" class="feature-cards">
        <a-col :xs="24" :sm="8">
          <a-card class="feature-card vue-card">
            <div class="card-title">Vue 3</div>
            <div class="card-desc">组合式 API + TypeScript</div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-card class="feature-card vite-card">
            <div class="card-title">Vite</div>
            <div class="card-desc">极速的构建工具</div>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="8">
          <a-card class="feature-card antd-card">
            <div class="card-title">Ant Design</div>
            <div class="card-desc">企业级 UI 设计</div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<style scoped>
.home-container {
  width: 100%;
}

.description {
  font-size: 14px;
  color: #595959;
  margin-bottom: 24px;
}

.feature-cards {
  margin-top: 24px;
}

.feature-card {
  text-align: center;
  margin-bottom: 16px;
  transition: all 0.3s;
  border-radius: 8px;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.vue-card {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-color: #91d5ff;
}

.vite-card {
  background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
  border-color: #b7eb8f;
}

.antd-card {
  background: linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%);
  border-color: #d3adf7;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.vue-card .card-title {
  color: #1890ff;
}

.vite-card .card-title {
  color: #52c41a;
}

.antd-card .card-title {
  color: #722ed1;
}

.card-desc {
  font-size: 14px;
  color: #595959;
}
</style>
