<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-23 16:02:54
 * @LastEditors: ZHAO
 * @Description: Chart view component
 * @FilePath: \jx\src\views\development\chat.vue
 * 
-->
<template>
  <div style="position: relative; width: 100%; height: 100%">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      @node-click="onNodeClick"
      @node-context-menu="onNodeContextMenu"
      @pane-click="onPaneClick"
      @drop.prevent="onDrop"
      @dragover.prevent
      @drop="onDrop">
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

const nodes = ref<any[]>([]);
const edges = ref<any[]>([]);
const selectedId = ref<string | null>(null);

// 获取 VueFlow 实例
const { project } = useVueFlow();

// 右键菜单状态
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  node: null as any,
});

const calcHandleLeft = (index: number, total: number) => `${((index + 1) / (total + 1)) * 100}%`;

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

const nodeTypes = { multi: MultiHandleNode };
const buildHandleIds = (count: number, prefix: string) =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index}`);

// 构建节点和边
const buildGraph = () => {
  const hasGraphData = props.graphData && props.graphData.length;
  if (!hasGraphData) {
    nodes.value = [];
    edges.value = [];
    return;
  }

  const inputs = props.graphData.filter((n: any) => n.type === "input");
  const outputs = props.graphData.filter((n: any) => n.type === "output");
  const others = props.graphData.filter((n: any) => n.type === "operator");

  const base = 600;
  const offset = 160;
  const baseY = 50;
  const offsetY = 160;

  // 创建节点
  const nodeList: any[] = [];

  // 输入节点（均匀分布，防止重叠）
  const inputStartX = base - ((inputs.length - 1) * offset) / 2;
  inputs.forEach((item: any, index: number) => {
    const x = inputStartX + index * offset;
    const nodeId = item.title + (item.idVal ?? "");
    nodeList.push({
      id: nodeId,
      type: "multi",
      position: { x, y: baseY },
      label: item.title,
      data: {
        ...item,
        label: item.title,
        sourceHandles: buildHandleIds(others.length, "out"),
        targetHandles: [],
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      style: {
        background: selectedId.value === nodeId ? "#18e2ad" : "#35658b",
        color: "#ffffff",
        border: "2px solid #18e2ad",
        boxShadow: selectedId.value === nodeId ? "0 0 0 4px rgba(24, 226, 173, 0.35)" : "none",
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
      },
    });
  });

  // 操作节点
  others.forEach((item: any) => {
    const nodeId = item.title + (item.idVal ?? "");
    nodeList.push({
      id: nodeId,
      type: "multi",
      position: { x: base, y: baseY + offsetY },
      label: item.title,
      data: {
        ...item,
        label: item.title,
        sourceHandles: buildHandleIds(outputs.length, "out"),
        targetHandles: buildHandleIds(inputs.length, "in"),
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      style: {
        background: selectedId.value === nodeId ? "#18e2ad" : "#35658b",
        color: "#ffffff",
        border: "2px solid #18e2ad",
        boxShadow: selectedId.value === nodeId ? "0 0 0 4px rgba(24, 226, 173, 0.35)" : "none",
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
      },
    });
  });

  // 输出节点
  const outputsStartX = base - ((outputs.length - 1) * offset) / 2;

  outputs.forEach((item: any, index: number) => {
    const x = outputsStartX + index * offset;
    const nodeId = item.title + (item.idVal ?? "");
    nodeList.push({
      id: nodeId,
      type: "multi",
      position: { x, y: baseY + offsetY * 2 },
      label: item.title,
      data: {
        ...item,
        label: item.title,
        sourceHandles: [],
        targetHandles: buildHandleIds(others.length, "in"),
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      style: {
        background: selectedId.value === nodeId ? "#18e2ad" : "#35658b",
        color: "#ffffff",
        border: "2px solid #18e2ad",
        boxShadow: selectedId.value === nodeId ? "0 0 0 4px rgba(24, 226, 173, 0.35)" : "none",
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
      },
    });
  });

  // 创建边（连接线）- 使用 smoothstep 类型实现 S 型曲线
  const edgeList: any[] = [];

  others.forEach((node: any, operatorIndex: number) => {
    inputs.forEach((inp: any, inputIndex: number) => {
      edgeList.push({
        id: `e-${inp.title + (inp.idVal ?? "")}-${node.title + (node.idVal ?? "")}`,
        source: inp.title + (inp.idVal ?? ""),
        target: node.title + (node.idVal ?? ""),
        sourceHandle: `out-${operatorIndex}`,
        targetHandle: `in-${inputIndex}`,
        type: "smoothstep", // smoothstep 类型产生 S 型曲线
        animated: false,
        style: {
          stroke: "#64acd1",
          strokeWidth: 2,
        },
        markerEnd: {
          type: "arrowclosed",
          width: 15,
          height: 15,
          color: "#64acd1",
        },
      });
    });
    outputs.forEach((out: any, outputIndex: number) => {
      edgeList.push({
        id: `e-${node.title + (node.idVal ?? "")}-${out.title + (out.idVal ?? "")}`,
        source: node.title + (node.idVal ?? ""),
        target: out.title + (out.idVal ?? ""),
        sourceHandle: `out-${outputIndex}`,
        targetHandle: `in-${operatorIndex}`,
        type: "smoothstep", // smoothstep 类型产生 S 型曲线
        animated: false,
        style: {
          stroke: "#64acd1",
          strokeWidth: 2,
        },
        markerEnd: {
          type: "arrowclosed",
          width: 15,
          height: 15,
          color: "#64acd1",
        },
      });
    });
  });

  nodes.value = nodeList;
  edges.value = edgeList;
};

// 监听数据变化
watch(
  () => props.graphData,
  () => {
    buildGraph();
  },
  { deep: true, immediate: true },
);

// 节点点击
const onNodeClick = (event: any) => {
  selectedId.value = event.node.id;
  console.log(event, "--------event");

  emit("node-click", { ...event.node.data, id: event.node.id });
  buildGraph(); // 重新构建以更新选中样式
};

// 空白处点击
const onPaneClick = () => {
  /*   selectedId.value = null;
  buildGraph(); // 重新构建以更新选中样式 */
};

// 节点右键
const onNodeContextMenu = (event: any) => {
  event.event.preventDefault();
  contextMenu.visible = true;
  contextMenu.x = event.event.clientX;
  contextMenu.y = event.event.clientY;
  contextMenu.node = { ...event.node.data, id: event.node.id };
};

const onDrop = (event: DragEvent) => {
  console.log("------onDrop");

  event.preventDefault();
  try {
    const raw = event.dataTransfer?.getData("application/json");
    if (!raw) return;
    const nodeData = JSON.parse(raw);

    // 使用 project 转换坐标
    const position = project({ x: event.clientX, y: event.clientY });

    emit("add-node", { ...nodeData, x: position.x, y: position.y });
  } catch (err) {
    console.error("drop parse error", err);
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
