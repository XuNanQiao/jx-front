<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-09 10:41:44
 * @LastEditors: ZHAO
 * @Description: Chart view component
 * @FilePath: \jx\src\components\chart\chartView.vue
 * 
-->
<template>
  <v-chart :option="chartOption" :autoresize="true" :style="chartStyle" />
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed } from "vue";
import VChart from "vue-echarts";

const props = defineProps({
  axisPointerShow: { type: Boolean, default: true },
  showAxis: { type: Boolean, default: true },
  mockData: { type: Boolean, default: false },
  width: { type: String, default: "100%" },
  height: { type: String, default: "100%" },
  xAxisData: { type: Array as () => string[], default: () => [] },
  yAxisData: { type: Array as () => number[][], default: () => [[]] },
  showAreaStyle: { type: Boolean, default: true },
  grid: {
    type: Object as () => { left?: number; right?: number; top?: number; bottom?: number },
    default: () => ({
      left: 40,
      right: 20,
      top: 20,
      bottom: 30,
    }),
  },
  areaColors: {
    type: Array as () => Array<{ start: string; end: string }>,
    default: () => [{ start: "rgba(24, 144, 255, 0.3)", end: "rgba(24, 144, 255, 0.05)" }],
  },
});

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

const chartStyle = computed(() => `height:${props.height}; width:${props.width}`);

const chartOption = computed<EChartsOption>(() => {
  let yAxisData = props.yAxisData || [];
  let xAxisData = props.xAxisData;
  if (props.mockData) {
    yAxisData = [Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))];
    xAxisData = Array.from({ length: 10 }, (_, i) => `Label ${i + 1}`);
  }
  let series = [];
  for (let i = 0; i < yAxisData.length; i++) {
    const colors = props.areaColors[i] || props.areaColors[0];
    const seriesItem: any = {
      type: "line" as const,
      smooth: true,
      data: yAxisData[i],
      showSymbol: false,
      lineStyle: {
        width: 2,
      },
      symbol: "circle",
      symbolSize: 6,
    };

    // 根据 showAreaStyle 动态添加 areaStyle
    if (props.showAreaStyle) {
      seriesItem.areaStyle = {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: colors.start },
            { offset: 1, color: colors.end },
          ],
        },
      };
    }

    series.push(seriesItem);
  }
  return {
    grid: { left: props.grid?.left, right: props.grid?.right, top: props.grid?.top, bottom: props.grid?.bottom },
    xAxis: {
      type: "category",
      show: props.showAxis,
      data: xAxisData,
      axisLabel: {
        color: "#ffffff",
        formatter: (value: string) => {
          if (value.length > 5) {
            return value.slice(0, 5) + "\n" + value.slice(5);
          }
          return value;
        },
      },
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      axisPointer: {
        type: "line",
        // show: props.axisPointerShow,
        label: {
          show: true,
          backgroundColor: "#1890ff",
        },
        shadowStyle: {
          color: "rgba(24, 144, 255, 0.1)",
        },
      },
    },
    yAxis: {
      type: "value",
      show: props.showAxis,
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
      axisPointer: {
        type: "line",
        show: props.axisPointerShow,
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
    series,
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      borderColor: "#1890ff",
      borderWidth: 1,
      textStyle: {
        color: "#ffffff",
      },
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "rgba(24, 144, 255, 0.5)",
        },
      },
    },
  };
});
</script>

<style scoped lang="scss"></style>
