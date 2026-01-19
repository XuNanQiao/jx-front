<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-09 11:58:26
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\InputOutput\tabs\DataStructure.vue
 * 
-->
<template>
  <div class="tableComPage">
    <!-- 筛选区域 -->
    <div class="filter-section flex-between page">
      <a-space :size="16" wrap>
        <a-button type="primary" @click="handleEdit()">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除 ({{ selectedRowKeys.length }})
        </a-button>
      </a-space>
      <a-space :size="16" wrap>
        <div class="filter-inter">
          <a-input v-model:value="searchKeyword" placeholder="请输入关键词搜索" style="width: 220px" allow-clear>
            <template #suffix>
              <SearchOutlined />
            </template>
          </a-input>
        </div>
      </a-space>
    </div>

    <!-- 表格 -->
    <a-table
      :columns="columnsDataStructure"
      :data-source="filteredData"
      :loading="loading"
      :pagination="paginationConfig"
      :row-selection="rowSelection"
      @change="handleTableChange"
      row-key="id"
      class="model-table"
      :scroll="{ y: 'calc(100vh - 300px)' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="text" class="text-white" size="small" @click="handleEdit(record)">编辑</a-button>
        </template>
      </template>
    </a-table>
  </div>
  <!-- 新增/编辑弹窗组件 -->
  <DataStructureForm :modelInputOutputId="modelInputOutputId" ref="dataFormRef" @saved="handleSaved" />
</template>

<script setup lang="ts">
import { getDataStructureList, batchDeleteDataStructures } from '@/api/inputOutput';
import type { DataStructure } from '@/types/model';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { TableProps } from 'ant-design-vue';
import { message, Modal } from 'ant-design-vue';
import { Dayjs } from 'dayjs';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import VChart from 'vue-echarts';
import { useRouter, useRoute } from 'vue-router';
import { columnsDataStructure } from '../index';
import DataStructureForm from './DataStructureForm.vue';

const router = useRouter();
const route = useRoute();

// 获取当前模型输入输出的ID
const modelInputOutputId = computed(() => (route.params.id as string) || '');

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300,
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// 加载状态
const loading = ref(false);

// 筛选条件
const filters = reactive<{
  keyword: string;
  category: string | undefined;
  completenessDateRange: [Dayjs, Dayjs] | null;
  dataInputDateRange: [Dayjs, Dayjs] | null;
}>({
  keyword: '',
  category: undefined,
  completenessDateRange: null,
  dataInputDateRange: null,
});

// 选中的行
const selectedRowKeys = ref<string[]>([]);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

// data source will be loaded from real API
const dataSource = ref<DataStructure[]>([]);

const loadData = async () => {
  if (!modelInputOutputId.value) {
    message.error('缺少模型输入输出ID参数');
    return;
  }

  loading.value = true;
  try {
    console.log('📤 正在加载数据结构列表，model_input_output_id:', modelInputOutputId.value);
    let dataParams: any = {
      model_input_output_id: modelInputOutputId.value,
      page: pagination.current,
      size: pagination.pageSize,
    };
    const res: any = await getDataStructureList(dataParams);
    console.log('📥 数据结构列表响应:', res);

    if (res?.code === 200) {
      // 后端返回的数据可能在 res.data.items 或 res.data
      const items = res.data?.items || res.data || [];
      dataSource.value = items;
      pagination.total = res.data?.total || items.length;
      console.log('✅ 数据结构列表加载成功，共', pagination.total, '条');
    } else {
      console.error('❌ 数据结构列表加载失败:', res);
    }
  } catch (err: any) {
    console.error('❌ 数据结构列表加载错误:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// 搜索关键词（用于防抖）
const searchKeyword = ref('');

// 监听搜索关键词变化（带防抖）
const debouncedSearch = debounce(() => {
  filters.keyword = searchKeyword.value;
}, 300);

watch(searchKeyword, () => {
  debouncedSearch();
});

// 筛选后的数据
const filteredData = computed(() => {
  let result = [...dataSource.value];

  // 关键词搜索
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    result = result.filter((item) => {
      const name = item.name?.toLowerCase() || '';
      const column = item.column?.toLowerCase() || '';
      // 支持 dataType 和 data_type 两种字段名
      const dataType = (item.dataType || item.data_type || '').toLowerCase();
      return name.includes(keyword) || column.includes(keyword) || dataType.includes(keyword);
    });
  }

  return result;
});

// 分页配置（基于过滤后的数据）
const paginationConfig = computed(() => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`,
}));

// 行选择配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
  getCheckboxProps: (record: DataStructure) => ({
    name: record.name,
  }),
}));

// 表格变化处理（排序、分页）
const handleTableChange: TableProps['onChange'] = (paginationConfig, filters, sorter: any) => {
  // 更新分页

  if (paginationConfig.current) {
    pagination.current = paginationConfig.current;
  }
  if (paginationConfig.pageSize) {
    pagination.pageSize = paginationConfig.pageSize;
  }
  loadData();
  // 处理排序
  if (sorter.field) {
    const { field, order } = sorter;
    if (order) {
      dataSource.value.sort((a, b) => {
        const aValue = a[field as keyof DataStructure];
        const bValue = b[field as keyof DataStructure];

        if (order === 'ascend') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
  }
};

// 新建
const dataFormRef = ref<any>(null);

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的数据');
    return;
  }

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条数据吗？`,
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await batchDeleteDataStructures(selectedRowKeys.value);
        if (res.code === 200) {
          selectedRowKeys.value = [];
          await loadData();
        }
      } catch (error: any) {
        console.error('批量删除失败:', error);
      }
    },
  });
};
const handleEdit = (record?: DataStructure) => {
  dataFormRef.value?.openModal?.(record);
};
const handleSaved = async () => {
  // 保存成功后刷新列表
  await loadData();
};
</script>

<style scoped lang="scss"></style>
