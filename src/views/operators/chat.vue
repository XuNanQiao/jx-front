<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-13 15:07:48
 * @LastEditors: ZHAO
 * @Description: Chart view component
 * @FilePath: \jx\src\views\operators\chat.vue
 * 
-->
<template>
  <v-chart ref="chartRef" :option="chartOption" :autoresize="true" :style="chartStyle" @dragover.prevent @drop="onDrop" />
</template>

<script setup lang="ts">
import type { EChartsOption } from "echarts";
import { GraphChart } from "echarts/charts";
import { GridComponent, TooltipComponent, TitleComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed, ref } from "vue";
import VChart from "vue-echarts";

const props = defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "100%" },
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
  graphData: { type: Array, default: () => [] },
});

const emit = defineEmits<{
  (e: "add-node", payload: any): void;
}>();
const chartRef = ref<any>(null);

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  try {
    const raw = e.dataTransfer?.getData("application/json");
    if (!raw) return;
    const nodeData = JSON.parse(raw);
    const el = (chartRef.value && (chartRef.value as any).$el) || chartRef.value;
    const rect = el?.getBoundingClientRect ? el.getBoundingClientRect() : { left: 0, top: 0 };
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    emit("add-node", { ...nodeData, x, y });
  } catch (err) {
    console.error("drop parse error", err);
  }
};

// 注册 ECharts 组件
use([CanvasRenderer, GraphChart, GridComponent, TooltipComponent, TitleComponent]);

const chartStyle = computed(() => `height:${props.height}; width:${props.width}`);

const chartOption = computed<EChartsOption>(() => {
  const hasGraphData = props.graphData && props.graphData.length;
  if (!hasGraphData) return;
  const inputs = props.graphData.filter((n: any) => n.attribute === "输入");
  const outputs = props.graphData.filter((n: any) => n.attribute === "输出");
  const others = props.graphData.filter((n: any) => !n.attribute);
  const base = 300;
  const offset = 40;
  let inputsList = inputs.map((item, index) => {
    const multiplier = Math.ceil(index / 2);
    let x = index % 2 === 1 ? base + offset * multiplier : base - offset * multiplier;
    return {
      name: item.title,
      x,
      y: 50,
      attribute: item.attribute,
      id: item.title, // 使用标题作为 id，保证与 links 的 source/target 一致匹配
    };
  });
  let outputsList = outputs.map((item, index) => {
    const multiplier = Math.ceil(index / 2);
    let x = index % 2 === 1 ? base + offset * multiplier : base - offset * multiplier;
    return {
      name: item.title,
      x: x,
      y: 150,
      attribute: item.attribute,
      id: item.title,
    };
  });
  let othersList = others.map((item) => {
    return {
      name: item.title,
      x: base,
      y: 100,
      attribute: item.attribute,
      id: item.title,
    };
  });
  const data = [...inputsList, ...outputsList, ...othersList];

  let links: Array<{ source: number | string; target: number | string; lineStyle?: any }> = [];

  const attrLinks: Array<{ source: number | string; target: number | string; lineStyle?: any }> = [];
  if (hasGraphData) {
    others.forEach((node: any) => {
      inputs.forEach((inp: any) => {
        attrLinks.push({
          source: inp.title ?? inp.name,
          target: node.title ?? node.name,
          lineStyle: { color: "#64acd1", width: 2, opacity: 1 },
        });
      });
      outputs.forEach((out: any) => {
        attrLinks.push({
          source: node.title ?? node.name,
          target: out.title ?? out.name,
          lineStyle: { color: "#64acd1", width: 2, opacity: 1 },
        });
      });
    });
  }

  links =
    attrLinks.length > 0
      ? attrLinks
      : data.length > 1
      ? data.slice(1).map((node: any, idx: number) => ({
          source: data[idx].name,
          target: node.name,
        }))
      : [];

  return {
    title: {
      text: "可拖动的方形关系图",
      left: "center",
      show: false,
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "none",
        symbolSize: 50,
        roam: true,
        draggable: true,
        symbol: "roundRect",
        itemStyle: {
          color: "#35658b", // 节点填充色
          borderColor: "#18e2ad", // 节点边框色
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
        },
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [6, 12],
        data,
        links,
        lineStyle: {
          opacity: 1,
          width: 2,
          curveness: 0,
          color: "#64acd1",
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: { width: 4 },
        },
      },
    ],
  } as unknown as EChartsOption;
});
</script>

<style scoped lang="scss"></style>
