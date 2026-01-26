<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-23 18:02:29
 * @LastEditors: ZHAO
 * @Description: Chart view component
 * @FilePath: \jx\src\views\development\chat.vue
 *
-->
<template>
  <div class="relative w-full h-full">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      @node-click="onNodeClick"
      @node-context-menu="onNodeContextMenu"
      @drop.prevent="onDrop"
      @dragover.prevent>
      <Background />
    </VueFlow>

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
import { Background } from "@vue-flow/background";
import { Handle, Position, VueFlow, useVueFlow } from "@vue-flow/core";
import { computed, defineComponent, h, reactive, ref, watch } from "vue";

const props = defineProps({
  graphData: { type: Array, default: () => [] },
});

const emit = defineEmits<{
  (e: "add-node", payload: any): void;
  (e: "node-click", payload: any): void;
  (e: "node-delete", payload: any): void;
}>();

const nodes = ref<any[]>([]);
const edges = ref<any[]>([]);
const selectedId = ref<string | null>(null);
const { project } = useVueFlow();

// 布局常量
const LAYOUT = {
  BASE_X: 600,
  BASE_Y: 50,
  OFFSET_X: 160,
  OFFSET_Y: 160,
} as const;

// 节点样式常量
const NODE_STYLE_BASE = {
  color: "#ffffff",
  border: "2px solid #18e2ad",
  borderRadius: "4px",
  padding: "8px 12px",
  width: "100px",
  height: "30px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const;

// 边样式常量
const EDGE_STYLE = {
  stroke: "#64acd1",
  strokeWidth: 2,
} as const;

const EDGE_MARKER = {
  type: "arrowclosed",
  width: 15,
  height: 15,
  color: "#64acd1",
} as const;

// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  node: null as any,
});

