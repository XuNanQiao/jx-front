<!--
 * @Author: ZHAO
 * @Date: 2026-01-07 15:00:00
 * @LastEditTime: 2026-01-09 10:26:53
 * @LastEditors: ZHAO
 * @Description: 接入统计页面
 * @FilePath: \jx\src\views\InputOutput\tabs\AccessStats.vue
 *
-->
<template>
  <div class="access-stats page">
    <!-- 顶部操作栏 -->
    <div class="stats-header">
      <div class="header-left">
        <a-button size="small" @click="handleRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
        <a-button size="small" @click="handleViewDataSource">
          <template #icon>
            <DatabaseOutlined />
          </template>
          查看数据源
        </a-button>
      </div>
      <div class="header-right">
        <span class="total-count">合计：{{ totalRows }} 行</span>
      </div>
    </div>

    <!-- 统计图表区域 -->
    <div class="stats-content">
      <!-- 最近 30 天 -->
      <div class="chart-section main-chart">
        <div class="chart-title">最近 30 天</div>
        <chart-view :mockData="true" height="300px" />
      </div>

      <!-- 其他时间维度图表 -->
      <div class="chart-grid">
        <!-- 最近 1 小时 -->
        <div class="chart-section">
          <div class="chart-title">最近 1 小时</div>
          <chart-view :mockData="true" height="200px" />
        </div>

        <!-- 最近 1 天 -->
        <div class="chart-section">
          <div class="chart-title">最近 1 天</div>
          <chart-view :mockData="true" height="200px" />
        </div>

        <!-- 最近 1 年 -->
        <div class="chart-section">
          <div class="chart-title">最近 1 年</div>
          <chart-view :mockData="true" height="200px" />
        </div>

        <!-- 最近 3 年 -->
        <div class="chart-section">
          <div class="chart-title">最近 3 年</div>
          <chart-view :mockData="true" height="200px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import { ReloadOutlined, DatabaseOutlined } from "@ant-design/icons-vue";
import ChartView from "@/components/chart/chartView.vue";

// 总行数
const totalRows = ref(0);

// 最近 1 小时数据（每5分钟一个点，共12个点）
const last1HourData = reactive({
  xAxis: [] as string[],
  yAxis: [] as number[],
});

// 最近 1 天数据（每小时一个点，共24个点）
const last1DayData = reactive({
  xAxis: [] as string[],
  yAxis: [] as number[],
});

// 最近 30 天数据（每天一个点，共30个点）
const last30DaysData = reactive({
  xAxis: [] as string[],
  yAxis: [] as number[],
});

// 最近 1 年数据（每月一个点，共12个点）
const last1YearData = reactive({
  xAxis: [] as string[],
  yAxis: [] as number[],
});

// 最近 3 年数据（每季度一个点，共12个点）
const last3YearsData = reactive({
  xAxis: [] as string[],
  yAxis: [] as number[],
});

// 生成模拟数据
const generateMockData = () => {
  // 最近 1 小时
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    last1HourData.xAxis.push(
      `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`,
    );
    last1HourData.yAxis.push(Math.floor(Math.random() * 50 + 10));
  }

  // 最近 1 天
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    last1DayData.xAxis.push(`${String(time.getHours()).padStart(2, "0")}:00`);
    last1DayData.yAxis.push(Math.floor(Math.random() * 200 + 50));
  }

  // 最近 30 天
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    last30DaysData.xAxis.push(`${date.getMonth() + 1}/${date.getDate()}`);
    last30DaysData.yAxis.push(Math.floor(Math.random() * 1000 + 500));
  }

  // 最近 1 年
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  for (let i = 11; i >= 0; i--) {
    const monthIndex = (now.getMonth() - i + 12) % 12;
    last1YearData.xAxis.push(months[monthIndex]);
    last1YearData.yAxis.push(Math.floor(Math.random() * 5000 + 2000));
  }

  // 最近 3 年
  const currentYear = now.getFullYear();
  const currentQuarter = Math.floor(now.getMonth() / 3);
  for (let i = 11; i >= 0; i--) {
    const totalQuarters = currentQuarter + currentYear * 4;
    const targetQuarter = totalQuarters - i;
    const year = Math.floor(targetQuarter / 4);
    const quarter = (targetQuarter % 4) + 1;
    last3YearsData.xAxis.push(`${year}Q${quarter}`);
    last3YearsData.yAxis.push(Math.floor(Math.random() * 20000 + 10000));
  }

  // 计算总行数
  totalRows.value = last30DaysData.yAxis.reduce((sum, val) => sum + val, 0);
};

// 刷新数据
const handleRefresh = () => {
  message.loading("正在刷新数据...", 0.5);
  setTimeout(() => {
    // 清空数据
    last1HourData.xAxis = [];
    last1HourData.yAxis = [];
    last1DayData.xAxis = [];
    last1DayData.yAxis = [];
    last30DaysData.xAxis = [];
    last30DaysData.yAxis = [];
    last1YearData.xAxis = [];
    last1YearData.yAxis = [];
    last3YearsData.xAxis = [];
    last3YearsData.yAxis = [];

    // 重新生成数据
    generateMockData();
    message.success("刷新成功");
  }, 500);
};

// 查看数据源
const handleViewDataSource = () => {
  message.info("查看数据源功能开发中");
};

// 页面加载时生成数据
onMounted(() => {
  generateMockData();
});
</script>

<style scoped lang="scss">
.access-stats {
  height: 100%;
  display: flex;
  flex-direction: column;

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .header-left {
      display: flex;
      gap: 12px;
    }

    .header-right {
      .total-count {
        font-size: 14px;
        color: #ffffff;
        font-weight: 500;
      }
    }
  }

  .stats-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;

    .chart-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 16px;

      .chart-title {
        font-size: 16px;
        font-weight: 500;
        color: #ffffff;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }

    .main-chart {
      margin-bottom: 24px;
    }

    .chart-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
