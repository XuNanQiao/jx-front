<template>
  <div class="roles-container">
    <a-card title="角色管理" :bordered="false">
      <template #extra>
        <a-button type="primary">
          <template #icon>
            <PlusOutlined />
          </template>
          新增角色
        </a-button>
      </template>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :scroll="{ y: 'calc(100vh - 280px)' }">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small">编辑</a-button>
              <a-button type="link" size="small">权限配置</a-button>
              <a-button type="link" size="small" danger>删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '角色标识', dataIndex: 'code', key: 'code' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'action', width: 200 },
];

const dataSource = ref([
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: '管理员',
    code: 'admin',
    description: '拥有系统大部分权限',
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: '普通用户',
    code: 'user',
    description: '基础权限',
    createdAt: '2024-01-01',
  },
]);

const pagination = {
  total: dataSource.value.length,
  pageSize: 10,
  current: 1,
};
</script>

<style scoped>
.roles-container {
  width: 100%;
}
</style>
