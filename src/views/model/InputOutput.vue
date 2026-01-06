<template>
  <div class="input-output-container">
    <a-card title="模型输入输出" :bordered="false">
      <!-- 操作栏 -->
      <template #extra>
        <a-space>
          <a-button type="primary">新建</a-button>
          <a-button>导出</a-button>
        </a-space>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <a-space :size="16">
          <div class="filter-item">
            <span class="filter-label">完整度:</span>
            <a-range-picker
              v-model:value="filters.completenessDateRange"
              :placeholder="['开始日期', '结束日期']"
              style="width: 240px"
            />
          </div>
          <div class="filter-item">
            <span class="filter-label">数据输入:</span>
            <a-range-picker
              v-model:value="filters.dataInputDateRange"
              :placeholder="['开始日期', '结束日期']"
              style="width: 240px"
            />
          </div>
          <a-button @click="handleReset">重置</a-button>
        </a-space>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
        class="model-table"
      >
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
            />
          </template>
          <template v-else-if="column.key === 'dataInput'">
            <div class="data-input-chart">
              <v-chart
                :option="getChartOption(record.dataInputTrend)"
                :autoresize="true"
                style="height: 40px; width: 150px"
              />
            </div>
          </template>
          <template v-else-if="column.key === 'cycle'">
            {{ record.cycle }} ms
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small">编辑</a-button>
              <a-button type="link" size="small">查看</a-button>
              <a-popconfirm
                title="确定要删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { TableColumnType, TableProps } from 'ant-design-vue'
import type { ModelInputOutput, TableFilterParams } from '@/types/model'
import dayjs, { Dayjs } from 'dayjs'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import type { EChartsOption } from 'echarts'

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

// 表格列定义
const columns: TableColumnType<ModelInputOutput>[] = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    width: 150,
  },
  {
    title: '属性',
    dataIndex: 'attribute',
    key: 'attribute',
    width: 120,
  },
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
    width: 120,
  },
  {
    title: '完整度',
    dataIndex: 'completeness',
    key: 'completeness',
    width: 150,
  },
  {
    title: '数据输入',
    dataIndex: 'dataInput',
    key: 'dataInput',
    width: 180,
  },
  {
    title: '周期（毫秒）',
    dataIndex: 'cycle',
    key: 'cycle',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    key: 'createBy',
    width: 120,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
  },
]

// 加载状态
const loading = ref(false)

// 筛选条件
const filters = reactive<{
  completenessDateRange: [Dayjs, Dayjs] | null
  dataInputDateRange: [Dayjs, Dayjs] | null
}>({
  completenessDateRange: null,
  dataInputDateRange: null,
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
})

// 模拟数据
const dataSource = ref<ModelInputOutput[]>([
  {
    id: '1',
    name: '模型A输入数据',
    attribute: '输入',
    category: '图像',
    completeness: 85,
    dataInput: '2024-01-15 10:30:00',
    dataInputTrend: [120, 132, 101, 134, 90, 230, 210],
    cycle: 1000,
    createTime: '2024-01-10 09:00:00',
    createBy: '张三',
  },
  {
    id: '2',
    name: '模型B输出数据',
    attribute: '输出',
    category: '文本',
    completeness: 92,
    dataInput: '2024-01-16 14:20:00',
    dataInputTrend: [220, 182, 191, 234, 290, 330, 310],
    cycle: 500,
    createTime: '2024-01-12 11:30:00',
    createBy: '李四',
  },
  {
    id: '3',
    name: '模型C输入数据',
    attribute: '输入',
    category: '音频',
    completeness: 78,
    dataInput: '2024-01-17 16:45:00',
    dataInputTrend: [150, 232, 201, 154, 190, 330, 410],
    cycle: 2000,
    createTime: '2024-01-14 15:20:00',
    createBy: '王五',
  },
  {
    id: '4',
    name: '模型D输出数据',
    attribute: '输出',
    category: '视频',
    completeness: 95,
    dataInput: '2024-01-18 09:15:00',
    dataInputTrend: [320, 332, 301, 334, 390, 330, 320],
    cycle: 1500,
    createTime: '2024-01-15 08:45:00',
    createBy: '赵六',
  },
  {
    id: '5',
    name: '模型E输入数据',
    attribute: '输入',
    category: '图像',
    completeness: 68,
    dataInput: '2024-01-19 13:30:00',
    dataInputTrend: [80, 132, 151, 204, 250, 280, 300],
    cycle: 800,
    createTime: '2024-01-16 10:10:00',
    createBy: '张三',
  },
])

// 更新总数
pagination.total = dataSource.value.length

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
      type: 'category',
      show: false,
      data: data.map((_, index) => index),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#1890ff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.05)',
              },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
  }
}

// 表格变化处理（排序、分页）
const handleTableChange: TableProps['onChange'] = (paginationConfig, filters, sorter: any) => {
  // 更新分页
  if (paginationConfig.current) {
    pagination.current = paginationConfig.current
  }
  if (paginationConfig.pageSize) {
    pagination.pageSize = paginationConfig.pageSize
  }

  // 处理排序
  if (sorter.field) {
    const { field, order } = sorter
    if (order) {
      dataSource.value.sort((a, b) => {
        const aValue = a[field as keyof ModelInputOutput]
        const bValue = b[field as keyof ModelInputOutput]

        if (order === 'ascend') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }
  }
}

// 重置筛选
const handleReset = () => {
  filters.completenessDateRange = null
  filters.dataInputDateRange = null
  message.success('筛选条件已重置')
}

// 删除操作
const handleDelete = (id: string) => {
  const index = dataSource.value.findIndex((item) => item.id === id)
  if (index > -1) {
    dataSource.value.splice(index, 1)
    pagination.total = dataSource.value.length
    message.success('删除成功')
  }
}
</script>

<style scoped>
.input-output-container {
  padding: 0;
}

.input-output-container :deep(.ant-card) {
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.filter-section {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-gray);
  border-radius: var(--radius-sm);
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
}

.model-table {
  margin-top: var(--spacing-md);
}

.model-table :deep(.ant-table) {
  background: var(--bg-white);
}

.model-table :deep(.ant-table-thead > tr > th) {
  background: var(--bg-gray);
  font-weight: 600;
}

.model-table :deep(.ant-table-tbody > tr:hover > td) {
  background: #fafafa;
}

.data-input-chart {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
