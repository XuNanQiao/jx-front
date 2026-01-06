<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 11:33:14
 * @LastEditTime: 2026-01-06 15:03:49
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\InputOutput\index.vue
 * 
-->
<template>
  <a-card class="input-output-container" title="模型输入输出" :bordered="false">
    <!-- 筛选区域 -->
    <div class="filter-section flex-between">
      <a-space :size="16" wrap>
        <div class="filter-item">
          <a-button type="primary" @click="handleCreate">
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
        </div>
        <a-space-compact block class="filter-item">
          <div class="filter-label">类别:</div>
          <a-select v-model:value="filters.category" placeholder="请选择类别" style="width: 150px" allow-clear>
            <a-select-option value="图像">图像</a-select-option>
            <a-select-option value="图像">图像</a-select-option>
            <a-select-option value="文本">文本</a-select-option>
            <a-select-option value="音频">音频</a-select-option>
            <a-select-option value="视频">视频</a-select-option>
          </a-select>
        </a-space-compact>
      </a-space>
      <a-space :size="16" wrap>
        <div class="filter-item">
          <span class="filter-label">关键词:</span>
          <a-input v-model:value="searchKeyword" placeholder="搜索名称、属性、类别" style="width: 200px" allow-clear>
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
          <a>{{ record.name }}</a>
        </template>
        <template v-else-if="column.key === 'completeness'">
          <a-progress
            :percent="record.completeness"
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
            <v-chart :option="getChartOption(record.dataInputTrend)" :autoresize="true" style="height: 40px; width: 150px" />
          </div>
        </template>
        <template v-else-if="column.key === 'cycle'"> {{ record.cycle }} ms </template>
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
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { message, Modal } from "ant-design-vue";
import type { TableColumnType, TableProps } from "ant-design-vue";
import type { ModelInputOutput, TableFilterParams } from "@/types/model";
import dayjs, { Dayjs } from "dayjs";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import type { EChartsOption } from "echarts";
import { columns } from "./index";
import Icon, { MoreOutlined } from "@ant-design/icons-vue";

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

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

// 模拟数据
const dataSource = ref<ModelInputOutput[]>([
  {
    id: "1",
    name: "模型A输入数据",
    attribute: "输入",
    category: "图像",
    completeness: 85,
    dataInput: "2024-01-15 10:30:00",
    dataInputTrend: [120, 132, 101, 134, 90, 230, 210],
    cycle: 1000,
    createTime: "2024-01-10 09:00:00",
    createBy: "张三",
  },
  {
    id: "2",
    name: "模型B输出数据",
    attribute: "输出",
    category: "文本",
    completeness: 92,
    dataInput: "2024-01-16 14:20:00",
    dataInputTrend: [220, 182, 191, 234, 290, 330, 310],
    cycle: 500,
    createTime: "2024-01-12 11:30:00",
    createBy: "李四",
  },
  {
    id: "3",
    name: "模型C输入数据",
    attribute: "输入",
    category: "音频",
    completeness: 78,
    dataInput: "2024-01-17 16:45:00",
    dataInputTrend: [150, 232, 201, 154, 190, 330, 410],
    cycle: 2000,
    createTime: "2024-01-14 15:20:00",
    createBy: "王五",
  },
  {
    id: "4",
    name: "模型D输出数据",
    attribute: "输出",
    category: "视频",
    completeness: 95,
    dataInput: "2024-01-18 09:15:00",
    dataInputTrend: [320, 332, 301, 334, 390, 330, 320],
    cycle: 1500,
    createTime: "2024-01-15 08:45:00",
    createBy: "赵六",
  },
  {
    id: "5",
    name: "模型E输入数据",
    attribute: "输入",
    category: "图像",
    completeness: 68,
    dataInput: "2024-01-19 13:30:00",
    dataInputTrend: [80, 132, 151, 204, 250, 280, 300],
    cycle: 800,
    createTime: "2024-01-16 10:10:00",
    createBy: "张三",
  },
]);

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

// 生成折线图配置
const getChartOption = (data: number[]): EChartsOption => {
  return {
    grid: {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5,
    },
    xAxis: {
      type: "category",
      show: false,
      data: data.map((_, index) => index),
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        type: "line",
        data: data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: "#1890ff",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(24, 144, 255, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(24, 144, 255, 0.05)",
              },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
    },
  };
};

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
const handleCreate = () => {
  message.info("打开新建对话框");
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
      message.info(`查看详情: ${record.name}`);
      break;
    case "edit":
      message.info(`编辑: ${record.name}`);
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
</script>

<style scoped lang="scss">
.input-output-container {
  color: var(--text-white);
  padding: 0;
  background: none !important;

  :deep(.ant-card) {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
  }
}

.filter-section {
  margin-bottom: var(--spacing-lg);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.filter-label {
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  border: 1px solid #fff;
}

.model-table {
  margin-top: var(--spacing-md);
  :deep(.ant-table) {
    color: #fff;
    .ant-table-column-has-sorters {
      &:hover {
        background: #304162 !important;
      }
    }
    .ant-table-column-sorter {
      color: #fff;
    }
  }

  :deep(.ant-table-thead > tr > th) {
    background: #285187;
    color: #fff;
    font-weight: 600;
    box-shadow: inset 0px 1px 8px 10px #305c99;
  }

  // 斑马纹效果
  :deep(.ant-table-tbody > tr:nth-child(odd) > td) {
    background: #304162;
  }

  :deep(.ant-table-tbody > tr:nth-child(even) > td) {
    background: #32476e;
  }

  :deep(.ant-table-tbody > tr:hover > td) {
    background: #2f618e !important;
  }
}

.data-input-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
