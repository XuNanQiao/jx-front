<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-12 17:33:53
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\operators\tabs\DataBrowse.vue
 *
-->
<template>
  <!-- 筛选区域 -->
  <div class="filter-section flex-between">
    <a-space :size="16" wrap>
      <a-button :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
        <template #icon>
          <DeleteOutlined />
        </template>
        批量删除 ({{ selectedRowKeys.length }})
      </a-button>
      <div class="switch-item">
        <span class="switch-label">包含定时</span>
        <a-switch v-model:checked="filters.autoMonitor" @change="searchHandler" />
      </div>
      <div class="switch-item">
        <span class="switch-label">包含组作业</span>
        <a-switch v-model:checked="filters.haveFile" @change="searchHandler" />
      </div>
      <div class="filter-inter">
        <span class="select-inter">状态：</span>
        <a-select :options="selectOptions" @change="searchHandler" v-model:value="filters.category" allowClear placeholder="请选择状态" style="width: 150px"></a-select>
      </div>
    </a-space>
    <a-space :size="16" wrap>
      <div class="filter-inter">
        <a-input v-model:value="filters.name" @change="debouncedSearch" @pressEnter="debouncedSearch" placeholder="搜索关键词" style="width: 220px" allow-clear>
          <template #suffix>
            <SearchOutlined />
          </template>
        </a-input>
      </div>
    </a-space>
  </div>

  <!-- 表格 -->
  <a-table
    :columns="browseColumns"
    :data-source="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-selection="rowSelection"
    @change="handleTableChange"
    row-key="id"
    class="model-table">
    <template #bodyCell="{ column, record, text }">
      <template v-if="column.key === 'action'">
        <a-dropdown :trigger="['hover']">
          <a-button type="text" size="small">
            <MoreOutlined class="text-16px text-white" />
          </a-button>
          <template #overlay>
            <a-menu @click="(e) => handleMenuClick(e, record)">
              <a-menu-item key="view">
                <EyeOutlined />
                <span style="margin-left: 8px">调整优先级</span>
              </a-menu-item>
              <a-menu-item key="view">
                <EyeOutlined />
                <span style="margin-left: 8px">再次运行</span>
              </a-menu-item>
              <a-menu-item key="edit">
                <EditOutlined />
                <span style="margin-left: 8px">重试</span>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="delete" danger>
                <DeleteOutlined />
                <span style="margin-left: 8px">删除</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { getList, deleteItem, batchDeleteItems, type ListQueryParams } from '@/api/inputOutput';
import type { ModelInputOutput } from '@/types/model';
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { browseColumns, selectOptions } from '../indexData';
import { debounce } from 'lodash-es';
import { useTablePagination } from '@/utils/useTablePagination';
const { pagination, handleTableChange: onTableChange } = useTablePagination(10);
const route = useRoute();
const router = useRouter();
// const id = computed(() => (route.params.id as string) || "");

// 加载状态
const loading = ref(false);

// 筛选条件
const filters = reactive({
  name: '',
  category: undefined,
  autoMonitor: false,
  haveFile: false,
});

// 选中的行
const selectedRowKeys = ref<string[]>([]);

// data source will be loaded from API
const dataSource = ref<ModelInputOutput[]>([]);

const loadData = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params: ListQueryParams = {
      size: pagination.pageSize,
      page: pagination.current,
      name: filters.name || undefined,
      category: filters.category || undefined,
    };
    const res = await getList(params);
    dataSource.value = res?.data?.items || [];
    pagination.total = res?.data?.total || 0;
  } catch (err) {
    console.error(err);
    dataSource.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// 监听搜索关键词变化（带防抖）
const debouncedSearch = debounce(() => {
  searchHandler();
}, 300);

// 组件卸载时取消防抖
onUnmounted(() => {
  debouncedSearch.cancel();
});

const searchHandler = () => {
  pagination.current = 1;
  loadData();
};
// 行选择配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys;
  },
  getCheckboxProps: (record: ModelInputOutput) => ({
    name: record.name,
  }),
}));

// 表格变化
const handleTableChange = (pag: any) => {
  onTableChange(pag);
  getList();
};

// 新建
const formModalRef = ref(null);
const handleCreate = (record?: any) => {
  if (formModalRef.value) {
    formModalRef.value.openModal(record);
  }
};

// 导入
const handleImport = () => {
  message.info('打开导入对话框');
};

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
        const res = await batchDeleteItems(selectedRowKeys.value);
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

// 菜单点击处理
const handleMenuClick = (e: { key: string }, record: ModelInputOutput) => {
  switch (e.key) {
    case 'view':
      // 跳转到详情页
      router.push({ name: 'ModelDevelopmentDetail', params: { id: record.id } });
      break;
    case 'edit':
      // 打开编辑弹窗并加载数据
      handleCreate(record);
      break;
    case 'copy':
      message.info(`复制: ${record.name}`);
      break;
    case 'delete':
      handleDelete(record.id);
      break;
  }
};

// 删除操作
const handleDelete = (id: string) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这条数据吗？删除后无法恢复。',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await deleteItem(id);
        if (res.code === 200) {
          await loadData();
        }
      } catch (error: any) {
        console.error('删除失败:', error);
      }
    },
  });
};

const handleSaved = async () => {
  // 保存成功后刷新列表
  await loadData();
};
</script>

<style scoped lang="scss"></style>
