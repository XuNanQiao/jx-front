<template>
  <a-modal
    v-model:open="visibleLocal"
    :confirm-loading="loadingLocal"
    title="依赖包"
    :width="700"
    ok-text="保存"
    :cancel-button-props="{ style: { display: 'inline-block' } }"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="依赖包" name="name">
            <a-input v-model:value="form.name" placeholder="请输入依赖包" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="版本号" name="version">
            <a-input v-model:value="form.version" placeholder="请输入版本号" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { updateModelDev } from '@/api/development';
import { type FormInstance } from 'ant-design-vue';
import { ref } from 'vue';

const emit = defineEmits(['saved']);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const detailVal = ref({});

// 表单数据
const form = ref({
  version: null,
  name: null,
});

// 动态表单验证规则
const rules = ref({
  name: [{ required: true, message: '依赖包不能为空', trigger: 'blur' }],
  version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
});

// 重置表单
const resetForm = () => {
  form.value.name = null;
  form.value.version = null;
  formRef.value?.clearValidate();
};

// 打开弹窗（编辑模式）
const openModal = async (detail: any) => {
  visibleLocal.value = true;
  detailVal.value = JSON.parse(JSON.stringify(detail));
  // 先清空表单和验证
  resetForm();
};

// 确定提交
const onOk = async () => {
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  loadingLocal.value = true;
  try {
    let data = JSON.parse(JSON.stringify(detailVal.value));
    if (!data.dependency_package) {
      data.dependency_package = [];
    }
    data.dependency_package.push({
      name: form.value.name + '.txt',
      version: form.value.version,
    });
    const res: any = await updateModelDev(data);
    if (res && res.code === 200) {
      emit('saved', data);
      visibleLocal.value = false;
      resetForm();
    }
  } catch (err: any) {
    console.error(err);
  } finally {
    loadingLocal.value = false;
  }
};

// 取消
const onCancel = () => {
  visibleLocal.value = false;
  resetForm();
};

defineExpose({
  openModal,
});
</script>
