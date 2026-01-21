<template>
  <div class="basic-info page">
    <DescriptionsCom v-model:edit-mode-show="editMode" :detail="detail" :list="moduleList" @save="onSave">
      <template #storageEngineEdit="slotProps">
        <span class="desc-text">{{ (slotProps as SlotProps).form.database_category ?? "-" }}</span>
        <a-button size="small" style="margin-left: 8px" @click="openDatabaseConfigModal(true)">配置</a-button>
      </template>
      <template #storageEngineView>
        <span class="desc-text" @click="viewDatabaseConfig">{{ detail.database_category ?? "-" }}</span>
        <a-button size="small" type="link" style="margin-left: 8px" @click="openDatabaseConfigModal(false)">
          查看配置
        </a-button>
      </template>
      <template #createdInfo>
        <span class="desc-text">
          {{ detail.created_user_id ?? "-" }} /
          {{ detail.created_time ? dayjs(detail.created_time).format("YYYY-MM-DD HH:mm:ss") : "-" }}
        </span>
      </template>
      <template #category>
        <span class="desc-text">{{ detail.category == "1" ? "系统" : "台账" }}</span>
      </template>
    </DescriptionsCom>

    <!-- 数据库连接配置弹窗 -->
    <DatabaseConfigModal
      ref="databaseConfigModalRef"
      :model-input-output-id="detail.id"
      @saved="handleDatabaseConfigSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getDetail, updateItem } from "@/api/inputOutput";
import { message } from "ant-design-vue";
import { moduleList } from "../index";
import DatabaseConfigModal from "./DatabaseConfigModal.vue";
import DescriptionsCom from "@/components/descriptionsCom.vue";
import dayjs from "dayjs";

// 定义 slot 的类型
interface SlotProps {
  form: Record<string, any>;
  field: FieldItem;
}

const props = defineProps<{ id: any | null }>();

const editMode = ref(false);
const loading = ref(false);
const detail = ref<any>({});

// 数据库配置弹窗引用
const databaseConfigModalRef = ref<any>(null);

const onSave = async (form: any) => {
  await save(form);
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
    detail.value = { ...detail.value, ...data };
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
  { immediate: true },
);
</script>
<style scoped lang="scss"></style>
