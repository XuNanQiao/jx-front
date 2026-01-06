<template>
  <div class="articles-container">
    <a-card title="文章列表" :bordered="false">
      <template #extra>
        <a-space>
          <a-input-search placeholder="搜索文章" style="width: 200px" />
          <a-button type="primary">
            <template #icon>
              <PlusOutlined />
            </template>
            新建文章
          </a-button>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'published' ? 'green' : 'orange'">
              {{ record.status === 'published' ? '已发布' : '草稿' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small">查看</a-button>
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
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '作者', dataIndex: 'author', key: 'author' },
  { title: '状态', key: 'status' },
  { title: '发布时间', dataIndex: 'publishedAt', key: 'publishedAt' },
  { title: '操作', key: 'action', width: 180 }
]

const dataSource = ref([
  {
    id: 1,
    title: 'Vue3 组合式 API 最佳实践',
    category: '前端技术',
    author: 'admin',
    status: 'published',
    publishedAt: '2024-01-01'
  },
  {
    id: 2,
    title: 'TypeScript 进阶指南',
    category: '前端技术',
    author: 'admin',
    status: 'published',
    publishedAt: '2024-01-02'
  },
  {
    id: 3,
    title: 'Ant Design Vue 组件库使用',
    category: '前端技术',
    author: 'user',
    status: 'draft',
    publishedAt: '-'
  }
])

const pagination = {
  total: dataSource.value.length,
  pageSize: 10,
  current: 1
}
</script>

<style scoped>
.articles-container {
  width: 100%;
}
</style>
