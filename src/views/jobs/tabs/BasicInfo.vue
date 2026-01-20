<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-20 10:02:26
 * @LastEditors: ZHAO
 * @Description: 作业计划 - 甘特图
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
import { computed, onMounted, ref } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CustomChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from "echarts/components";

// 注册 ECharts 组件
use([CanvasRenderer, CustomChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent]);

const props = defineProps<{ id: any | null }>();
const loading = ref(false);

// 状态颜色配置
const statusColors: Record<string, string> = {
  成功: "#52c41a",
  失败: "#ff4d4f",
  运行中: "#1890ff",
  等待: "#faad14",
  计划: "#722ed1",
};

// 临时模拟数据 - 甘特图数据
const jobData = ref([
  {
    name: "数据清洗作业-1",
    startTime: new Date("2026-01-20 08:00:00").getTime(),
    endTime: new Date("2026-01-20 09:00:00").getTime(),
    status: "成功",
  },
  {
    name: "特征提取作业-2",
    startTime: new Date("2026-01-20 09:00:00").getTime(),
    endTime: new Date("2026-01-20 11:00:00").getTime(),
    status: "成功",
  },
  {
    name: "模型训练作业-3",
    startTime: new Date("2026-01-20 11:00:00").getTime(),
    endTime: new Date("2026-01-20 15:00:00").getTime(),
    status: "运行中",
  },
  {
    name: "模型验证作业-4",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "数据预处理-5",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "结果输出作业-6",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "性能评估作业-7",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "数据备份作业-8",
    startTime: new Date("2026-01-20 10:00:00").getTime(),
    endTime: new Date("2026-01-20 13:00:00").getTime(),
    status: "失败",
  },
  {
    name: "数据备份作业-9",
    startTime: new Date("2026-01-20 10:00:00").getTime(),
    endTime: new Date("2026-01-20 13:00:00").getTime(),
    status: "运行中",
  },
  {
    name: "模型验证作业-10",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "数据预处理-11",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "结果输出作业-12",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "性能评估作业-13",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "模型验证作业-14",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "数据预处理-15",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "结果输出作业-16",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "性能评估作业-17",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "模型验证作业-18",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "数据预处理-19",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "结果输出作业-20",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "性能评估作业-21",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "模型验证作业-22",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "数据预处理-23",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "结果输出作业-24",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "性能评估作业-25",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试模型验证作业-26",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试数据预处理-27",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试结果输出作业-28",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试性能评估作业-29",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试模型验证作业-30",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试数据预处理-31",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试结果输出作业-32",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试性能评估作业-33",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-1",
    startTime: new Date("2026-01-20 08:00:00").getTime(),
    endTime: new Date("2026-01-20 09:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-2",
    startTime: new Date("2026-01-20 09:00:00").getTime(),
    endTime: new Date("2026-01-20 11:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-3",
    startTime: new Date("2026-01-20 11:00:00").getTime(),
    endTime: new Date("2026-01-20 15:00:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-4",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-5",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-6",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-7",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-8",
    startTime: new Date("2026-01-20 10:00:00").getTime(),
    endTime: new Date("2026-01-20 13:00:00").getTime(),
    status: "失败",
  },
  {
    name: "测试正第二作业-9",
    startTime: new Date("2026-01-20 10:00:00").getTime(),
    endTime: new Date("2026-01-20 13:00:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-10",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-11",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-12",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-13",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-14",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-15",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-16",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-17",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-18",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-19",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-20",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-21",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-22",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-23",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-24",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-25",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-26",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-27",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-28",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-29",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
  {
    name: "测试正第二作业-30",
    startTime: new Date("2026-01-20 15:00:00").getTime(),
    endTime: new Date("2026-01-20 15:30:00").getTime(),
    status: "等待",
  },
  {
    name: "测试正第二作业-31",
    startTime: new Date("2026-01-20 08:30:00").getTime(),
    endTime: new Date("2026-01-20 10:00:00").getTime(),
    status: "成功",
  },
  {
    name: "测试正第二作业-32",
    startTime: new Date("2026-01-20 15:30:00").getTime(),
    endTime: new Date("2026-01-20 15:45:00").getTime(),
    status: "计划",
  },
  {
    name: "测试正第二作业-33",
    startTime: new Date("2026-01-20 14:00:00").getTime(),
    endTime: new Date("2026-01-20 14:45:00").getTime(),
    status: "运行中",
  },
]);

// 格式化时间显示
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

// 格式化持续时间
const formatDuration = (start: number, end: number) => {
  const duration = (end - start) / 1000 / 60; // 转换为分钟
  if (duration < 60) {
    return `${Math.round(duration)}分钟`;
  } else {
    const hours = Math.floor(duration / 60);
    const minutes = Math.round(duration % 60);
    return minutes > 0 ? `${hours}小时${minutes}分钟` : `${hours}小时`;
  }
};

// 图表配置
const chartOption = computed(() => {
  const categories = jobData.value.map((item) => item.name);
  const data = jobData.value.map((item, index) => ({
    name: item.name,
    value: [index, item.startTime, item.endTime, formatDuration(item.startTime, item.endTime), item.status],
    itemStyle: {
      color: statusColors[item.status] || "#1890ff",
    },
    status: item.status,
  }));

  // 获取时间范围
  const allTimes = jobData.value.flatMap((item) => [item.startTime, item.endTime]);
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  return {
    tooltip: {
      formatter: (params: any) => {
        if (!params || !params.data) return "";
        const { name, value, status } = params.data;
        if (!value || !status) return "";
        return `
          <div style="padding: 8px">
            <div style="font-weight: bold; margin-bottom: 8px">${name}</div>
            <div>状态: <span style="color: ${statusColors[status]}">${status}</span></div>
            <div>开始: ${formatTime(value[1])}</div>
            <div>结束: ${formatTime(value[2])}</div>
            <div>持续: ${value[3]}</div>
          </div>
        `;
      },
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      textStyle: {
        color: "#ffffff",
      },
    },
    legend: {
      show: true,
      top: 10,
      data: Object.keys(statusColors).map((status) => ({
        name: status,
        itemStyle: {
          color: statusColors[status],
        },
      })),
      textStyle: {
        color: "#ffffff",
      },
      itemWidth: 20,
      itemHeight: 10,
    },
    grid: {
      left: "50px",
      right: "50px",
      top: "70px",
      bottom: "80px",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        filterMode: "weakFilter",
        showDataShadow: false,
        bottom: 20,
        height: 20,
        borderColor: "transparent",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        handleSize: "80%",
        handleStyle: {
          color: "#1890ff",
        },
        textStyle: {
          color: "#ffffff",
        },
        labelFormatter: "",
      },
      {
        type: "slider",
        yAxisIndex: 0,
        startValue: 0,
        endValue: 10,
        filterMode: "weakFilter",
        showDataShadow: false,
        right: 10,
        width: 15,
        borderColor: "transparent",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        handleSize: "80%",
        handleStyle: {
          color: "#1890ff",
        },
        textStyle: {
          color: "#ffffff",
        },
        labelFormatter: "",
      },
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "weakFilter",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "weakFilter",
      },
    ],
    xAxis: {
      type: "time",
      min: minTime,
      max: maxTime,
      scale: true,
      position: "top",
      axisLabel: {
        formatter: (value: number) => formatTime(value),
        color: "#ffffff",
        fontSize: 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
    },
    yAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        color: "#ffffff",
        fontSize: 12,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
      splitLine: {
        show: false,
      },
      axisPointer: {
        type: "shadow",
        show: true,
        label: {
          show: true,
          backgroundColor: "#1890ff",
        },
        lineStyle: {
          color: "rgba(24, 144, 255, 0.5)",
          type: "dashed",
        },
      },
    },
    series: Object.keys(statusColors).map((status) => ({
      name: status,
      type: "custom",
      clip: true,
      renderItem: (_params: any, api: any) => {
        const categoryIndex = api.value(0);
        const start = api.coord([api.value(1), categoryIndex]);
        const end = api.coord([api.value(2), categoryIndex]);
        const height = api.size([0, 1])[1] * 0.6;

        // 检查是否在可视范围内
        if (!start || !end || start[1] == null || end[1] == null) {
          return null;
        }

        const rectShape = {
          x: start[0],
          y: start[1] - height / 2,
          width: Math.max(end[0] - start[0], 0),
          height: height,
        };

        // 如果宽度为0或者负数，不渲染
        if (rectShape.width <= 0) {
          return null;
        }

        return {
          type: "rect",
          shape: rectShape,
          style: {
            fill: statusColors[api.value(4)],
          },
        };
      },
      encode: {
        x: [1, 2],
        y: 0,
      },
      data: data.filter((item) => item.status === status),
    })),
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