// 工具函数
const calcHandleLeft = (index: number, total: number) => `${((index + 1) / (total + 1)) * 100}%`;
const buildHandleIds = (count: number, prefix: string) =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index}`);
const getNodeId = (item: any) => item.title + (item.idVal ?? "");
const getNodeStyle = (nodeId: string) => ({
  ...NODE_STYLE_BASE,
  background: selectedId.value === nodeId ? "#18e2ad" : "#35658b",
  boxShadow: selectedId.value === nodeId ? "0 0 0 4px rgba(24, 226, 173, 0.35)" : "none",
});

// 自定义节点组件
const MultiHandleNode = defineComponent({
  name: "MultiHandleNode",
  props: {
    id: { type: String, required: true },
    data: { type: Object as () => any, required: true },
    label: { type: String, default: "" },
  },
  setup(props) {
    const targetHandles = computed(() => props.data?.targetHandles ?? []);
    const sourceHandles = computed(() => props.data?.sourceHandles ?? []);
    const displayLabel = computed(() => props.data?.label ?? props.label ?? "");

    return () =>
      h("div", { class: "multi-handle-node" }, [
        ...targetHandles.value.map((handleId: string, index: number) =>
          h(Handle, {
            id: handleId,
            type: "target",
            position: props.data?.targetPosition ?? Position.Top,
            style: { left: calcHandleLeft(index, targetHandles.value.length) },
            key: `${props.id}-target-${handleId}`,
          }),
        ),
        h("div", { class: "multi-handle-node__body" }, displayLabel.value),
        ...sourceHandles.value.map((handleId: string, index: number) =>
          h(Handle, {
            id: handleId,
            type: "source",
            position: props.data?.sourcePosition ?? Position.Bottom,
            style: { left: calcHandleLeft(index, sourceHandles.value.length) },
            key: `${props.id}-source-${handleId}`,
          }),
        ),
      ]);
  },
});

const nodeTypes: any = { multi: MultiHandleNode };

// 创建节点的通用函数
const createNode = (item: any, position: { x: number; y: number }, handles: { source: number; target: number }) => {
  const nodeId = getNodeId(item);
  return {
    id: nodeId,
    type: "multi",
    position,
    label: item.title,
    data: {
      ...item,
      label: item.title,
      sourceHandles: buildHandleIds(handles.source, "out"),
      targetHandles: buildHandleIds(handles.target, "in"),
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    style: getNodeStyle(nodeId),
  };
};

// 构建节点和边
const buildGraph = () => {
  if (!props.graphData?.length) {
    nodes.value = [];
    edges.value = [];
    return;
  }

  const inputs = props.graphData.filter((n: any) => n.type === "input");
  const outputs = props.graphData.filter((n: any) => n.type === "output");
  const operators = props.graphData.filter((n: any) => n.type === "operator");

  const nodeList: any[] = [];

  // 输入节点（均匀分布）
  const inputStartX = LAYOUT.BASE_X - ((inputs.length - 1) * LAYOUT.OFFSET_X) / 2;
  inputs.forEach((item: any, index: number) => {
    nodeList.push(
      createNode(
        item,
        { x: inputStartX + index * LAYOUT.OFFSET_X, y: LAYOUT.BASE_Y },
        { source: operators.length, target: 0 },
      ),
    );
  });

  // 操作节点
  operators.forEach((item: any) => {
    nodeList.push(
      createNode(
        item,
        { x: LAYOUT.BASE_X, y: LAYOUT.BASE_Y + LAYOUT.OFFSET_Y },
        { source: outputs.length, target: inputs.length },
      ),
    );
  });

  // 输出节点（均匀分布）
  const outputStartX = LAYOUT.BASE_X - ((outputs.length - 1) * LAYOUT.OFFSET_X) / 2;
  outputs.forEach((item: any, index: number) => {
    nodeList.push(
      createNode(
        item,
        { x: outputStartX + index * LAYOUT.OFFSET_X, y: LAYOUT.BASE_Y + LAYOUT.OFFSET_Y * 2 },
        { source: 0, target: operators.length },
      ),
    );
  });

  // 创建边（连接线）
  const edgeList: any[] = [];

  // 输入 -> 操作节点
  operators.forEach((operator: any, operatorIndex: number) => {
    inputs.forEach((input: any, inputIndex: number) => {
      edgeList.push(createEdge(getNodeId(input), getNodeId(operator), `out-${operatorIndex}`, `in-${inputIndex}`));
    });
  });

  // 操作节点 -> 输出
  operators.forEach((operator: any, operatorIndex: number) => {
    outputs.forEach((output: any, outputIndex: number) => {
      edgeList.push(createEdge(getNodeId(operator), getNodeId(output), `out-${outputIndex}`, `in-${operatorIndex}`));
    });
  });

  nodes.value = nodeList;
  edges.value = edgeList;
};

// 创建边的通用函数
const createEdge = (source: string, target: string, sourceHandle: string, targetHandle: string) => ({
  id: `e-${source}-${target}-${sourceHandle}`,
  source,
  target,
  sourceHandle,
  targetHandle,
  type: "default",
  animated: false,
  style: EDGE_STYLE,
  markerEnd: EDGE_MARKER,
});

// 监听数据变化
watch(() => props.graphData, buildGraph, { deep: true, immediate: true });

// 事件处理
const onNodeClick = (event: any) => {
  selectedId.value = event.node.id;
  emit("node-click", { ...event.node.data, id: event.node.id });
  buildGraph();
};

const onNodeContextMenu = (event: any) => {
  event.event.preventDefault();
  Object.assign(contextMenu, {
    visible: true,
    x: event.event.clientX,
    y: event.event.clientY,
    node: { ...event.node.data, id: event.node.id },
  });
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  const raw = event.dataTransfer?.getData("application/json");
  if (!raw) return;

  try {
    const nodeData = JSON.parse(raw);
    const position = project({ x: event.clientX, y: event.clientY });
    emit("add-node", { ...nodeData, ...position });
  } catch (err) {
    console.error("Failed to parse drop data:", err);
  }
};

const closeContextMenu = () => {
  contextMenu.visible = false;
  contextMenu.node = null;
};

const handleDeleteNode = () => {
  if (contextMenu.node) {
    emit("node-delete", contextMenu.node);
  }
  closeContextMenu();
};
</script>

<style lang="scss">
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>

<style scoped lang="scss">
:deep(.vue-flow__node) {
  overflow: unset !important;
  z-index: 999 !important;
}
:deep(.vue-flow__handle) {
  width: 6px;
  height: 6px;
  opacity: 1 !important;
  background: #18e2ad !important;
  border: none !important;
  pointer-events: auto !important;
}

:deep(.vue-flow__handle-top) {
  top: -3px;
}

:deep(.vue-flow__handle-bottom) {
  bottom: -3px;
}

.multi-handle-node {
  position: relative;
  width: 100%;
  height: 100%;
}

.multi-handle-node__body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
