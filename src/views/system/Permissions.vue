<template>
  <div class="permissions-container">
    <a-card title="权限管理" :bordered="false">
      <a-tree
        :tree-data="treeData"
        :default-expand-all="true"
        checkable
        :checked-keys="checkedKeys"
        @check="onCheck"
      >
        <template #title="{ title, key }">
          <span>{{ title }}</span>
          <a-tag v-if="key.includes('menu')" color="blue" style="margin-left: 8px">菜单</a-tag>
          <a-tag v-else color="green" style="margin-left: 8px">按钮</a-tag>
        </template>
      </a-tree>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checkedKeys = ref(['0-0-0', '0-0-1'])

const treeData = ref([
  {
    title: '系统管理',
    key: '0-0',
    children: [
      {
        title: '用户管理',
        key: '0-0-0-menu',
        children: [
          { title: '查看', key: '0-0-0-0' },
          { title: '新增', key: '0-0-0-1' },
          { title: '编辑', key: '0-0-0-2' },
          { title: '删除', key: '0-0-0-3' }
        ]
      },
      {
        title: '角色管理',
        key: '0-0-1-menu',
        children: [
          { title: '查看', key: '0-0-1-0' },
          { title: '新增', key: '0-0-1-1' },
          { title: '编辑', key: '0-0-1-2' },
          { title: '删除', key: '0-0-1-3' }
        ]
      },
      {
        title: '权限管理',
        key: '0-0-2-menu',
        children: [
          { title: '查看', key: '0-0-2-0' },
          { title: '配置', key: '0-0-2-1' }
        ]
      }
    ]
  },
  {
    title: '内容管理',
    key: '0-1',
    children: [
      {
        title: '文章管理',
        key: '0-1-0-menu',
        children: [
          { title: '查看', key: '0-1-0-0' },
          { title: '新增', key: '0-1-0-1' },
          { title: '编辑', key: '0-1-0-2' },
          { title: '删除', key: '0-1-0-3' }
        ]
      },
      {
        title: '分类管理',
        key: '0-1-1-menu',
        children: [
          { title: '查看', key: '0-1-1-0' },
          { title: '新增', key: '0-1-1-1' },
          { title: '编辑', key: '0-1-1-2' },
          { title: '删除', key: '0-1-1-3' }
        ]
      }
    ]
  }
])

const onCheck = (checked: any) => {
  checkedKeys.value = checked
}
</script>

<style scoped>
.permissions-container {
  width: 100%;
}
</style>
