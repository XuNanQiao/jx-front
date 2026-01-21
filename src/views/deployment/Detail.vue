<!--
 * @Author: ZHAO
 * @Date: 2026-01-06 17:04:17
 * @LastEditTime: 2026-01-20 15:51:27
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\deployment\Detail.vue
 * 
-->
<template>
  <div>
    <a-card :bordered="false" class="page">
      <template #title>
        <a-breadcrumb style="margin-bottom: 0">
          <a-breadcrumb-item class="crumb-parent">
            <router-link :to="{ name: 'ModelDevelopment' }">模型部署</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item class="crumb-current">{{ detailName }}</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <div class="detail-content">
        <!-- Tabs -->
        <a-tabs v-model:activeKey="activeKey" type="line" size="large">
          <a-tab-pane key="basic" tab="基础信息">
            <BasicInfo :id="id" v-if="activeKey === 'basic'" />
          </a-tab-pane>

          <a-tab-pane key="browse" tab="作业">
            <DataBrowse :id="id" v-if="activeKey === 'browse'" geturl="deploylJob" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, ref } from "vue";
import BasicInfo from "./tabs/BasicInfo.vue";
import DataBrowse from "@/components/journalView/DataBrowse.vue";

const route = useRoute();
const id = computed(() => {
  const paramId = route.params.id;
  return Array.isArray(paramId) ? paramId[0] : paramId;
});
const detailName = computed(() => (route.query.name as string) || "详情");
const activeKey = ref("basic");
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
