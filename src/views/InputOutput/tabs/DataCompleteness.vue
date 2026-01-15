<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:05:28
 * @LastEditTime: 2026-01-15 09:41:33
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\InputOutput\tabs\DataCompleteness.vue
 * 
-->
<template>
  <div class="query-bar page">
    <div class="query-left">
      <a-space :size="12">
        <a-select v-model:value="metric" :options="metricOptions" style="width: 160px" />
        <a-select v-model:value="mode" :options="modeOptions" style="width: 120px" />
        <template v-if="mode === 'year'">
          <a-date-picker v-model:value="selectedYear" picker="year" style="width: 160px" />

          <!-- <a-select v-model:value="selectedYear" :options="yearOptions" style="width: 120px" /> -->
        </template>
        <template v-else-if="mode === 'month'">
          <a-date-picker v-model:value="selectedMonth" picker="month" style="width: 160px" />
        </template>
        <template v-else>
          <a-date-picker v-model:value="selectedDay" style="width: 160px" />
        </template>
        <a-button type="primary" @click="onQuery">查询</a-button>
      </a-space>
    </div>
    <div class="query-right">
      <a-space>
        <a-button @click="onBack">返回上层</a-button>
        <a-button @click="onBrowse">浏览</a-button>
        <a-button @click="onDownload">下载</a-button>
      </a-space>
    </div>
  </div>

  <a-table
    class="model-table"
    :bordered="false"
    :columns="columns"
    :data-source="filteredData"
    row-key="key"
    :pagination="pagination"
    :loading="loading" />
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { Dayjs } from 'dayjs';
import { message, Modal } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { getCompleteness } from '@/api/inputOutput';

interface CompletenessRow {
  key: string;
  device: string;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
  m7: number;
  m8: number;
  m9: number;
  m10: number;
  m11: number;
  m12: number;
}

const router = useRouter();

const metricOptions = [{ label: '数据完整度', value: 'completeness' }];
const modeOptions = [
  { label: '按年查询', value: 'year' },
  { label: '按月查询', value: 'month' },
  { label: '按天查询', value: 'day' },
];
const metric = ref<string>('completeness');
const mode = ref<string>('year');

const selectedYear = ref<Dayjs | null>(null);
const selectedMonth = ref<Dayjs | null>(null);
const selectedDay = ref<Dayjs | null>(null);

const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

const columns = ref<any[]>([]);
const dataSource = ref<CompletenessRow[]>([]);
const loading = ref(false);

const makeColumns = () => {
  const cols: any[] = [{ title: '设备', dataIndex: 'device', key: 'device', width: 180 }];
  for (let i = 1; i <= 12; i++) {
    cols.push({
      title: `${i}月`,
      dataIndex: `m${i}`,
      key: `m${i}`,
      width: 80,
      customRender: ({ text }: any) => `${text}%`,
    });
  }
  columns.value = cols;
};

const loadData = async (params?: any) => {
  loading.value = true;
  try {
    const p: any = params || {};
    if (mode.value === 'year') {
      p.year = p.year || selectedYear.value;
    } else if (mode.value === 'month') {
      p.month = p.month || (selectedMonth ? selectedMonth.format('YYYY-MM') : undefined);
    } else if (mode.value === 'day') {
      p.day = p.day || (selectedDay ? selectedDay.format('YYYY-MM-DD') : undefined);
    }
    p.metric = metric.value;
    const res: any = await getCompleteness(p);
    const rows = res?.data?.rows || [];
    dataSource.value = rows;
    pagination.total = rows.length;
  } catch (err) {
    console.error(err);
    message.error('加载数据失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  makeColumns();
  loadData();
});

const filteredData = computed(() => dataSource.value);

const onQuery = async () => {
  pagination.current = 1;
  await loadData();
};

const onBack = () => {
  router.back();
};

const onBrowse = () => {
  Modal.info({ title: '浏览', content: '打开浏览视图（示例）' });
};

const onDownload = () => {
  message.success('开始下载（示例）');
};
</script>

<style scoped>
.query-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.query-left {
}
.query-right {
}
.data-completeness-card {
  :deep(.ant-card-head) {
    color: var(--theme-info);
  }
  :deep(.ant-card-body) {
    background: transparent;
  }
  /* 查询区按钮与选择器主题色（保留小范围覆盖） */
  :deep(.query-bar .ant-btn) {
    color: #ffffff;
  }
}

.query-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.query-left {
}
.query-right {
}
</style>
