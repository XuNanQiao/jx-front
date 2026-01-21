<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-21 17:12:14
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
        <!-- @datazoom="handleDataZoom" -->
        <v-chart :option="chartOption" :autoresize="true" />
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
import { getModelJobPlan, type JobPlanItem } from "@/api/modelJob";
import { dayjsFormat, formatDurationWithStart } from "@/utils/useTimeRangeFilter";
import { statusJobMap, statusColors } from "../indexData";

// 注册 ECharts 组件
use([CanvasRenderer, CustomChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent, TitleComponent]);
const filters = ref({
  timeRang: [
    dayjs().startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
    dayjs().endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
  ] as string[],
  autoMonitor: false as boolean,
});
const loading = ref(false);
const TWENTY_MINUTES = 25 * 60 * 1000;

// 动态时间格式
const xAxisFormatter = ref<(value: number) => string>((value: number) => {
  const formatted = dayjsFormat(value);
  return formatted.slice(0, 10) + "\n" + formatted.slice(11);
});

// 计算时间格式化函数
const getTimeFormatter = (timeRange: number) => {
  // timeRange 单位是毫秒
  const hourInMs = 3600 * 1000;
  const dayInMs = 24 * hourInMs;

  if (timeRange <= 6 * hourInMs) {
    // 6小时以内：显示 年-月-日 时:分:秒
    return (value: number) => {
      const formatted = dayjsFormat(value);
      return formatted.slice(0, 10) + "\n" + formatted.slice(11);
    };
  } else if (timeRange <= 3 * dayInMs) {
    // 3天以内：显示 年-月-日 时:分
    return (value: number) => {
      const formatted = dayjsFormat(value);
      return formatted.slice(0, 10) + "\n" + formatted.slice(11, 16);
    };
  } else if (timeRange <= 7 * dayInMs) {
    // 7天以内：显示 年-月-日 时
    return (value: number) => {
      const formatted = dayjsFormat(value);
      return formatted.slice(0, 10) + "\n" + formatted.slice(11, 13) + ":00";
    };
  } else {
    // 7天以上：只显示 年-月-日
    return (value: number) => {
      return dayjsFormat(value).slice(0, 10);
    };
  }
};

// 处理缩放事件
const handleDataZoom = (event: any) => {
  // 处理单个事件或批量事件
  const zoomData = event.batch ? event.batch[0] : event;

  if (zoomData) {
    const { start, end, startValue, endValue } = zoomData;

    // 优先使用 startValue 和 endValue（精确值）
    if (startValue !== undefined && endValue !== undefined) {
      const timeRange = endValue - startValue;
      xAxisFormatter.value = getTimeFormatter(timeRange);
    } else if (start !== undefined && end !== undefined) {
      // 如果没有精确值，使用百分比计算
      const allTimes = jobData.value.flatMap((item: any) => [
        new Date(item.data_start_time).getTime(),
        new Date(item.data_end_time).getTime(),
      ]);
      const minTime = Math.min(...allTimes);
      const maxTime = Math.max(...allTimes);
      const totalRange = maxTime - minTime;
      const timeRange = (totalRange * (end - start)) / 100;
      xAxisFormatter.value = getTimeFormatter(timeRange);
    }
  }
};

// 作业计划数据
const jobData = ref<JobPlanItem[]>([]);

// 加载作业计划数据
const loadJobPlanData = async () => {
  loading.value = true;
  try {
    const res = await getModelJobPlan({
      // model_id: 2,
      data_start_time: filters.value.timeRang[0] || "", //开始时间
      data_end_time: filters.value.timeRang[1] || "", //结束时间
    });
    jobData.value = [];
    if (res?.data?.items) {
      jobData.value = res.data.items;

      // 初始化时间格式化函数
      if (jobData.value.length > 0) {
        const allTimes = jobData.value.flatMap((item: any) => [
          new Date(item.data_start_time).getTime(),
          new Date(item.data_end_time).getTime(),
        ]);
        const minTime = Math.min(...allTimes);
        const maxTime = Math.max(...allTimes);
        const timeRange = maxTime - minTime;
        // xAxisFormatter.value = getTimeFormatter(timeRange);
      }
    }
  } catch (err) {
    console.error("获取作业计划数据失败:", err);
    jobData.value = [];
  } finally {
    loading.value = false;
  }
};

