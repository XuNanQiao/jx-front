<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 17:17:13
 * @LastEditTime: 2026-01-15 16:34:52
 * @LastEditors: ZHAO
 * @Description: 数据浏览页面
 * @FilePath: \jx\src\views\InputOutput\tabs\DataBrowse.vue
 *
-->
<template>
  <div class="data-browse page">
    <div class="browse-container">
      <!-- 左侧筛选区 -->
      <div class="filter-panel">
        <div class="filter-section">
          <div class="filter-item">
            <label class="filter-label">设备实例</label>
            <a-select
              :options="deviceInstances"
              v-model:value="filters.deviceInstance"
              placeholder="请选择设备实例"
              style="width: 100%"></a-select>
          </div>

          <div class="filter-item">
            <label class="filter-label">数据列</label>
            <a-select
              :options="columnOptions"
              v-model:value="filters.dataColumns"
              mode="multiple"
              placeholder="默认显示全部"
              style="width: 100%"
              allow-clear
              :max-tag-count="2"></a-select>
          </div>

          <div class="filter-item">
            <label class="filter-label">时间范围</label>
            <a-select
              :options="timeOptions"
              v-model:value="filters.timeRangeType"
              placeholder="请选择时间范围"
              style="width: 100%; margin-bottom: 8px"
              @change="handleTimeRangeTypeChange"></a-select>
            <a-range-picker
              v-model:value="filters.dateRange"
              style="width: 100%"
              format="YYYY-MM-DD"
              :disabled="filters.timeRangeType !== 'custom'" />
          </div>

          <div class="filter-item">
            <label class="filter-label">排序</label>
            <a-radio-group v-model:value="filters.sortOrder" style="width: 100%">
              <a-radio-button value="asc">正序</a-radio-button>
              <a-radio-button value="none">不排序</a-radio-button>
              <a-radio-button value="desc">倒序</a-radio-button>
            </a-radio-group>
          </div>

          <a-collapse v-model:activeKey="moreFiltersVisible" ghost>
            <a-collapse-panel key="1" header="更多选项">
              <div class="filter-item">
                <label class="filter-label">数据类型</label>
                <a-select v-model:value="filters.dataType" placeholder="全部类型" style="width: 100%" allow-clear>
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="realtime">实时数据</a-select-option>
                  <a-select-option value="history">历史数据</a-select-option>
                </a-select>
              </div>

              <div class="filter-item">
                <label class="filter-label">采样频率</label>
                <a-input-number
                  v-model:value="filters.samplingRate"
                  placeholder="秒"
                  style="width: 100%"
                  :min="1"
                  :max="3600" />
              </div>
            </a-collapse-panel>
          </a-collapse>

          <div class="filter-actions">
            <a-button type="primary" block @click="search">查询</a-button>
          </div>
        </div>
      </div>

      <!-- 右侧数据展示区 -->
      <div class="data-panel">
        <!-- 数据展示内容 -->
        <div class="data-content">
          <!-- 表格预览模式 -->
          <template v-if="displayMode === 'table'">
            <a-table
              :columns="dynamicColumns"
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
              :scroll="{ y: 'calc(100vh - 450px)' }"></a-table>
          </template>

          <!-- 按设备分图 -->
          <template v-else-if="displayMode === 'deviceChart'">
            <div class="charts-grid">
              <chart-view :mockData="true" height="300px" />
            </div>
          </template>

          <!-- 按数据列分图 -->
          <template v-else-if="displayMode === 'columnChart'">
            <div class="charts-grid">
              <chart-view :mockData="true" height="300px" />
            </div>
          </template>

          <!-- 数据分布 -->
          <template v-else-if="displayMode === 'distribution'">
            <div class="distribution-container">
              <chart-view :mockData="true" height="500px" />
            </div>
          </template>

          <!-- 关联关系 -->
          <template v-else-if="displayMode === 'correlation'">
            <div class="correlation-container">
              <scatter-chart :mockData="true" height="500px" xAxisName="温度(°C)" yAxisName="湿度(%)" />
            </div>
          </template>
        </div>

        <!-- 底部工具栏 -->
        <div class="data-toolbar mt-16">
          <a-tabs v-model:activeKey="displayMode">
            <a-tab-pane key="table" tab="表格预览" />
            <a-tab-pane key="deviceChart" tab="按设备分图" />
            <a-tab-pane key="columnChart" tab="按数据列分图" />
            <a-tab-pane key="distribution" tab="数据分布" />
            <a-tab-pane key="correlation" tab="关联关系" />
          </a-tabs>

          <div class="toolbar-actions">
            <a-dropdown>
              <a-button>
                下载数据
                <DownOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="handleDownload">
                  <a-menu-item key="csv">导出 CSV</a-menu-item>
                  <a-menu-item key="excel">导出 Excel</a-menu-item>
                  <a-menu-item key="json">导出 JSON</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { message } from "ant-design-vue";
