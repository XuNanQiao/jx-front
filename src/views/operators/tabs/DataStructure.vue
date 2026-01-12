<template>
  <div class="basic-info page">
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

    <div class="module" v-for="(item, index) in packageFields" :key="index">
      <div class="module-header">
        <span class="module-title">{{ item.title }}</span>
      </div>
      <div class="module-body">
        <a-descriptions bordered :column="2">
          <a-descriptions-item :span="1" v-for="(field, chilIndex) in item.fields" :key="chilIndex" :label="field.label">
            <template v-if="editMode && field.type === 'switch'">
              <a-switch v-model:checked="form[field.key]" />
            </template>
            <template v-else-if="editMode && field.type === 'select'">
              <a-select v-model:value="form.retention" style="width: 100%" placeholder="请选择数据保留周期">
                <a-select-option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="field.type === 'number'">
              <a-input-number v-model:value="form[field.key]" :min="0" style="width: 100%" placeholder="请输入数据周期" />
            </template>
            <template v-else-if="field.type === 'input'">
              <a-input v-model:value="form[field.key]" />
            </template>

            <template v-else>
              <span class="desc-text">{{ detail[field.key] ?? "-" }}</span>
            </template>
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
import { packageFields } from "../indexData";
import DatabaseConfigModal from "./DatabaseConfigModal.vue";

const props = defineProps<{ id: any | null }>();
const editMode = ref(false);
const loading = ref(false);
const detail = ref<any>({});
const form = reactive<any>({});

// 数据库配置弹窗引用
const databaseConfigModalRef = ref<any>(null);
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
const openDatabaseConfigModal = (isAddMode: boolean) => {
  if (!detail.value.id) {
    message.warning("请先保存基础信息");
    return;
  }
  databaseConfigModalRef.value?.openModal(detail.value, isAddMode);
};

// 查看数据库配置（查看模式）
const viewDatabaseConfig = () => {
  if (!detail.value.id) {
    message.warning("暂无配置信息");
    return;
  }
  databaseConfigModalRef.value?.viewModal(detail.value);
};

// 数据库配置保存成功回调
const handleDatabaseConfigSaved = (data: any) => {
  if (editMode.value) {
    Object.assign(form, data);
  } else {
    loadDetail();
  }
  message.success("数据库配置已保存");
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
          min-width: 150px !important;
          padding: 8px 16px;
        }
        .ant-descriptions-item-content {
          width: 50%;
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
