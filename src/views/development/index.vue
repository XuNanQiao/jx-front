<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-14 10:29:15
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\development\index.vue
 *
-->
<template>
  <a-card :bordered="false" title="模型开发" class="page">
    <!-- 筛选区域 -->
    <div class="filter-section flex-between">
      <a-space :size="16" wrap>
        <a-button type="primary" @click="handleCreate()">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button @click="handleImport">
          <template #icon>
            <ImportOutlined />
          </template>
          导入
        </a-button>
        <a-button :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除 ({{ selectedRowKeys.length }})
        </a-button>
        <div class="filter-inter">
          <span class="select-inter">类别：</span>
          <a-select :options="selectOptions" @change="searchHandler" v-model:value="filters.category" allowClear placeholder="请选择类别" style="width: 150px"></a-select>
        </div>
        <div class="filter-inter">
          <span class="select-inter">编辑器：</span>
          <a-select :options="editorOptions" @change="searchHandler" v-model:value="filters.editor" allowClear placeholder="请选择编辑器" style="width: 150px"></a-select>
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
      :columns="detailColumns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      @change="handleTableChange"
      row-key="id"
      class="model-table">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'name'">
          <a-button type="link" @click="handleMenuClick({ key: 'view' }, record)">{{ record.name }}</a-button>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-dropdown :trigger="['hover']">
            <a-button type="text" size="small">
              <MoreOutlined class="text-16px text-white" />
            </a-button>
            <template #overlay>
              <a-menu @click="(e) => handleMenuClick(e, record)">
                <a-menu-item key="exploitation">
                  <EditOutlined />
                  <span style="margin-left: 8px">开发</span>
                </a-menu-item>
                <a-menu-item key="view">
                  <EyeOutlined />
                  <span style="margin-left: 8px">查看详情</span>
                </a-menu-item>
                <a-menu-item key="edit">
                  <EditOutlined />
                  <span style="margin-left: 8px">编辑</span>
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
    <!-- 新增/编辑弹窗组件 -->
    <detailFormModal ref="formModalRef" @saved="handleSaved" />
  </a-card>
</template>

<script setup lang="ts">
import { getModelDevList, deleteModelDev, batchDeleteModelDev, type ListQueryParams } from '@/api/development';
import type { ModelInputOutput } from '@/types/model';
import { DeleteOutlined, EditOutlined, EyeOutlined, ImportOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { TableProps } from 'ant-design-vue';
import { message, Modal } from 'ant-design-vue';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { detailColumns, selectOptions, editorOptions } from './indexData';
import detailFormModal from './components/detailFormModal.vue';
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
  editor: undefined,
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
      editor: filters.editor || undefined,
    };
    const res = await getModelDevList(params);
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
  console.log(route, '---------route');

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
  loadData();
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
        const res = await batchDeleteModelDev(selectedRowKeys.value);
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
    case 'exploitation':
      console.log('跳转到开发页', record.id);
      router.push({ name: 'ModelDevelopmentExploitation', params: { id: record.id } });
      break;
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
        const res = await deleteModelDev(id);
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

<style scoped lang="scss">
.crumb-parent {
  a {
    color: var(--theme-info) !important;
  }
}
</style>
