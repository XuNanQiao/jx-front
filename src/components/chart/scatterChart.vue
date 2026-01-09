<!--
 * @Author: ZHAO
 * @Date: 2026-01-09 16:15:00
 * @LastEditors: ZHAO
 * @Description: 散点图组件
 * @FilePath: \jx\src\components\chart\scatterChart.vue
 *
-->
<template>
  <v-chart :option="chartOption" :autoresize="true" :style="chartStyle" />
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { ScatterChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed } from "vue";
import VChart from "vue-echarts";

const props = defineProps({
  mockData: { type: Boolean, default: false },
  width: { type: String, default: "100%" },
  height: { type: String, default: "100%" },
  data: { type: Array as () => [number, number][], default: () => [] },
  xAxisName: { type: String, default: "X轴" },
  yAxisName: { type: String, default: "Y轴" },
  symbolSize: { type: Number, default: 8 },
  color: { type: String, default: "#5470c6" },
  opacity: { type: Number, default: 0.6 },
  grid: {
    type: Object as () => { left?: number; right?: number; top?: number; bottom?: number },
    default: () => ({
      left: 60,
      right: 40,
      top: 40,
      bottom: 60,
    }),
  },
});

// 注册 ECharts 组件
use([CanvasRenderer, ScatterChart, GridComponent, TooltipComponent, LegendComponent]);

const chartStyle = computed(() => `height:${props.height}; width:${props.width}`);

const chartOption = computed<EChartsOption>(() => {
  let scatterData = props.data;

  // 如果是模拟数据，生成随机散点
  if (props.mockData) {
    scatterData = [];
    for (let i = 0; i < 100; i++) {
      const temp = 20 + Math.random() * 10;
      const humidity = 70 - temp * 1.5 + Math.random() * 10;
      scatterData.push([temp, humidity]);
    }
  }

  return {
    grid: {
      left: props.grid?.left,
      right: props.grid?.right,
      top: props.grid?.top,
      bottom: props.grid?.bottom,
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#1890ff",
      borderWidth: 1,
      textStyle: {
        color: "#ffffff",
      },
      formatter: (params: any) => {
        return `${props.xAxisName}: ${params.value[0].toFixed(1)}<br/>${props.yAxisName}: ${params.value[1].toFixed(1)}`;
      },
    },
    xAxis: {
      name: props.xAxisName,
      nameLocation: "middle",
      nameGap: 35,
      nameTextStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
      axisLabel: {
        color: "#ffffff",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    yAxis: {
      name: props.yAxisName,
      nameLocation: "middle",
      nameGap: 45,
      nameTextStyle: {
        color: "#ffffff",
        fontSize: 14,
      },
      axisLabel: {
        color: "#ffffff",
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    series: [
      {
        type: "scatter",
        data: scatterData,
        symbolSize: props.symbolSize,
        itemStyle: {
          color: props.color,
          opacity: props.opacity,
        },
      },
    ],
  };
});
</script>

<style scoped lang="scss"></style>
