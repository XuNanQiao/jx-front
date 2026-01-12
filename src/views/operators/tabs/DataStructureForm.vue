<template>
  <a-modal v-model:open="visibleLocal" :confirm-loading="loadingLocal" :title="form.id ? '编辑数据项' : '新建数据项'" :width="700" ok-text="保存" cancel-text="取消" @ok="onOk" @cancel="onCancel">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="列名" name="column" required>
            <a-input v-model:value="form.column" placeholder="请输入列名" :maxlength="50" show-count allow-clear />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="显示名称" name="name" required>
            <a-input v-model:value="form.name" placeholder="请输入显示名称" :maxlength="50" show-count allow-clear />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="数据类型" name="data_type" required>
            <a-select v-model:value="form.data_type" placeholder="请选择数据类型" :options="dataTypeOptions" allow-clear />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { DataStructure } from "@/types/model";
import { createDataStructure, updateDataStructure } from "@/api/inputOutput";
import { message, type FormInstance } from "ant-design-vue";
const emit = defineEmits(["update:modelValue", "saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const props = defineProps<{ modelInputOutputId: any | null }>();

// 数据类型选项
const dataTypeOptions = [
  { label: "字符串(String)", value: "string" },
  { label: "整数(Integer)", value: "integer" },
  { label: "浮点数(Float)", value: "float" },
  { label: "布尔值(Boolean)", value: "boolean" },
  { label: "日期(Date)", value: "date" },
  { label: "时间戳(Timestamp)", value: "timestamp" },
  { label: "JSON", value: "json" },
];
const formData = {
  model_input_output_id: "",
  id: undefined,
  column: "",
  name: "",
  data_type: undefined,
};
// 表单数据
const form = reactive<Partial<DataStructure>>({ ...formData });

// 表单验证规则
const rules = {
  column: [
    { required: true, message: "请输入列名", trigger: "blur" },
    { min: 1, max: 50, message: "列名长度应在1-50个字符之间", trigger: "blur" },
  ],
  name: [
    { required: true, message: "请输入显示名称", trigger: "blur" },
    { min: 1, max: 50, message: "显示名称长度应在1-50个字符之间", trigger: "blur" },
  ],
  data_type: [{ required: true, message: "请选择数据类型", trigger: "change" }],
};

// 重置表单
const resetForm = () => {
  Object.assign(form, formData);
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
  form.model_input_output_id = props.modelInputOutputId;
  try {
    if (form.id) {
      const res: any = await updateDataStructure(String(form.id), form, );
      if (res && res.code === 200) {
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      }
    } else {
      const res: any = await createDataStructure(form, );
      if (res && res.code === 200) {
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      }
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
