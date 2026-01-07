<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-07 14:51:02
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\InputOutput\index.vue
 * 
-->
<template>
  <a-card title="模型输入输出" :bordered="false">
    <!-- 筛选区域 -->
    <div class="filter-section flex-between">
      <a-space :size="16" wrap>
        <a-button type="primary" @click="handleCreate()">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button ghost @click="handleImport">
          <template #icon>
            <ImportOutlined />
          </template>
          导入
        </a-button>
        <a-button ghost :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除 ({{ selectedRowKeys.length }})
        </a-button>
        <div class="filter-inter">
          <span class="select-inter">类别：</span>
          <a-select :options="selectOptions" v-model:value="filters.category" allowClear placeholder="请选择类别" style="width: 150px"> </a-select>
        </div>
      </a-space>
      <a-space :size="16" wrap>
        <div class="filter-inter">
          <a-input v-model:value="searchKeyword" placeholder="搜索名称、属性、类别" style="width: 220px" allow-clear>
            <template #suffix>
              <SearchOutlined />
            </template>
          </a-input>
        </div>
      </a-space>
    </div>

    <!-- 表格 -->
    <a-table :columns="columns" :data-source="filteredData" :loading="loading" :pagination="pagination" :row-selection="rowSelection" @change="handleTableChange" row-key="id" class="model-table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-button type="link" @click="handleMenuClick({ key: 'view' }, record)">{{ record.name }}</a-button>
        </template>
        <template v-else-if="column.key === 'integrity'">
          <a-progress
            :percent="record.integrity"
            :stroke-color="{
              '0%': '#108ee9',
              '100%': '#87d068',
            }"
            size="small"
          >
            <template #format="percent">
              <span class="text-white">{{ percent }}</span>
            </template></a-progress
          >
        </template>
        <template v-else-if="column.key === 'dataInput'">
          <div class="data-input-chart">
            <ChartView :showAxis="false" :width="'150px'" :height="'40px'" :xAxisData="record.dataInputTrend" :yAxisData="record.dataInputTrend" />
          </div>
        </template>
        <template v-else-if="column.key === 'cycleTime'"> {{ record.cycleTime }} ms </template>
        <template v-else-if="column.key === 'action'">
          <a-dropdown :trigger="['hover']">
            <a-button type="text" size="small">
              <MoreOutlined class="text-16px text-white" />
            </a-button>
            <template #overlay>
              <a-menu @click="(e) => handleMenuClick(e, record)">
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
    <InputOutputFormModal ref="formModalRef" @saved="handleSaved" />
  </a-card>
</template>

<script setup lang="ts">
import { getList } from "@/api/inputOutput";
import type { ModelInputOutput } from "@/types/model";
import { DeleteOutlined, EditOutlined, EyeOutlined, ImportOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons-vue";
import type { TableProps } from "ant-design-vue";
import { message, Modal } from "ant-design-vue";
import { Dayjs } from "dayjs";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { columns, selectOptions } from "./index";
import InputOutputFormModal from "./InputOutputFormModal.vue";
import ChartView from "@/components/chart/chartView.vue";

const router = useRouter();

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 300): ((...args: Parameters<T>) => void) => {
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
  keyword: "",
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
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
});

// data source will be loaded from mock API
const dataSource = ref<ModelInputOutput[]>([]);

const loadData = async () => {
  loading.value = true;
  try {
    const res: any = await getList();
    dataSource.value = res?.data || [];
    pagination.total = dataSource.value.length;
  } catch (err) {
    console.error(err);
    message.error("加载数据失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// 搜索关键词（用于防抖）
const searchKeyword = ref("");

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
    result = result.filter((item) => item.name.toLowerCase().includes(keyword) || item.attribute.toLowerCase().includes(keyword) || item.category.toLowerCase().includes(keyword));
  }

  // 类别筛选
  if (filters.category) {
    result = result.filter((item) => item.category === filters.category);
  }

  // 更新分页总数
  pagination.total = result.length;
  return result;
});

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

// Chart is rendered by ChartView component

// 表格变化处理（排序、分页）
const handleTableChange: TableProps["onChange"] = (paginationConfig, filters, sorter: any) => {
  // 更新分页
  if (paginationConfig.current) {
    pagination.current = paginationConfig.current;
  }
  if (paginationConfig.pageSize) {
    pagination.pageSize = paginationConfig.pageSize;
  }

  // 处理排序
  if (sorter.field) {
    const { field, order } = sorter;
    if (order) {
      dataSource.value.sort((a, b) => {
        const aValue = a[field as keyof ModelInputOutput];
        const bValue = b[field as keyof ModelInputOutput];

        if (order === "ascend") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
  }
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
  message.info("打开导入对话框");
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning("请先选择要删除的数据");
    return;
  }

  Modal.confirm({
    title: "确认删除",
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条数据吗？`,
    okText: "确定",
    cancelText: "取消",
    onOk() {
      dataSource.value = dataSource.value.filter((item) => !selectedRowKeys.value.includes(item.id));
      selectedRowKeys.value = [];
      pagination.total = dataSource.value.length;
      message.success("批量删除成功");
    },
  });
};

// 菜单点击处理
const handleMenuClick = (e: { key: string }, record: ModelInputOutput) => {
  switch (e.key) {
    case "view":
      // 跳转到详情页
      router.push({ name: "ModelInputOutputDetail", params: { id: record.id } });
      break;
    case "edit":
      // 打开编辑弹窗并加载数据
      handleCreate(record);
      break;
    case "copy":
      message.info(`复制: ${record.name}`);
      break;
    case "delete":
      handleDelete(record.id);
      break;
  }
};

// 删除操作
const handleDelete = (id: string) => {
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除这条数据吗？",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      const index = dataSource.value.findIndex((item) => item.id === id);
      if (index > -1) {
        dataSource.value.splice(index, 1);
        pagination.total = dataSource.value.length;
        message.success("删除成功");
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
