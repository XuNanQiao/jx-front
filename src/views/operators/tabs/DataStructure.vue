<template>
  <DescriptionsCom :openHand="false" bordered v-model:edit-mode-show="editMode" :detail="detail" :list="packageFields" @save="onSave"> </DescriptionsCom>
  <!-- 数据库连接配置弹窗 -->
  <DatabaseConfigModal ref="databaseConfigModalRef" :model-input-output-id="detail.id" @saved="handleDatabaseConfigSaved" />
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { getDetail, updateItem } from "@/api/inputOutput";
import { message } from "ant-design-vue";
import { packageFields } from "../indexData";
import DatabaseConfigModal from "./DatabaseConfigModal.vue";
import DescriptionsCom from "@/components/descriptionsCom.vue";

const props = defineProps<{ id: any | null }>();
const editMode = ref(false);
const loading = ref(false);
const detail = ref<any>({});

// 数据库配置弹窗引用
const databaseConfigModalRef = ref<any>(null);

const onSave = async (form: any) => {
  await save();
  editMode.value = false;
};

const save = async (form: any) => {
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
