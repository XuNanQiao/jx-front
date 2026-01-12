<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 17:17:13
 * @LastEditTime: 2026-01-12 17:36:01
 * @LastEditors: ZHAO
 * @Description: 数据浏览页面
 * @FilePath: \jx\src\views\operators\index.vue
 *
-->
<template>
  <div class="operators-container m-t-12px">
    <div class="browse-container">
      <!-- 左侧筛选区 -->
      <div class="filter-panel">
        <div class="filter-section">
          <a-tree :show-line="true" :show-icon="true" :defaultExpandAll="true" :tree-data="treeData" @select="onSelect"> </a-tree>
        </div>
      </div>

      <!-- 右侧数据展示区 -->
      <div class="data-panel">
        <!-- 数据展示内容 -->
        <div class="data-content">
          <!-- 筛选区域 -->
          <div class="filter-section flex-between">
            <a-space :size="16" wrap>
              <a-button @click="handleImport">
                <template #icon>
                  <DownloadOutlined />
                </template>
                下载算子包编码工程
              </a-button>
              <a-button @click="handleImport">
                <template #icon>
                  <ImportOutlined />
                </template>
                导入
              </a-button>
            </a-space>
            <a-space :size="16" wrap>
              <div class="filter-inter">
                <span class="select-inter">类别：</span>
                <a-select :options="versionOptions" @change="searchHandler" v-model:value="filters.category" allowClear placeholder="请选择类别" style="width: 150px"> </a-select>
              </div>
              <div class="filter-inter">
                <a-input v-model:value="filters.searchKeyword" @change="inputSearch" @pressEnter="inputSearch" placeholder="搜索关键词" style="width: 220px" allow-clear>
                  <template #suffix>
                    <SearchOutlined />
                  </template>
                </a-input>
              </div>
            </a-space>
          </div>
          <!-- 表格预览模式 -->
          <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :loading="loading"
            :pagination="{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total: number) => `共 ${total} 条`,
              }"
            @change="handleTableChange"
            row-key="id"
            class="model-table"
            :scroll="{ x: 'max-content' }">
            <template #bodyCell="{ column, record, text }">
              <template v-if="column.key === 'name'">
                <a-button type="link" @click="goDetail(record)">{{ record.name }}</a-button>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" @click="goDetail(record)">编码</a-button>
              </template>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getList } from "@/api/inputOutput";
import { useTablePagination } from "@/utils/useTablePagination";
import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, ImportOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { message, TreeProps } from "ant-design-vue";
import { debounce } from "lodash-es";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { tableColumns, treeData, versionOptions } from "./indexData";
const router = useRouter();

const { pagination, handleTableChange: onTableChange } = useTablePagination(10);

// 筛选条件
const filters = reactive({
  key: "" as string | undefined,
  expandedKeys: "" as string | number,
  category: "",
  searchKeyword: "",
});

// 状态管理
const loading = ref(false);
const tableData = ref<any[]>([]);

// 查询
const getListHand = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params = {
      expandedKeys: filters.expandedKeys,
      key: filters.key,
      page: pagination.current,
      size: pagination.pageSize,
    };

    const res = await getList(params);
    if (res.code === 200) {
      tableData.value = res.data.items || [];
      pagination.total = res.data.total || 0;
    }
  } catch (error: any) {
    console.error("查询数据失败:", error);
  } finally {
    loading.value = false;
  }
};

// 组件卸载时取消防抖
onUnmounted(() => {
  inputSearch.cancel();
});
// 初始化
onMounted(async () => {
  getListHand(); // 再查询数据
});
// 树选择
const onSelect: TreeProps["onSelect"] = (selectedKeys, { node }) => {
  console.log("selected", node);
  filters.expandedKeys = node.key;
  pagination.current = 1;
  getListHand();
};
// 导入
const handleImport = () => {
  message.info("打开导入对话框");
};
const searchHandler = () => {
  pagination.current = 1;
  getListHand();
};
const inputSearch = debounce(() => {
  searchHandler;
}, 300);
// 表格变化
const handleTableChange = (pag: any) => {
  onTableChange(pag);
  getListHand();
};
const goDetail = (record: any) => {
  console.log("跳转到详情页", record.id);
  router.push({ name: "ModelOperatorsList", params: { id: record.id } });
};
// 菜单点击处理
const handleMenuClick = (e: { key: string }, record: any) => {
  switch (e.key) {
    case "view":
      // 跳转到详情页
      router.push({ name: "ModelInputOutputDetail", params: { id: record.id } });
      break;
    case "edit":
      // 打开编辑弹窗并加载数据
      // handleCreate(record);
      break;
    case "copy":
      message.info(`复制: ${record.name}`);
      break;
    case "delete":
      // handleDelete(record.id);
      break;
  }
};
</script>

<style scoped lang="scss">
.operators-container {
  height: 100%;

  .browse-container {
    display: flex;
    gap: 16px;
    height: 100%;
  }

  .filter-panel {
    width: 280px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 16px;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .filter-section {
      .filter-item {
        margin-bottom: 16px;

        .filter-label {
          display: block;
          margin-bottom: 8px;
          color: #ffffff;
          font-weight: 500;
        }
      }
    }
  }

  .data-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .data-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      padding-top: 4px;
      border-top: 1px solid rgba(255, 255, 255, 1);
      .toolbar-actions {
        display: flex;
        gap: 8px;
      }
    }

    .data-content {
      flex: 1;
      overflow: auto;

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
        gap: 16px;

        .chart-item {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);

          .chart-title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
            color: #ffffff;
          }
        }
      }

      .distribution-container,
      .correlation-container {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 4px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
    }

    .data-footer {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

:deep(.ant-tabs) {
  margin-top: -12px;
  .ant-tabs-tab {
    padding: 8px 0 0 !important;
  }
  .ant-tabs-nav {
    margin-bottom: 0;
  }
  .ant-tabs-nav-wrap {
    border-bottom: none !important;
    border-color: transparent !important;
  }
  .ant-tabs-ink-bar {
    top: 0px;
  }
}
</style>
