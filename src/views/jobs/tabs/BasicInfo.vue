<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-19 16:58:34
 * @LastEditors: ZHAO
 * @Description: 作业计划 - 横向柱状图
 * @FilePath: \jx\src\views\jobs\tabs\BasicInfo.vue
 *
-->
<template>
  <div class="job-plan page">
    <a-spin :spinning="loading">
      <div class="chart-container">
        <v-chart :option="chartOption" :autoresize="true" style="height: 600px" />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';

// 注册 ECharts 组件
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const props = defineProps<{ id: any | null }>();
const loading = ref(false);

// 临时模拟数据
const jobData = ref([
  { name: '数据清洗作业-001', duration: 3600 }, // 1小时
  { name: '特征提取作业-002', duration: 7200 }, // 2小时
  { name: '模型训练作业-003', duration: 14400 }, // 4小时
  { name: '模型验证作业-004', duration: 1800 }, // 30分钟
  { name: '数据预处理-005', duration: 5400 }, // 1.5小时
  { name: '结果输出作业-006', duration: 900 }, // 15分钟
  { name: '性能评估作业-007', duration: 2700 }, // 45分钟
  { name: '数据备份作业-008', duration: 10800 }, // 3小时
]);

// 图表配置
const chartOption = computed(() => {
  const jobNames = jobData.value.map((item) => item.name);
  const durations = jobData.value.map((item) => item.duration);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const duration = params[0].value;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        let timeStr = '';
        if (hours > 0) timeStr += `${hours}小时`;
        if (minutes > 0) timeStr += `${minutes}分`;
        if (seconds > 0 || timeStr === '') timeStr += `${seconds}秒`;
        return `${params[0].name}<br/>执行时长: ${timeStr}`;
      },
    },
    grid: {
      left: '8%',
      right: '10%',
      top: '5%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '执行时长（秒）',
      nameTextStyle: {
        color: '#ffffff',
      },
      axisLabel: {
        color: '#ffffff',
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: jobNames,
      axisLabel: {
        color: '#ffffff',
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)',
        },
      },
      axisPointer: {
        type: 'line',
        show: true,
        label: {
          show: true,
          backgroundColor: '#1890ff',
        },
        lineStyle: {
          color: 'rgba(24, 144, 255, 0.5)',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '执行时长',
        type: 'bar',
        data: durations,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#00f2fe' },
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: '#ffffff',
          formatter: (params: any) => {
            const duration = params.value;
            const hours = Math.floor(duration / 3600);
            const minutes = Math.floor((duration % 3600) / 60);
            const seconds = duration % 60;
            let timeStr = '';
            if (hours > 0) timeStr += `${hours}h `;
            if (minutes > 0) timeStr += `${minutes}m `;
            if (seconds > 0 || timeStr === '') timeStr += `${seconds}s`;
            return timeStr;
          },
        },
      },
    ],
  };
});

onMounted(() => {
  // 模拟加载延迟
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 300);
});
</script>

<style scoped lang="scss">
.job-plan {
  padding: 16px;

  .chart-container {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
  }
}
</style>
