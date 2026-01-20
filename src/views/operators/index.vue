<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 17:17:13
 * @LastEditTime: 2026-01-16 16:00:55
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
          <a-input-search v-model:value="searchValue" allow-clear placeholder="搜索节点" style="margin-bottom: 8px" />
          <a-tree
            :show-line="true"
            :show-icon="true"
            :tree-data="treeData()"
            :expandedKeys="treeExpandedKeys"
            :autoExpandParent="autoExpandParent"
            :filterTreeNode="filterTreeNode"
            @expand="onExpand"
            @select="onSelect"></a-tree>
        </div>
      </div>

      <!-- 右侧数据展示区 -->
      <div class="data-panel">
        <!-- 数据展示内容 -->
        <div class="data-content">
          <!-- 筛选区域 -->
          <div class="filter-section flex-between">
            <a-space :size="8" wrap>
              <DownloadAction
                download-label="下载算子包编码工程"
                download-url="/api/model_operator/download"
                download-file-name="operator-package"
                :download-disabled="selectedRowKeys.length === 0"
                :download-params="() => ({ id: selectedRowKeys })" />
              <ImportAction
                import-label="上传算子包"
                accept=".zip,.rar,.7z,.tar,.gz,.tar.gz"
                :importParams="{ run_env: 'python3', category: filters.expandedKeys }"
                :paramsResolver="fileNameResolver"
                importUrl="/api/model_operator/import"
                @import-success="inputSearch" />
              <ImportAction
                import-label="导入"
                accept=".zip,.rar,.7z,.tar,.gz,.tar.gz"
                :importParams="{ run_env: 'python3', category: filters.expandedKeys }"
                :paramsResolver="[{ key: 'name', values: ['name'] }]"
                importUrl="/api/model_operator/import"
                @import-success="inputSearch" />
            </a-space>
            <a-space :size="16" wrap>
              <div class="filter-inter">
                <a-input
                  v-model:value="filters.version"
                  @change="inputSearch"
                  @pressEnter="inputSearch"
                  placeholder="搜索版本号"
                  style="width: 220px"
                  allow-clear>
                  <template #suffix>
                    <SearchOutlined />
                  </template>
                </a-input>
                <!--   <span class="select-inter">类别：</span>
                <a-select :options="versionOptions" @change="searchHandler" v-model:value="filters.version" allowClear placeholder="请选择类别" style="width: 150px"></a-select>
             -->
              </div>
              <div class="filter-inter">
                <a-input
                  v-model:value="filters.name"
                  @change="inputSearch"
                  @pressEnter="inputSearch"
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
          <!-- 表格预览模式 -->
          <a-table
            :columns="tableColumns"
            :data-source="tableData"
            :loading="loading"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
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
            :scroll="{ y: 'calc(100vh - 350px)' }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button type="link" @click="goDetail(record)">源码</a-button>
              </template>
            </template>
          </a-table>
          <SourceModal v-model:open="sourceModalOpen" :loading="sourceLoading" :files="files" :title="sourceTitle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getList, getSourceCode } from '@/api/operators';
import { useTablePagination } from '@/utils/useTablePagination';
import { SearchOutlined } from '@ant-design/icons-vue';
import { TreeProps } from 'ant-design-vue';
import { debounce } from 'lodash-es';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { tableColumns, treeData } from './indexData';
import SourceModal from './components/SourceModal.vue';
import ImportAction from '@/components/common/ImportAction.vue';
import DownloadAction from '@/components/common/DownloadAction.vue';

const { pagination, handleTableChange: onTableChange } = useTablePagination(10);

// 筛选条件
const filters = reactive({
  expandedKeys: 0 as string | number,
  version: undefined as string | undefined,
  name: undefined as string | undefined,
});

// 状态管理
const loading = ref(false);
const tableData = ref<any[]>([]);

// 表格行选择
const selectedRowKeys = ref<Array<string | number>>([]);
const onSelectChange = (keys: Array<string | number>) => {
  selectedRowKeys.value = keys;
};

// 树搜索与展开控制
const searchValue = ref('');
const autoExpandParent = ref(true);
const treeExpandedKeys = ref<Array<string | number>>([]);

// 生成扁平列表与父级查找
type TreeNode = { key: string | number; title?: string; children?: TreeNode[] } & Record<string, any>;
const dataList: Array<{ key: string | number; title: string }> = [];
const generateList = (data: TreeNode[]) => {
  (data || []).forEach((node) => {
    dataList.push({ key: node.key, title: String(node.title ?? '') });
    if (node.children) generateList(node.children);
  });
};
const getParentKey = (key: string | number, tree: TreeNode[]): string | number | undefined => {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: TreeNode) => item.key === key)) {
        return node.key;
      }
      const parentKey = getParentKey(key, node.children);
      if (parentKey) return parentKey;
    }
  }
  return undefined;
};

