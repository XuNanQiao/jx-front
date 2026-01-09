<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 17:04:17
 * @LastEditTime: 2026-01-08 10:41:04
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\InputOutput\Detail.vue
 * 
-->
<template>
  <div>
    <a-card :bordered="false" class="page">
      <template #title>
        <a-breadcrumb style="margin-bottom: 0">
          <a-breadcrumb-item class="crumb-parent">
            <router-link :to="{ name: 'ModelInputOutput' }">模型输入输出</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item class="crumb-current">{{ name || "详情" }}</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <div class="detail-content">
        <!-- Loading -->
        <div v-if="loading" class="loading-container">
          <a-spin size="large" tip="加载中..." />
        </div>

        <!-- Tabs -->
        <a-tabs v-else v-model:activeKey="activeKey" type="line" size="large">
          <a-tab-pane key="basic" tab="基础信息">
            <BasicInfo :id="id" />
          </a-tab-pane>
          <a-tab-pane key="structure" tab="数据结构">
            <DataStructure :id="id" />
          </a-tab-pane>
          <a-tab-pane key="browse" tab="数据浏览">
            <DataBrowse :id="id" />
          </a-tab-pane>
          <a-tab-pane key="completeness" tab="数据完整度">
            <DataCompleteness :id="id" />
          </a-tab-pane>
          <a-tab-pane key="stats" tab="接入统计">
            <AccessStats :id="id" />
          </a-tab-pane>
          <a-tab-pane key="upload" tab="数据上传">
            <DataUpload :id="id" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import BasicInfo from "./tabs/BasicInfo.vue";
import DataStructure from "./tabs/DataStructure.vue";
import DataBrowse from "./tabs/DataBrowse.vue";
import DataCompleteness from "./tabs/DataCompleteness.vue";
import AccessStats from "./tabs/AccessStats.vue";
import DataUpload from "./tabs/DataUpload.vue";

const route = useRoute();
const router = useRouter();

const id = computed(() => (route.params.id as string) || "");
const name = computed(() => (route.params.name as string) || "");
const activeKey = ref("basic");
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.crumb-parent {
  a {
    color: var(--theme-info) !important;
  }
}
.crumb-current {
  color: #ffffff !important;
}
:deep(.ant-tabs) {
  .ant-tabs-nav-wrap {
    border-bottom: 1px solid #fff;
  }
  .ant-tabs-tab {
    padding: 0 0 8px 0;
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
:deep(.ant-breadcrumb) {
  .ant-breadcrumb-separator {
    color: #ffffff !important;
  }
}
</style>