import { DownOutlined } from "@ant-design/icons-vue";
import type { Dayjs } from "dayjs";
import { useRoute } from "vue-router";
import { getBrowseData, getDataStructureList } from "@/api/inputOutput";
import { allColumnsOptions, DataBrowseColumns } from "@/views/InputOutput/index";
import { TIME_RANGE_OPTIONS } from "@/views/InputOutput/constants";
import { useTablePagination } from "@/utils/useTablePagination";
import { useTimeRangeFilter } from "@/utils/useTimeRangeFilter";
import ChartView from "@/components/chart/chartView.vue";
import ScatterChart from "@/components/chart/scatterChart.vue";

type DisplayMode = "table" | "deviceChart" | "columnChart" | "distribution" | "correlation";
type TimeRangeType = "0" | "1" | "7" | "30" | "custom";
type SortOrder = "asc" | "none" | "desc";

// 路由和组合式函数
const route = useRoute();
const { pagination, handleTableChange: onTableChange } = useTablePagination(10);
const { getTimeRange } = useTimeRangeFilter();
const columnOptions = ref<SelectOption[]>([]);
const tabColumns = ref([]);
// 筛选条件
const filters = reactive({
  deviceInstance: "电脑" as string | undefined,
  dataColumns: [] as string[],
  timeRangeType: "0" as TimeRangeType,
  dateRange: null as [Dayjs, Dayjs] | null,
  sortOrder: "desc" as SortOrder,
  dataType: "all" as string,
  samplingRate: 60 as number,
});

// 状态管理
const moreFiltersVisible = ref<string[]>([]);
const displayMode = ref<DisplayMode>("table");
const loading = ref(false);
const tableData = ref<any[]>([]);

// 选项数据
const timeOptions = TIME_RANGE_OPTIONS;
const deviceInstances = ref([{ label: "电脑", value: "电脑" }]);

// 动态生成的表格列配置
const dynamicColumns = computed(() => {
  // 如果用户选择了数据列，只显示选中的列
  let allColumns = [DataBrowseColumns[0], ...tabColumns.value, ...DataBrowseColumns.slice(1)];
  let dynamicDataColumns = [...allColumns];
  if (filters.dataColumns && filters.dataColumns.length > 0) {
    dynamicDataColumns = allColumns.filter((col: any) => filters.dataColumns!.includes(col.key));
  }
  return [...dynamicDataColumns];
});

// 搜索
const search = () => {
  pagination.current = 1;
  handleQuery();
};

// 查询
const handleQuery = async () => {
  loading.value = true;
  try {
    // 获取时间范围
    const timeRange = getTimeRange(filters.timeRangeType as TimeRangeType, filters.dateRange);

    // 构建查询参数
    const params: DataBrowseParams = {
      model_input_output_id: route.params.id,
      device_value: filters.deviceInstance,
      sort_order: filters.sortOrder,
      page: pagination.current,
      size: pagination.pageSize,
      ...timeRange,
    };

    const res = await getBrowseData(params);
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

// 表格变化
const handleTableChange = (pag: any) => {
  onTableChange(pag);
  handleQuery();
};

// 下载数据
const handleDownload = ({ key }: { key: string }) => {
  message.success(`正在导出 ${key.toUpperCase()} 格式`);
};

// 时间范围类型变化处理
const handleTimeRangeTypeChange = () => {
  // 如果不是自定义时间，清空日期范围选择
  if (filters.timeRangeType !== "custom") {
    filters.dateRange = null;
  }
};
const getColumnsOptions = () => {
  try {
    getDataStructureList({ model_input_output_id: route.params.id }).then((response) => {
      if (response?.data?.items?.length) {
        let options = response.data.items.map((item: any) => ({
          label: item.name,
          value: item.column,
        }));
        tabColumns.value = response.data.items.map((item: any) => ({
          title: item.name,
          key: item.column,
        }));
        columnOptions.value = [...allColumnsOptions, ...options];
      } else {
        tabColumns.value = [];
        columnOptions.value = [...allColumnsOptions];
      }
    });
  } catch (error) {
    tabColumns.value = [];
    columnOptions.value = [...allColumnsOptions];
  }
};
// 初始化
onMounted(async () => {
  handleQuery(); // 再查询数据
  getColumnsOptions();
});
</script>

<style scoped lang="scss">
.data-browse {
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

      .filter-actions {
        margin-top: 24px;
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
:deep(.ant-collapse) {
  .ant-collapse-header {
    color: #ffffff;
    padding: 12px 0;
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
