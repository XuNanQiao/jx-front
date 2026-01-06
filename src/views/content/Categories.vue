<template>
  <div class="categories-container">
    <a-card title="分类管理" :bordered="false">
      <template #extra>
        <a-button type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          新增分类
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small">编辑</a-button>
              <a-button type="link" size="small" danger>删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '分类名称', dataIndex: 'name', key: 'name' },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 100 },
  { title: '文章数量', dataIndex: 'articleCount', key: 'articleCount', width: 120 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'action', width: 150 }
]

const dataSource = ref([
  {
    id: 1,
    name: '前端技术',
    sort: 1,
    articleCount: 25,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: '后端开发',
    sort: 2,
    articleCount: 18,
    createdAt: '2024-01-01'
  },
  {
    id: 3,
    name: '数据库',
    sort: 3,
    articleCount: 12,
    createdAt: '2024-01-01'
  },
  {
    id: 4,
    name: '运维部署',
    sort: 4,
    articleCount: 8,
    createdAt: '2024-01-01'
  }
])

const pagination = {
  total: dataSource.value.length,
  pageSize: 10,
  current: 1
}
</script>

<style scoped>
.categories-container {
  width: 100%;
}
</style>