// 匹配高亮函数
const filterTreeNode: TreeProps['filterTreeNode'] = (node: any) => {
  const val = searchValue.value?.trim().toLowerCase();
  if (!val) return false;
  return String(node.title ?? '')
    .toLowerCase()
    .includes(val);
};

// 源码弹窗状态
const sourceModalOpen = ref(false);
const sourceLoading = ref(false);
const sourceTitle = ref<string>('');
const files = ref<Array<{ path: string; content: string }>>([]);

// 查询
const getListHand = async () => {
  loading.value = true;
  try {
    // 构建查询参数
    const params = {
      category: String(filters.expandedKeys),
      version: filters.version,
      name: filters.name,
      page: pagination.current,
      size: pagination.pageSize,
    };

    const res = await getList(params);
    if (res.code === 200) {
      tableData.value = res.data.items || [];
      pagination.total = res.data.total || 0;
    }
  } catch (error: any) {
    console.error('查询数据失败:', error);
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
  // 初始化树索引与默认展开全部
  generateList(treeData() as unknown as TreeNode[]);
  treeExpandedKeys.value = dataList.map((d) => d.key);
  autoExpandParent.value = false;
  getListHand(); // 再查询数据
});
// 树选择
const onSelect: TreeProps['onSelect'] = (_selectedKeys, { node }) => {
  filters.expandedKeys = node.key;
  pagination.current = 1;
  getListHand();
};
// 树展开
const onExpand: TreeProps['onExpand'] = (keys) => {
  treeExpandedKeys.value = keys as Array<string | number>;
  autoExpandParent.value = false;
};
const searchHandler = () => {
  pagination.current = 1;
  getListHand();
};
const inputSearch = debounce(() => {
  pagination.current = 1;
  searchHandler();
}, 300);

// 文件名解析器：从文件名中提取 name，去掉后缀
const fileNameResolver = [
  {
    key: 'name',
    values: ['name'],
    transform: (fileName: string | undefined): string => {
      if (!fileName) return '';
      // 去掉文件后缀，支持多个后缀如 .tar.gz
      return fileName.replace(/\.(zip|rar|7z|tar\.gz|tar|gz)$/i, '');
    },
  },
];

// 搜索联动展开父级
watch(
  () => searchValue.value,
  (val) => {
    const v = (val || '').trim().toLowerCase();
    if (!v) {
      // 清空搜索后保持原先全部展开的体验
      treeExpandedKeys.value = dataList.map((d) => d.key);
      autoExpandParent.value = false;
      return;
    }
    const keys = dataList
      .filter((item) => item.title.toLowerCase().includes(v))
      .map((item) => getParentKey(item.key, treeData as unknown as TreeNode[]))
      .filter((k): k is string | number => k !== undefined);
    // 去重
    treeExpandedKeys.value = Array.from(new Set(keys));
    autoExpandParent.value = true;
  },
);
// 表格变化
const handleTableChange = (pag: any) => {
  onTableChange(pag);
  getListHand();
};

// 打开源码弹窗并查询
const goDetail = async (record: any) => {
  sourceModalOpen.value = true;
  sourceLoading.value = true;
  files.value = [];
  sourceTitle.value = record?.name || '算子源码';
  try {
    const res = await getSourceCode(record.id);
    if (res.code === 200) {
      const parsed = parseFiles(res.data, sourceTitle.value);
      files.value = parsed;
    }
  } catch (error: any) {
  } finally {
    sourceLoading.value = false;
  }
};

const parseFiles = (data: any, fallbackName: string) => {
  // 1) 已是文件数组
  if (Array.isArray(data)) {
    return data.map((item: any, idx: number) => ({
      path: item?.path || item?.name || `file-${idx + 1}`,
      content: item?.content || item?.code || item?.source || JSON.stringify(item, null, 2),
    }));
  }
  // 2) 对象中包含 files 数组
  if (data?.files && Array.isArray(data.files)) {
    return data.files.map((item: any, idx: number) => ({
      path: item?.path || item?.name || `file-${idx + 1}`,
      content: item?.content || item?.code || item?.source || JSON.stringify(item, null, 2),
    }));
  }
  // 3) 单文件对象
  if (typeof data === 'object' && data) {
    return [
      {
        path: data.path || data.name || fallbackName || 'source',
        content: data.content || data.code || data.source || JSON.stringify(data, null, 2),
      },
    ];
  }
  // 4) 文本
  if (typeof data === 'string') {
    return [
      {
        path: fallbackName || 'source.txt',
        content: data,
      },
    ];
  }
  return [];
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

      .source-view {
        max-height: 60vh;
        overflow: auto;
      }

      .code-block {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
        line-height: 1.5;
      }
    }

    .data-footer {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
