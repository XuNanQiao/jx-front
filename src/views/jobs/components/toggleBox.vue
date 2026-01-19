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
import { RightCircleOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, watch } from "vue";
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
    background: #334870;
    border: 1px solid rgba(255, 255, 255, 0.3);
    .anticon {
      transition: transform 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
  .filter-panel {
    height: calc(100vh - 90px);
    width: 100%;
    background: #334870;
    border-radius: 4px;
    overflow-y: auto;
    padding: 16px;
    overflow-x: hidden;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: transform 0.5s;
    transform: scaleX(0);
  }
}
.left {
  top: 88px;
  left: 0;
  &.open {
    width: 280px !important;
    .icon {
      .anticon {
        transform: rotate(-180deg);
      }
    }
  }
  .icon {
    right: -30px;
    border-radius: 0 5px 5px 0;
    .anticon {
      transform: rotate(0deg);
    }
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
    .icon {
      .anticon {
        transform: rotate(0deg);
      }
    }
  }
  .icon {
    left: -30px;
    border-radius: 5px 0 0 5px;
    .anticon {
      /* 当右侧面板展开时，向另一个方向旋转以示区分 */
      transform: rotate(-180deg);
    }
  }
  .filter-panel {
    padding: 0;
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
