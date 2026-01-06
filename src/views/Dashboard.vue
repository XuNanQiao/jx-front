<template>
  <div class="dashboard-container">
    <a-card title="仪表盘" :bordered="false">
      <a-row :gutter="16" class="stats-row">
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic
              title="总用户数"
              :value="1128"
              :value-style="{ color: '#3f8600' }"
            >
              <template #prefix>
                <UserOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic
              title="今日访问"
              :value="93"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <EyeOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic
              title="文章总数"
              :value="256"
              :value-style="{ color: '#722ed1' }"
            >
              <template #prefix>
                <FileTextOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <a-statistic
              title="系统运行天数"
              :value="365"
              :value-style="{ color: '#cf1322' }"
            >
              <template #prefix>
                <ClockCircleOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16" class="chart-row">
        <a-col :xs="24" :lg="16">
          <a-card title="访问趋势" :bordered="false">
            <div class="chart-placeholder">
              <LineChartOutlined class="chart-icon" />
              <p>这里可以放置图表组件</p>
            </div>
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="8">
          <a-card title="最新动态" :bordered="false">
            <a-list :data-source="activities" size="small">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta :description="item.time">
                    <template #title>{{ item.title }}</template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  UserOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'

const activities = ref([
  { title: '用户 admin 登录系统', time: '2分钟前' },
  { title: '新增文章《Vue3 最佳实践》', time: '10分钟前' },
  { title: '用户 user 修改了个人资料', time: '30分钟前' },
  { title: '系统配置已更新', time: '1小时前' },
  { title: '新用户 test 注册成功', time: '2小时前' }
])
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  margin-bottom: 16px;
}

.chart-row {
  margin-top: 24px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border-radius: 8px;
}

.chart-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.chart-placeholder p {
  color: #8c8c8c;
  margin: 0;
}
</style>
