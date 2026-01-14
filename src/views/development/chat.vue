<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-13 17:10:37
 * @LastEditors: ZHAO
 * @Description: Chart view component
 * @FilePath: \jx\src\views\operators\chat.vue
 * 
-->
<template>
  <v-chart ref="chartRef" :option="chartOption" :autoresize="true" :style="chartStyle" @dragover.prevent @drop="onDrop" @click="onChartClick" />
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
  (e: "node-click", payload: any): void;
}>();
const chartRef = ref<any>(null);
const selectedId = ref<string | null>(null);

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

const onChartClick = (params: any) => {
  // 如果点击空白或非节点区域，取消选中
  if (!params || !params.data) {
    selectedId.value = null;
    return;
  }
  // 点击节点时，params.data 包含节点信息
  if (params.data) {
    selectedId.value = params.data.id ?? params.data.name ?? null;
    emit("node-click", params.data);
  }
};

// 注册 ECharts 组件
use([CanvasRenderer, GraphChart, GridComponent, TooltipComponent, TitleComponent]);

const chartStyle = computed(() => `height:${props.height}; width:${props.width}`);

const chartOption = computed<EChartsOption>(() => {
  const hasGraphData = props.graphData && props.graphData.length;
  console.log(props.graphData ,"---------props.graphData ");
  
  if (!hasGraphData) return;
  const inputs = props.graphData.filter((n: any) => n.attribute === "输入");
  const outputs = props.graphData.filter((n: any) => n.attribute === "输出");
  const others = props.graphData.filter((n: any) => !n.attribute);
  const base = 300;
  const offset = 20;
  let inputsList = inputs.map((item: any, index) => {
    const multiplier = Math.ceil(index / 2);
    let x = index % 2 === 1 ? base + offset * multiplier : base - offset * multiplier;
    return {
      name: item.title,
      x,
      y: 50,
      attribute: item.attribute,
      id: item.title + (item.key ?? ""),
    };
  });
  let outputsList = outputs.map((item: any, index) => {
    const multiplier = Math.ceil(index / 2);
    let x = index % 2 === 1 ? base + offset * multiplier : base - offset * multiplier;
    return {
      name: item.title,
      x: x,
      y: 90,
      attribute: item.attribute,
      id: item.title + (item.key ?? ""),
    };
  });
  let othersList = others.map((item: any) => {
    return {
      name: item.title,
      x: base,
      y: 70,
      attribute: item.attribute,
      id: item.title + (item.key ?? ""),
    };
  });
  const data = [...inputsList, ...outputsList, ...othersList].map((d) => {
    // 若为选中节点，使用高亮样式
    if (selectedId.value && (d.id === selectedId.value || d.name === selectedId.value)) {
      return {
        ...d,
        itemStyle: {
          color: "#18e2ad",
          borderColor: "#18e2ad",
          borderWidth: 4,
        },
      };
    }
    return d;
  });

  let links: Array<{ source: number | string; target: number | string; lineStyle?: any }> = [];

  const attrLinks: Array<{ source: number | string; target: number | string; lineStyle?: any }> = [];
  if (hasGraphData) {
    others.forEach((node: any) => {
      inputs.forEach((inp: any) => {
        attrLinks.push({
          source: inp.title + (inp.key ?? ""),
          target: node.title + (node.key ?? ""),
        });
      });
      outputs.forEach((out: any) => {
        attrLinks.push({
          source: node.title + (node.key ?? ""),
          target: out.title + (out.key ?? ""),
        });
      });
    });
  }

  links = attrLinks.length > 0 ? attrLinks : [];

  return ({
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
        roam: true,
        draggable: true,
        symbol: "rect",
        symbolSize: [100, 30],
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
        // edgeSymbolSize: [6, 12],
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
  } as unknown) as EChartsOption;
});
</script>

<style scoped lang="scss"></style>
