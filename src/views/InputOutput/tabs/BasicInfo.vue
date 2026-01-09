<template>
  <div class="basic-info">
    <!-- 全局操作 -->
    <div class="global-actions">
      <a-space>
        <a-button type="default" size="small" v-if="!editMode" @click="toggleEdit">编辑</a-button>
        <a-space v-else>
          <a-button size="small" @click="cancelEdit">取消</a-button>
          <a-button type="primary" size="small" @click="onSave">保存</a-button>
        </a-space>
      </a-space>
    </div>

    <!-- 基础信息 模块 -->
    <div class="module">
      <div class="module-header" @click="toggle('basic')">
        <span class="triangle" :class="{ open: open.basic }" aria-hidden="true"></span>
        <span class="module-title">基础信息</span>
      </div>
      <div v-show="open.basic" class="module-body">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item v-for="field in basicFields" :key="field.key" :label="field.label">
            <template v-if="editMode">
              <template v-if="field.sort === 'defaultDevice'">
                <a-switch v-model:checked="form.defaultDevice" />
              </template>
              <template v-else-if="field.sort === 'storageEngine'">
                <!-- <a-input v-model:value="form.storageEngine" style="width: calc(100% - 160px); display: inline-block" /> -->
                <a-button size="small" style="margin-left: 8px" @click="openDatabaseConfigModal">配置</a-button>
              </template>
              <template v-else-if="field.sort === 'cycleTime'">
                <a-input-number v-model:value="form[field.key]" :min="0" style="width: 100%" placeholder="请输入数据周期" />
              </template>
              <template v-else>
                <a-input v-model:value="form[field.key]" />
              </template>
            </template>
            <template v-else>
              <template v-if="field.sort === 'storageEngine'">
                <span class="desc-text" @click="viewDatabaseConfig">{{ detail.storageEngine ?? "-" }}</span>
                <a-button size="small" type="link" style="margin-left: 8px" @click="openDatabaseConfigModal">查看配置</a-button>
              </template>
              <template v-else-if="field.sort === 'defaultDevice'">
                <span class="desc-text">{{ detail.defaultDevice ? "是" : "否" }}</span>
              </template>
              <template v-else-if="field.sort === 'dataType'">
                <span class="desc-text">{{ detail[field.key] ?? "时序数据" }}</span>
              </template>
              <template v-else>
                <span class="desc-text">{{ detail[field.key] ?? "-" }}</span>
              </template>
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>

    <!-- 数据保留 模块 -->
    <div class="module">
      <div class="module-header" @click="toggle('retention')">
        <span class="triangle" :class="{ open: open.retention }" aria-hidden="true"></span>
        <span class="module-title">数据保留</span>
      </div>
      <div v-show="open.retention" class="module-body">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item v-for="field in retentionFields" :key="field.key" :label="field.label">
            <template v-if="editMode">
              <a-select v-model:value="form[field.key]" style="width: 100%" placeholder="请选择">
                <a-select-option v-for="option in retentionOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else>
              <span class="desc-text">{{ getRetentionLabel(detail[field.key]) }}</span>
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>

    <!-- 其他信息 模块 -->
    <div class="module">
      <div class="module-header" @click="toggle('other')">
        <span class="triangle" :class="{ open: open.other }" aria-hidden="true"></span>
        <span class="module-title">其他信息</span>
      </div>
      <div v-show="open.other" class="module-body">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item v-for="field in otherFields" :key="field.key" :label="field.label">
            <template v-if="field.sort == 'created'">
              <span class="desc-text">{{ detail["created_time"] ? dayjs(detail["created_time"]).format("YYYY-MM-DD HH:mm:ss") : "-" }}/{{ detail["created_user_id"] ?? "-" }}</span>
            </template>
            <span v-else class="desc-text">{{ detail[field.key] ?? "-" }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>

    <!-- 数据库连接配置弹窗 -->
    <DatabaseConfigModal ref="databaseConfigModalRef" :model-input-output-id="detail.id" @saved="handleDatabaseConfigSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { getDetail, updateItem } from "@/api/inputOutput";
import { message } from "ant-design-vue";
import { basicFields, retentionFields, otherFields, retentionOptions } from "../index";
import DatabaseConfigModal from "./DatabaseConfigModal.vue";
import dayjs from "dayjs";

const props = defineProps<{ id: any | null }>();

const open = ref({ basic: true, retention: true, other: true });
const editMode = ref(false);
const loading = ref(false);
const detail = ref<any>({});
const form = reactive<any>({});

// 数据库配置弹窗引用
const databaseConfigModalRef = ref<any>(null);

// field definitions moved to ./index.ts

const toggle = (key: "basic" | "retention" | "other") => {
  open.value[key] = !open.value[key];
};

const toggleEdit = () => {
  editMode.value = true;
};

const cancelEdit = () => {
  editMode.value = false;
  // revert changes
  if (detail.value) {
    Object.keys(form).forEach((k) => delete form[k]);
    Object.assign(form, detail.value);
  }
};

const onSave = async () => {
  await save();
  editMode.value = false;
};

const save = async () => {
  if (!form.id) {
    message.error("缺少 id，无法保存");
    return;
  }
  try {
    await updateItem(form);
    message.success("保存成功");
    await loadDetail(); // 保存后重新加载数据
  } catch (err) {
    message.error("保存失败");
  }
};

// 打开数据库配置弹窗（编辑模式）
const openDatabaseConfigModal = () => {
  if (!detail.value.id) {
    message.warning("请先保存基础信息");
    return;
  }
  databaseConfigModalRef.value?.openModal(detail.value.id);
};

// 查看数据库配置（查看模式）
const viewDatabaseConfig = () => {
  if (!detail.value.id) {
    message.warning("暂无配置信息");
    return;
  }
  databaseConfigModalRef.value?.viewModal(detail.value.id);
};

// 数据库配置保存成功回调
const handleDatabaseConfigSaved = () => {
  message.success("数据库配置已保存");
};

// 获取数据保留显示标签
const getRetentionLabel = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  const strValue = String(value);
  const option = retentionOptions.find((opt) => opt.value === strValue);
  return option ? option.label : strValue;
};
// 加载详情数据
const loadDetail = async () => {
  if (!props.id) {
    message.error("缺少ID参数");
    return;
  }

  loading.value = true;
  try {
    const res: any = await getDetail(props.id);
    if (res?.code === 200 && res?.data) {
      detail.value = res.data;
      // 同步到表单
      Object.keys(form).forEach((k) => delete form[k]);
      Object.assign(form, res.data);
    }
  } catch (err: any) {
    console.error("❌ 详情数据加载错误:", err);
  } finally {
    loading.value = false;
  }
};

// 监听 id 变化
watch(
  () => props.id,
  (val) => {
    if (val) {
      loadDetail();
    }
  },
  { immediate: true }
);
</script>
<style scoped lang="scss">
.basic-info {
  .module {
    margin-bottom: 12px;

    .module-header {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 0;

      .header-actions {
        margin-left: auto;
      }

      .triangle {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid var(--theme-info);
        display: inline-block;
        transition: transform 0.2s ease;
      }
      .triangle.open {
        transform: rotate(180deg);
      }

      .module-title {
        margin-left: 8px;
        font-weight: 700;
        color: var(--theme-info);
      }
    }

    .module-body {
      padding: 0 0 0 8px;
      :deep(.ant-descriptions) {
        /* 强制两列各占 50% */

        .ant-descriptions-item-label {
          color: #ffffff;
          width: 150px;
          padding: 8px 16px;
        }
        .ant-descriptions-item-content {
          width: calc(100% - 150px);
        }
        .ant-descriptions-item-content,
        .desc-text {
          color: #ffffff;
        }
      }
    }
  }

  .actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.global-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: -48px;
  margin-bottom: 16px;
  width: 200px;
  float: right;
}
</style>
