<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-20 14:11:59
 * @LastEditors: ZHAO
 * @Description: 作业计划 - 甘特图
 * @FilePath: \jx\src\views\jobs\tabs\jobPlan.vue
 *
-->
<template>
  <div class="job-plan">
    <div class="filter-section flex-between">
      <a-space :size="16" wrap>
        <div>
          <span>时间范围：</span>
          <a-range-picker
            show-time
            @change="loadJobPlanData"
            v-model:value="filters.timeRang"
            allowClear
            valueFormat="YYYY-MM-DDTHH:mm:ss"
            style="width: 350px" />
        </div>
        <div class="switch-item">
          <a-switch v-model:checked="filters.autoMonitor" />
          <span class="switch-label">固定尺寸</span>
        </div>
      </a-space>
    </div>
    <a-spin :spinning="loading">
      <div class="chart-container">
        <v-chart :option="chartOption" :autoresize="true" style="height: 600px" />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import dayjs from "dayjs";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { CustomChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  TitleComponent,
} from "echarts/components";
import { getModelJobPlan } from "@/api/modelJob";
import { formatDurationWithStart } from "@/utils/useTimeRangeFilter";

// 注册 ECharts 组件
use([CanvasRenderer, CustomChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, TitleComponent]);
const filters = ref({
  timeRang: [dayjs().startOf("day").format("YYYY-MM-DDTHH:mm:ss"), dayjs().format("YYYY-MM-DDTHH:mm:ss")] as string[],
  autoMonitor: false as boolean,
});
const loading = ref(false);

// 状态颜色配置
const statusColors: Record<string, string> = {
  成功: "#52c41a",
  失败: "#ff4d4f",
  运行中: "#1890ff",
  等待: "#faad14",
  计划: "#722ed1",
};

// 作业计划数据
const jobData = ref<JobPlanItem[]>([]);

// 加载作业计划数据
const loadJobPlanData = async () => {
  loading.value = true;
  try {
    const res = await getModelJobPlan({
      // model_id: 2,
      time_start: filters.value.timeRang[0] || "", //开始时间
      time_end: filters.value.timeRang[1] || "", //结束时间
    });
    jobData.value = [];
    if (res?.data?.items) {
      jobData.value = res.data.items;
    }
  } catch (err) {
    console.error("获取作业计划数据失败:", err);
    jobData.value = [];
  } finally {
    loading.value = false;
  }
};

// 格式化时间显示
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

// 图表配置
const chartOption = computed(() => {
  let startKey = "data_start_time";
  let endKey = "data_end_time";
  // 如果没有数据,返回空配置
  if (!jobData.value || jobData.value.length === 0) {
    return {
      title: {
        text: "暂无作业计划数据",
        left: "center",
        top: "center",
        textStyle: {
          color: "#ffffff",
          fontSize: 16,
        },
      },
    };
  }

  const categories = jobData.value.map((item: any) => item.name);
  const data = jobData.value.map((item: any, index: number) => ({
    name: item.name,
    value: [index, item[startKey], item[endKey], formatDurationWithStart(item[startKey], item[endKey]), item.status],
    itemStyle: {
      color: statusColors[item.status] || "#1890ff",
    },
    status: item.status,
  }));

  // 获取时间范围
  const allTimes = jobData.value.flatMap((item: any) => [item[startKey], item[endKey]]);
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);
  const dataZoom = filters.value.autoMonitor
    ? [
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
      ]
    : [];
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
    dataZoom,
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
  // 加载作业计划数据
  loadJobPlanData();
});
</script>

<style scoped lang="scss">
.job-plan {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
</style>
