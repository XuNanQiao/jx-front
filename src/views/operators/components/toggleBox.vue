<template>
  <div class="box" :class="(open ? 'open' : '') + ' ' + position">
    <div class="icon" @click="openHand()">
      <RightCircleOutlined />
    </div>
    <div class="filter-panel">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RightCircleOutlined } from "@ant-design/icons-vue";
const props = defineProps<{
  position: "left" | "right";
  openVal?: boolean;
}>();

const open = ref(false);
const openHand = () => {
  open.value = !open.value;
};
watch(
  () => props.openVal,
  (newVal) => {
    if (newVal !== undefined) {
      open.value = newVal;
    }
  }
);
onMounted(() => {
  if (props.openVal !== undefined) {
    open.value = props.openVal;
  }
});
</script>

<style scoped lang="scss">
.box {
  width: 0px;
  transition: width 0.5s;
  height: calc(100vh - 90px);
  position: fixed;
  flex-shrink: 0;
  z-index: 9999;
  /* 避免覆盖 Ant Design 的弹出层，降低 z-index 以允许下拉可点击 */
  z-index: 1000;
  .icon {
    width: 30px;
    position: absolute;
    line-height: 30px;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .filter-panel {
    height: calc(100vh - 90px);
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow-y: auto;
    padding: 16px;
    overflow-x: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.5s;
    transform: scaleX(0);
  }
}
.left {
  top: 88px;
  left: 0;
  &.open {
    width: 280px !important;
  }
  .icon {
    right: -30px;
    border-radius: 0 5px 5px 0;
  }
  .filter-panel {
    transform-origin: left;
  }
}
.right {
  right: 0;
  top: 88px;
  transform-origin: right;
  &.open {
    width: 280px !important;
  }
  .icon {
    left: -30px;
    border-radius: 5px 0 0 5px;
  }
  .filter-panel {
    padding-top: 0;
    transform-origin: right;
  }
}
.open {
  .filter-panel {
    transform: scaleX(1);
  }
}
.data-panel {
  width: 100%;
  height: calc(100vh - 90px);
}
::-webkit-scrollbar {
  display: none;
}
</style>
