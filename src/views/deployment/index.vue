<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-20 17:26:03
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\deployment\index.vue
 *
-->
<template>
  <a-card title="模型部署" class="page">
    <!-- 筛选区域 -->
    <div class="filter-section flex-between">
      <a-space :size="16" wrap>
        <ImportAction import-url="/api/model_dev/import" />
        <!--  :import-params="() => ({ category: filters.category, trigger_type: filters.trigger_type })"  -->
        <a-button :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除 ({{ selectedRowKeys.length }})
        </a-button>
        <div class="filter-inter">
          <span class="select-inter">类别：</span>
          <a-select
            :options="selectOptions"
            @change="searchHandler"
            v-model:value="filters.trigger_type"
            allowClear
            placeholder="请选择类别"
            style="width: 150px"></a-select>
        </div>
        <div class="filter-inter">
          <span class="select-inter">模型：</span>
          <a-select
            :options="options"
            @change="searchHandler"
            v-model:value="filters.model_id"
            allowClear
            placeholder="请选择类别"
            style="width: 150px"></a-select>
        </div>
      </a-space>
      <a-space :size="16" wrap>
        <div class="filter-inter">
          <a-input
            v-model:value="filters.keyword"
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
      :columns="detailColumns()"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      @change="handleTableChange"
      row-key="id"
      class="model-table"
      :scroll="{ y: 'calc(100vh - 300px)' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a-button type="link" @click="handleMenuClick({ key: 'view' }, record)">{{ record.name }}</a-button>
        </template>
        <template v-else-if="column.key === 'is_active'">
          <a-switch
            v-model:checked="record.is_active"
            @change="(checked: boolean) => handleStatusChange(checked, record)" />
        </template>
        <template v-else-if="column.key === 'action'">
          <a-dropdown :trigger="['hover']">
            <a-button type="text" size="small">
              <MoreOutlined class="text-16px text-white" />
            </a-button>
            <template #overlay>
              <a-menu @click="(e: { key: string }) => handleMenuClick(e, record)">
                <a-menu-item key="view">
                  <EditOutlined />
                  <span style="margin-left: 8px">编辑</span>
                </a-menu-item>
                <a-menu-item key="run">
                  <PlayCircleOutlined />
                  <span style="margin-left: 8px">运行</span>
                </a-menu-item>
                <a-menu-item key="copy">
                  <CopyOutlined />
                  <span style="margin-left: 8px">复制</span>
                </a-menu-item>
                <a-menu-item key="export">
                  <ExportOutlined />
                  <span style="margin-left: 8px">导出</span>
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
  </a-card>
</template>

<script setup lang="ts">
import { getModelDevList } from "@/api/development";
import { batchDeleteModelDeploy, deleteModelDeploy, getModelDeployList } from "@/api/deployment";
import ImportAction from "@/components/common/ImportAction.vue";
import { useTablePagination } from "@/utils/useTablePagination";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { debounce } from "lodash-es";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailColumns, selectOptions } from "./indexData";
const { pagination, handleTableChange: onTableChange } = useTablePagination(10);
const route = useRoute();
const router = useRouter();
// 加载状态
const loading = ref(false);
// 筛选条件
const filters = reactive({
  keyword: "",
  model_id: undefined,
  trigger_type: undefined,
});
// 选中的行
const selectedRowKeys = ref<string[]>([]);
// data source will be loaded from API
const dataSource = ref<ModelInputOutput[]>([]);
const options = ref<any[]>([]);
const loadData = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params: ListQueryParams = {
      size: pagination.pageSize,
      page: pagination.current,
      ...filters,
    };
    const res = await getModelDeployList(params);
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
const getOptions = () => {
  getModelDevList().then((res) => {
    options.value = res.data.items.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  });
  // TODO: 获取筛选选项数据
};
onMounted(() => {
  getOptions();
  loadData();
});

// 组件卸载时取消防抖
onUnmounted(() => {
  debouncedSearch.cancel();
});
/* --------------------筛选-------------------------- */

// 监听搜索关键词变化（带防抖）
const debouncedSearch = debounce(() => {
  searchHandler();
}, 300);
const searchHandler = () => {
  pagination.current = 1;
  loadData();
};
/* --------------------表格选择-------------------------- */

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

/* --------------------操作-------------------------- */
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
        const res = await batchDeleteModelDeploy(selectedRowKeys.value);
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
    case "run":
      // 运行模型
      handleRun(record);
      break;
    case "copy":
      // 复制模型
      handleCopy(record);
      break;
    case "export":
      // 导出模型
      handleExport(record);
      break;
    case "delete":
      if (record.id) {
        handleDelete(record.id);
      }
      break;
    case "view":
      // 跳转到详情页
      router.push({ name: "ModelDeploymentDetail", params: { id: record.id }, query: { name: record.name } });
      break;
  }
};

// 删除操作
const handleDelete = (id: string) => {
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除这条数据吗？删除后无法恢复。",
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        const res = await deleteModelDeploy(id);
        if (res.code === 200) {
          await loadData();
        }
      } catch (error: any) {
        console.error("删除失败:", error);
      }
    },
  });
};

// 运行模型
const handleRun = async (record: ModelInputOutput) => {
  try {
    // TODO: 调用运行API
    // await runModel(record.id);
    message.success(`模型 ${record.name} 开始运行`);
  } catch (error: any) {
    console.error("运行失败:", error);
    message.error("运行失败");
  }
};

// 复制模型
const handleCopy = async (record: ModelInputOutput) => {
  try {
    // TODO: 调用复制API
    // await copyModel(record.id);
    message.success(`模型 ${record.name} 复制成功`);
    await loadData();
  } catch (error: any) {
    console.error("复制失败:", error);
    message.error("复制失败");
  }
};

// 导出模型
const handleExport = async (record: ModelInputOutput) => {
  try {
    // TODO: 调用导出API
    // const blob = await exportModel(record.id);
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `${record.name}_${Date.now()}.zip`;
    // a.click();
    // window.URL.revokeObjectURL(url);
    message.success(`模型 ${record.name} 导出成功`);
  } catch (error: any) {
    console.error("导出失败:", error);
    message.error("导出失败");
  }
};

// 处理启动状态变化
const handleStatusChange = async (checked: boolean, record: ModelInputOutput) => {
  try {
    // TODO: 调用API更新启动状态
    // await updateModelStatus(record.id, { is_active: checked });
    message.success(checked ? "已启动" : "已停止");
  } catch (error: any) {
    console.error("更新状态失败:", error);
    // 失败时恢复原状态
    record.is_active = !checked;
    message.error("状态更新失败");
  }
};
</script>

<style scoped lang="scss">
.crumb-parent {
  a {
    color: var(--theme-info) !important;
  }
}
</style>
