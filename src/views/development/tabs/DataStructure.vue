<template>
  <DescriptionsCom :openHand="false" bordered v-model:edit-mode-show="editMode" :detail="detail" :list="packageFields" @save="onSave">
    <template #package>
      <a-button type="primary" @click="openDatabaseConfigModal()">
        <template #icon>
          <PlusOutlined />
        </template>
        添加依赖
      </a-button>
    </template>
  </DescriptionsCom>

  <!-- 数据库连接配置弹窗 -->
  <a-alert message="如果模型依赖K2ASsets未预装的第三方python包，请在“依赖包”部分填写包名和版本，并通知营理员在后台安装此依赖包。" type="info" show-icon />

  <DatabaseConfigModal ref="databaseConfigModalRef" :detail="detail" :model-input-output-id="detail.id" @saved="handleDatabaseConfigSaved" />
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { getModelDevDetail, updateModelDev } from '@/api/development';
import { message } from 'ant-design-vue';
import { packageFields } from '../indexData';
import DatabaseConfigModal from './DatabaseConfigModal.vue';
import DescriptionsCom from '@/components/descriptionsCom.vue';

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
    message.error('缺少 id，无法保存');
    return;
  }
  try {
    await updateModelDev(form);
    message.success('保存成功');
    await loadDetail(); // 保存后重新加载数据
  } catch (err) {
    message.error('保存失败');
  }
};

// 打开数据库配置弹窗（编辑模式）
const openDatabaseConfigModal = (isAddMode: boolean) => {
  if (!detail.value.id) {
    message.warning('请先保存基础信息');
    return;
  }
  databaseConfigModalRef.value?.openModal(detail.value, isAddMode);
};

// 查看数据库配置（查看模式）
const viewDatabaseConfig = () => {
  if (!detail.value.id) {
    message.warning('暂无配置信息');
    return;
  }
  databaseConfigModalRef.value?.viewModal(detail.value);
};

// 数据库配置保存成功回调
const handleDatabaseConfigSaved = () => {
  loadDetail();
  message.success('数据库配置已保存');
};

// 加载详情数据
const loadDetail = async () => {
  if (!props.id) {
    message.error('缺少ID参数');
    return;
  }

  loading.value = true;
  try {
    const res: any = await getModelDevDetail(props.id);
    if (res?.code === 200 && res?.data) {
      detail.value = res.data;
    }
  } catch (err: any) {
    console.error('❌ 详情数据加载错误:', err);
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