// 图表配置
const chartOption = computed(() => {
  let startKey = "data_start_time";
  let endKey = "data_end_time";
  let statusKey = "status";
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
  const data = jobData.value.map((item: any, index: number) => {
    const statusCode = item[statusKey];
    const statusText = statusJobMap[statusCode] || "未知";
    return {
      name: item.name,
      value: [
        index,
        new Date(item[startKey]).getTime(),
        new Date(item[endKey]).getTime(),
        formatDurationWithStart(item[startKey], item[endKey], false),
        statusText,
      ],
      itemStyle: {
        color: statusColors[statusText] || "#1890ff",
      },
      status: statusText,
    };
  });
  // 获取时间范围
  const allTimes = jobData.value.flatMap((item: any) => [
    new Date(item[startKey]).getTime(),
    new Date(item[endKey]).getTime(),
  ]);
  const minTime = Math.min(...allTimes);
  const maxTime = Math.max(...allTimes);

  // 计算最后5个20分钟间隔的时间范围（即100分钟）
  const fiveIntervals = 5 * TWENTY_MINUTES; // 100分钟
  let xAxisStartValue = Math.max(minTime, maxTime - fiveIntervals);
  let xAxisEndValue = maxTime;

  const dataZoom = filters.value.autoMonitor
    ? []
    : [
        {
          type: "slider",
          xAxisIndex: 0,
          filterMode: "weakFilter",
          showDataShadow: false,
          bottom: 10,
          height: 10,
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
          startValue: xAxisStartValue,
          endValue: xAxisEndValue,
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
          startValue: xAxisStartValue,
          endValue: xAxisEndValue,
        },
        /*   {
          type: "inside",
          yAxisIndex: 0,
          filterMode: "weakFilter",
        }, */
      ];
  return {
    title: {
      show: false,
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        if (!params || params.length === 0) return "";
        // axis 模式下 params 是数组，取第一个有数据的项
        const param = params.find((p: any) => p.data);
        if (!param || !param.data) return "";
        const { name, value, status } = param.data;
        if (!value || !status) return "";
        return `
          <div style="padding: 8px">
            <div style="font-weight: bold; margin-bottom: 8px">${name}</div>
            <div>状态: <span style="color: ${statusColors[status]}">${status}</span></div>
            <div>开始: ${dayjsFormat(value[1])}</div>
            <div>结束: ${dayjsFormat(value[2])}</div>
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
      axisPointer: {
        type: "shadow",
        axis: "y",
        shadowStyle: {
          color: "rgba(24, 144, 255, 0.2)",
        },
      },
    },
    legend: {
      show: true,
      top: 10,
      right: 0,
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
      left: "0px",
      right: filters.value.autoMonitor ? "0px" : "50px",
      top: "60px",
      bottom: filters.value.autoMonitor ? "10px" : "60px",
      containLabel: true,
    },
    dataZoom,
    xAxis: {
      type: "time",
      min: minTime,
      max: maxTime,
      scale: true,
      interval: TWENTY_MINUTES,
      minInterval: TWENTY_MINUTES,
      // maxInterval: TWENTY_MINUTES,
      position: "top",
      axisLabel: {
        formatter: (value: number) => xAxisFormatter.value(value),
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
.filter-section {
  position: relative;
  z-index: 20;
}
.chart-container {
  margin-top: -40px;
  height: calc(100vh - 100px);
  z-index: 10;
  position: relative;
}
</style>
