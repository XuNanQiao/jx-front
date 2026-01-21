<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-21 14:46:02
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\deployment\index.vue
 *
-->
<template>
  <div class="deployment-page">
    <a-card title="模型部署" class="page">
      <!-- 筛选区域 -->
      <div class="filter-section flex-between">
        <a-space :size="16" wrap>
          <ImportAction import-url="/api/model_deploy/import" />
          <!--  :import-params="() => ({ category: filters.category, trigger_type: filters.trigger_type })"  -->
          <a-button :disabled="selectedRowKeys.length === 0" @click="handleBatchDelete">
            <template #icon>
              <DeleteOutlined />
            </template>
            批量删除 ({{ selectedRowKeys.length }})
          </a-button>
          <div class="filter-inter" style="--filter-padding-left: 80px">
            <span class="select-inter">触发方式：</span>
            <a-select
              :options="triggerOptions"
              @change="searchHandler"
              v-model:value="filters.trigger_type"
              allowClear
              placeholder="请选择触发方式"
              style="width: 220px"></a-select>
          </div>
          <div class="filter-inter">
            <span class="select-inter">模型：</span>
            <a-select
              :options="options"
              @change="searchHandler"
              v-model:value="filters.model_id"
              allowClear
              placeholder="请选择模型"
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
        :scroll="{ x: 'max-content', y: 'calc(100vh - 300px)' }">
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
                  <a-menu-item>
                    <DownloadAction
                      download-label="导出"
                      downloadType="none"
                      download-url="/api/model_deploy/export"
                      download-file-name="operator-package"
                      :download-params="() => ({ ids: [record.id] })" />
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
    <LogModal v-model:open="logModalVisible" title="运行日志" :record="currentJobRecord" />
    <a-modal
      v-model:open="copyModalVisible"
      title="复制模型部署"
      :confirm-loading="copySubmitting"
      @ok="handleCopySubmit"
      @cancel="resetCopyModal">
      <a-form layout="vertical">
        <a-form-item label="名称" required>
          <a-input v-model:value="copyForm.name" placeholder="请输入新名称" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { batchDeleteModelDeploy, deleteModelDeploy, getModelDeployList, saveModelDeploy } from "@/api/deployment";
import { executeJob, getModelDevList } from "@/api/development";
import DownloadAction from "@/components/common/DownloadAction.vue";
import ImportAction from "@/components/common/ImportAction.vue";
import LogModal from "@/components/journalView/LogModal.vue";
import { useTablePagination } from "@/utils/useTablePagination";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";
import { debounce } from "lodash-es";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailColumns, triggerOptions } from "./indexData";
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
const copyModalVisible = ref(false);
const copySubmitting = ref(false);
const copyForm = reactive({ name: "" });
let copySource: any = null;
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
const currentJobRecord = ref<any>(null);
const logModalVisible = ref(false);
const runLoading = ref(false);
// 运行模型
const handleRun = async (record: any) => {
  try {
    runLoading.value = true;
    const response = await executeJob({ job_id: record?.model_id || "", run_type: "formal" });
    currentJobRecord.value = { id: response?.data?.job_id || record?.model_id };
    logModalVisible.value = true;
  } catch (error: any) {
    console.error("运行失败:", error);
    message.error("运行失败");
  } finally {
    runLoading.value = false;
  }
};

// 复制模型
const handleCopy = async (record: ModelInputOutput) => {
  copySource = record;
  copyForm.name = record?.name ? `${record.name}-副本` : "";
  copyModalVisible.value = true;
};

const resetCopyModal = () => {
  copyModalVisible.value = false;
  copyForm.name = "";
  copySource = null;
};

const handleCopySubmit = async () => {
  const name = copyForm.name.trim();
  if (!name) {
    message.warning("请输入名称");
    return;
  }
  if (!copySource) {
    message.error("缺少复制源数据");
    return;
  }
  const payload: any = { ...copySource, name };
  delete payload.id; // 去除原有 id 以便后端创建新记录

  copySubmitting.value = true;
  try {
    const res = await saveModelDeploy(payload);
    if (res?.code === 200) {
      message.success("复制成功");
      resetCopyModal();
      await loadData();
    }
  } catch (error: any) {
    console.error("复制失败:", error);
  } finally {
    copySubmitting.value = false;
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
