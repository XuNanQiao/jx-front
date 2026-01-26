<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-23 14:50:01
 * @LastEditors: ZHAO
 * @Description: Chart view component
 * @FilePath: \jx\src\views\development\chatSave.vue
 * 
-->
<template>
  <div class="relative w-full h-full">
    <v-chart
      ref="chartRef"
      :option="chartOption"
      :autoresize="true"
      :style="chartStyle"
      @dragover.prevent
      @drop="onDrop"
      @click="onChartClick"
      @contextmenu="onContextMenu" />

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop>
      <div class="menu-item" @click="handleDeleteNode">
        <DeleteOutlined />
        <span>删除节点</span>
      </div>
    </div>

    <!-- 点击遮罩层关闭菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu-mask"
      @click="closeContextMenu"
      @contextmenu.prevent="closeContextMenu"></div>
  </div>
</template>

<script setup lang="ts">
import { DeleteOutlined } from "@ant-design/icons-vue";
import type { EChartsOption } from "echarts";
import { GraphChart } from "echarts/charts";
import { DataZoomComponent, GridComponent, TitleComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed, reactive, ref } from "vue";
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
  (e: "node-delete", payload: any): void;
}>();
const chartRef = ref<any>(null);
const selectedId = ref<string | null>(null);

// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  node: null as any,
});

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

// 右键菜单处理
const onContextMenu = (params: any) => {
  // 只处理节点的右键菜单
  if (params && params.data && params.event) {
    const event = params.event.event;
    event.preventDefault();

    // 设置菜单位置和节点信息
    contextMenu.visible = true;
    contextMenu.x = event.clientX;
    contextMenu.y = event.clientY;
    contextMenu.node = params.data;
  }
};

// 关闭右键菜单
const closeContextMenu = () => {
  contextMenu.visible = false;
  contextMenu.node = null;
};

// 处理删除节点
const handleDeleteNode = () => {
  if (contextMenu.node) {
    emit("node-delete", contextMenu.node);
  }
  closeContextMenu();
};

// 注册 ECharts 组件
use([CanvasRenderer, GraphChart, GridComponent, TooltipComponent, TitleComponent, DataZoomComponent]);

const chartStyle = computed(() => `height:${props.height}; width:${props.width}`);

const chartOption = computed<EChartsOption>(() => {
  const hasGraphData = props.graphData && props.graphData.length;
  if (!hasGraphData) return {};
  const inputs = props.graphData.filter((n: any) => n.type === "input");
  const outputs = props.graphData.filter((n: any) => n.type === "output");
  const others = props.graphData.filter((n: any) => n.type === "operator");
  const base = 300;
  const offset = 20;
  let inputsList = inputs.map((item: any, index) => {
    const multiplier = Math.ceil(index / 2);
    let x = index % 2 === 1 ? base + offset * multiplier : base - offset * multiplier;
    return {
      name: item.title,
      x,
      y: 50,
      id: item.title + (item.idVal ?? ""),
      ...item,
    };
  });
  let outputsList = outputs.map((item: any, index) => {
    const multiplier = Math.ceil(index / 2);
    let x = index % 2 === 1 ? base + offset * multiplier : base - offset * multiplier;
    return {
      name: item.title,
      x: x,
      y: 90,
      id: item.title + (item.idVal ?? ""),
      ...item,
    };
  });
  let othersList = others.map((item: any) => {
    return {
      name: item.title,
      x: base,
      y: 70,
      id: item.title + (item.idVal ?? ""),
      ...item,
    };
  });
  console.log(inputsList, outputsList, othersList, "------chat");

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
          source: inp.title + (inp.idVal ?? ""),
          target: node.title + (node.idVal ?? ""),
        });
      });
      outputs.forEach((out: any) => {
        attrLinks.push({
          source: node.title + (node.idVal ?? ""),
          target: out.title + (out.idVal ?? ""),
        });
      });
    });
  }

  links = attrLinks.length > 0 ? attrLinks : [];

  return {
    title: {
      text: "可拖动的方形关系图",
      left: "center",
      show: false,
    },
    tooltip: {
      show: false,
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    dataZoom: [
      {
        type: "inside",
        zoomOnMouseWheel: true,
        moveOnMouseMove: true,
        preventDefaultMouseMove: true,
      },
    ],
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
  } as unknown as EChartsOption;
});
</script>

<style scoped lang="scss">
.context-menu {
  position: fixed;
  z-index: 1000;
  background: var(--bg-primary, #1f1f1f);
  border: 1px solid var(--border-color, #3a3a3a);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  min-width: 120px;
  padding: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  color: var(--text-primary, #ffffff);
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--bg-hover, rgba(255, 255, 255, 0.1));
  }

  span {
    user-select: none;
  }
}

.context-menu-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}
</style>
