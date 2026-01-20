<!--
 * @Author: ZHAO
 * @Date: 2026-01-15 09:49:09
 * @LastEditTime: 2026-01-16 10:56:06
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\development\components\LogModal.vue
 * 
-->
<template>
  <a-modal
    :open="open"
    width="70%"
    :footer="null"
    destroy-on-close
    @cancel="handleCancel"
    @update:open="emit('update:open', $event)">
    <template #title>
      <div class="log-modal__header">
        <span>{{ title || '日志详情' }}</span>
        <div class="log-modal__actions">
          <span class="label text-white">自动换行</span>
          <a-switch size="small" v-model:checked="state.autoWrap" />
          <span class="label text-white ml-12">自动刷新</span>
          <a-switch size="small" v-model:checked="state.autoRefresh" />
        </div>
      </div>
    </template>
    <div class="pt-12px">
      <a-tabs class="mt-(-12px)" v-model:activeKey="state.activeTab" type="card">
        <a-tab-pane key="log" tab="日志">
          <div :class="['log-content', { wrap: state.autoWrap }]">
            <div v-if="displayLog?.exec_log">
              <pre v-if="state.autoWrap" class="log-text wrap">{{ displayLog.exec_log }}</pre>
              <div v-else class="log-text">{{ displayLog.exec_log }}</div>
            </div>
            <div v-else>暂无日志</div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="extension" tab="扩展">
          <div :class="['log-content', { wrap: state.autoWrap }]">
            <div v-if="displayExtension?.exec_log">
              <pre v-if="state.autoWrap" class="log-text wrap">{{ displayExtension.exec_log }}</pre>
              <div v-else class="log-text">{{ displayExtension.exec_log }}</div>
            </div>
            <div v-else>暂无扩展信息</div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { fetchModelJobLog } from '@/api/development'; // Import the new API function
import type { ModelInputOutput } from '@/types/model';
import { onUnmounted, reactive, ref, watch } from 'vue';

type Props = {
  open: boolean;
  title?: string;
  record?: ModelInputOutput | null;
};

const props = withDefaults(defineProps<Props>(), {
  open: false,
  title: '日志详情',
  record: null,
});

const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>();

const state = reactive({
  autoWrap: true,
  autoRefresh: false,
  activeTab: 'log',
});

const displayLog = ref<{ exec_log?: string; refresh_interval?: number }>({});
const displayExtension = ref<{ exec_log?: string }>({});
const time = ref(10);
const refreshTimer = ref<any | null>(null);

const clearLogRefresh = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
};

const fetchLogs = async () => {
  if (props.record?.id) {
    try {
      const response = await fetchModelJobLog(props.record.id);
      displayLog.value = response.data;
      time.value = response.data.refresh_interval;
    } catch (error) {
      console.error('日志查询失败:', error);
    }
  }
};

const startLogRefresh = () => {
  clearLogRefresh();
  refreshTimer.value = setInterval(() => {
    fetchLogs();
  }, time.value * 1000);
};
watch(
  () => props.record,
  (newRecord) => {
    if (newRecord) {
      fetchLogs();
    }
  },
  { immediate: true, deep: true },
);
watch(
  () => state.autoRefresh,
  (autoRefresh) => {
    if (autoRefresh) {
      fetchLogs();
      startLogRefresh();
    } else {
      clearLogRefresh();
    }
  },
);
watch(
  () => props.open,
  (visible) => {
    if (!visible) {
      clearLogRefresh();
      state.autoRefresh = false;
      state.activeTab = 'log';
    }
  },
);

const handleCancel = () => {
  emit('update:open', false);
};

onUnmounted(() => {
  clearLogRefresh();
});
</script>

<style scoped lang="scss">
.log-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
}

.log-modal__actions {
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    font-size: 12px;
  }
}

.log-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 12px;
  max-height: 360px;
  overflow: auto;

  pre {
    margin: 0;
    color: #fff;
    font-size: 12px;
    white-space: pre;
    word-break: break-all;
  }

  &.wrap pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.log-extension {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  min-height: 160px;
  color: #fff;
}

.ml-12 {
  margin-left: 12px;
}
:deep(.ant-tabs) {
  .ant-tabs-nav {
    margin-bottom: 0;
  }
  .ant-tabs-content {
    background: #2e3f60;
  }
}
</style>
