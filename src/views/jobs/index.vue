<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 17:04:17
 * @LastEditTime: 2026-01-19 15:32:54
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\jobs\index.vue
 * 
-->
<template>
  <div>
    <a-card title="模型作业" :bordered="false" class="page">
      <div class="detail-content">
        <!-- Tabs -->
        <a-tabs v-model:activeKey="activeKey" type="line" size="large">
          <a-tab-pane key="browse" tab="作业列表">
            <DataBrowse :id="id" v-if="activeKey === 'browse'" />
          </a-tab-pane>

          <a-tab-pane key="basic" tab="作业计划">
            <BasicInfo :id="id" v-if="activeKey === 'basic'" />
          </a-tab-pane>
          <a-tab-pane key="structure" tab="作业组">
            <DataStructure :id="id" v-if="activeKey === 'structure'" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import BasicInfo from './tabs/BasicInfo.vue';
import DataStructure from './tabs/DataStructure.vue';
import DataBrowse from './tabs/DataBrowse.vue';

const route = useRoute();
const id = computed(() => route.params.id);
const activeKey = ref('browse');
</script>

<style scoped lang="scss">
.crumb-parent {
  a {
    color: var(--theme-info) !important;
  }
}
.crumb-current {
  color: #ffffff !important;
}
:deep(.ant-tabs) {
  .ant-tabs-tab {
    padding: 0 0 4px 0;
    font-size: 14px;
  }
  .ant-tabs-tab-btn {
    color: #ffffff !important;
  }
  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: var(--theme-info) !important;
    }
  }
  /* Tab underline / ink bar use theme primary */
  .ant-tabs-ink-bar {
    background: var(--theme-info) !important;
  }
  /* Ensure extra tab styles for line type */
  .ant-tabs.ant-tabs-line > .ant-tabs-nav .ant-tabs-tab {
    color: #ffffff !important;
  }
}
:deep(.ant-card) {
  .ant-card-head {
    min-height: 40px;
  }
  .ant-card-body {
    padding: 12px 24px 24px;
  }
}
:deep(.ant-breadcrumb) {
  .ant-breadcrumb-separator {
    color: #ffffff !important;
  }
}
</style>
