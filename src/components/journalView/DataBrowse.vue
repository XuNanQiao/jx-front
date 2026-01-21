<!--
 * @Author: ZHAO
 * @Date: 2026-01-20 17:34:18
 * @LastEditTime: 2026-01-21 13:36:06
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\components\journalView\DataBrowse.vue
 * 
-->
<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-21 13:34:42
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\components\journalView\DataBrowse.vue
 *
-->
<template>
  <div class="tableComPage">
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
          <a-select
            :options="statusOptions"
            @change="searchHandler"
            v-model:value="filters.status"
            allowClear
            placeholder="请选择状态"
            style="width: 150px"></a-select>
        </div>
      </a-space>
      <a-space :size="16" wrap>
        <div class="filter-inter">
          <a-input
            v-model:value="filters.name"
            @change="debouncedSearch"
            @pressEnter="debouncedSearch"
            placeholder="搜索关键词"
            style="width: 220px"
            allow-clear>
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
      class="model-table"
      :scroll="tableScroll">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'exec_log'">
          <a-tag :color="statusMap[record.status]?.color || 'warning'" style="cursor: pointer">
            {{ statusMap[record.status]?.text || "-" }}
          </a-tag>
          <a-button type="link" size="small" @click="openLogModal(record)">
            <template #icon>
              <FileOutlined />
            </template>
          </a-button>
        </template>
        <template v-if="column.key === 'action'">
          <a-dropdown :trigger="['hover']">
            <a-button type="text" size="small">
              <MoreOutlined class="text-16px text-white" />
            </a-button>
            <template #overlay>
              <a-menu @click="handleMenuClick($event, record)">
                <a-menu-item key="priority">
                  <ArrowUpOutlined />
                  <span style="margin-left: 8px">调整优先级</span>
                </a-menu-item>
                <a-menu-item key="rerun">
                  <ReloadOutlined />
                  <span style="margin-left: 8px">再次运行</span>
                </a-menu-item>
                <a-menu-item key="retry">
                  <RetweetOutlined />
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
  </div>

  <LogModal v-model:open="logModal.open" :title="logModal.title" :record="logModal.record" />
</template>

<script setup lang="ts">
import { batchDeleteModelJob, deleteModelJob, getModelJobList } from "@/api/modelJob";

import { useTablePagination } from "@/utils/useTablePagination";
import {
  ArrowUpOutlined,
  DeleteOutlined,
  FileOutlined,
  MoreOutlined,
  ReloadOutlined,
  RetweetOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { debounce } from "lodash-es";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import LogModal from "./LogModal.vue";
import { browseColumns, statusMap, statusOptions } from "./indexData";
import { getDeployJobList } from "@/api/deployment";
const { pagination, handleTableChange: onTableChange } = useTablePagination(10);
const router = useRouter();
const props = defineProps({
  id: {
    type: [String, Number],
  },
  geturl: {
    type: String,
    default: "modelJob",
  },
});

// 加载状态
const loading = ref(false);

// 筛选条件
const filters = reactive({
  name: "",
  status: undefined as number | undefined,
  autoMonitor: false,
  haveFile: false,
});

// 选中的行
const selectedRowKeys = ref<string[]>([]);

// data source will be loaded from API
const dataSource = ref<ModelInputOutput[]>([]);

// 日志弹窗状态
const logModal = reactive({
  open: false,
  title: "",
  record: null as ModelInputOutput | null,
});

const loadData = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params: JobListQueryParams = {
      size: pagination.pageSize,
      page: pagination.current,
      name: filters.name || undefined,
      status: filters.status ?? undefined,
    };
    switch (props.geturl) {
      case "modelJob":
        params.model_id = props.id;
        await getModelJobList(params).then((res) => {
          dataSource.value = res?.data?.items || [];
          pagination.total = res?.data?.total || 0;
        });
        break;
      case "deploylJob":
        params.model_deploy_id = props.id;
        await getDeployJobList(params).then((res) => {
          dataSource.value = res?.data?.items || [];
          pagination.total = res?.data?.total || 0;
        });
        break;

      default:
        break;
    }
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

// 动态设置表格滚动配置
const tableScroll = computed(() => {
  const baseScroll = { y: "calc(100vh - 350px)" };
  // 只有在有数据时才添加横向滚动
  if (dataSource.value.length > 0) {
    return { ...baseScroll, x: "max-content" };
  }
  return baseScroll;
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

// 表格变化
const handleTableChange = (pag: any) => {
  onTableChange(pag);
  loadData();
};

// 打开日志弹窗
const openLogModal = (record: ModelInputOutput) => {
  logModal.open = true;
  logModal.title = record?.name ? `${record.name} 日志` : "日志详情";
  logModal.record = record;
};

// 预留导入功能（如需启用可补充）

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
    async onOk() {
      try {
        const res = await batchDeleteModelJob(selectedRowKeys.value);
        if (res.code === 200) {
          selectedRowKeys.value = [];
          await loadData();
        }
      } catch (error: any) {
        console.error("批量删除失败:", error);
      }
    },
  });
};

// 菜单点击处理
const handleMenuClick = (e: { key: string }, record: ModelInputOutput) => {
  switch (e.key) {
    case "priority":
      message.info(`调整优先级: ${record.name || record.id}`);
      break;
    case "rerun":
      handleRerun(record);
      break;
    case "retry":
      handleRetry(record);
      break;
    case "delete":
      handleDelete(record.id);
      break;
  }
};

const handleRerun = (record: ModelInputOutput) => {
  message.info(`再次运行: ${record.name || record.id}`);
  // TODO: 接入再次运行接口
};

const handleRetry = (record: ModelInputOutput) => {
  message.info(`重试: ${record.name || record.id}`);
  // TODO: 接入重试接口
};

// 删除操作
const handleDelete = (id?: string) => {
  if (!id) return;
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除这条数据吗？删除后无法恢复。",
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        const res = await deleteModelJob(id);
        if (res.code === 200) {
          await loadData();
        }
      } catch (error: any) {
        console.error("删除失败:", error);
      }
    },
  });
};

// 保存回调（占位）
</script>
