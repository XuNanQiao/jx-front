<template>
  <a-modal
    v-model:open="visibleLocal"
    :confirm-loading="loadingLocal"
    :title="form.id ? '编辑数据项' : '新建数据项'"
    :width="700"
    ok-text="保存"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="名称" name="name" required>
            <a-input v-model:value="form.name" placeholder="请输入名称" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="模型版本" name="version" required>
            <a-input v-model:value="form.version" placeholder="请输入模型版本" allow-clear />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="类别" name="category" required>
            <a-select v-model:value="form.category" placeholder="请选择类别" :options="selectOptions"></a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="编辑器" name="editor" required>
            <a-select v-model:value="form.editor" placeholder="请选择编辑器" :options="editorOptions"></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="编程语言" name="language">
            <a-select v-model:value="form.language" placeholder="请选择编程语言" :options="languageOptions" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设备类型" name="levice_type">
            <a-select v-model:value="form.levice_type" placeholder="请选择设备类型" :options="deviceTypeOptions" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { createModelDev, updateModelDev } from '@/api/development';
import { type FormInstance } from 'ant-design-vue';
import { selectOptions, editorOptions, languageOptions, deviceTypeOptions } from '../indexData';
const emit = defineEmits(['update:modelValue', 'saved']);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const formdate = {
  id: undefined,
  name: '',
  version: '',
  category: 0,
  editor: 0,
  language: 'python32',
  levice_type: 0,
};
// 表单数据
const form = reactive({ ...formdate });

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  version: [{ required: true, message: '请输入模型版本', trigger: 'blur' }],
  category: [{ required: true, message: '请选择类别', trigger: 'change' }],
  editor: [{ required: true, message: '请选择编辑器', trigger: 'change' }],
};

// 重置表单
const resetForm = () => {
  Object.assign(form, formdate);
  formRef.value?.clearValidate();
};

// 打开弹窗
const openModal = (record?: any) => {
  visibleLocal.value = true;
  if (record) {
    Object.assign(form, record);
  } else {
    resetForm();
  }
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
    // 构建提交数据，将驼峰命名转换为下划线命名（如果后端需要）
    let data = JSON.parse(JSON.stringify(form));
    if (data.version && !data.attribute) {
      // 兼容后端旧字段名
      data.attribute = data.version;
    }
    if (form.id) {
      // 编辑模式
      const res: any = await updateModelDev(data);
      if (res && res.code === 200) {
        emit('saved', res.data);
        visibleLocal.value = false;
        resetForm();
      }
    } else {
      // 新建模式
      const res: any = await createModelDev(data);
      if (res && res.code === 200) {
        emit('saved', res.data);
        visibleLocal.value = false;
        resetForm();
      }
    }
  } catch (err: any) {
    console.error('保存失败:', err);
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
