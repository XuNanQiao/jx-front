<template>
  <a-modal
    v-model:open="visibleLocal"
    :confirm-loading="loadingLocal"
    :title="form.id ? '编辑数据项' : '新建数据项'"
    :width="700"
    ok-text="保存"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="列名" name="column" required>
            <a-input
              v-model:value="form.column"
              placeholder="请输入列名"
              :maxlength="50"
              show-count
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="显示名称" name="name" required>
            <a-input
              v-model:value="form.name"
              placeholder="请输入显示名称"
              :maxlength="50"
              show-count
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="数据类型" name="dataType" required>
            <a-select
              v-model:value="form.dataType"
              placeholder="请选择数据类型"
              :options="dataTypeOptions"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="模型输入输出ID" name="modelInputOutputId">
            <a-input-number
              v-model:value="form.modelInputOutputId"
              placeholder="请输入模型输入输出ID"
              style="width: 100%"
              :min="1"
            />
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

// 表单数据
const form = reactive<Partial<DataStructure>>({
  id: undefined,
  column: "",
  name: "",
  dataType: undefined,
  modelInputOutputId: undefined,
});

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
  dataType: [{ required: true, message: "请选择数据类型", trigger: "change" }],
  modelInputOutputId: [
    { type: "number", min: 1, message: "模型输入输出ID必须大于0", trigger: "blur" },
  ],
};

// 重置表单
const resetForm = () => {
  form.id = undefined;
  form.column = "";
  form.name = "";
  form.dataType = undefined;
  form.modelInputOutputId = undefined;
  formRef.value?.clearValidate();
};

// 打开弹窗
const openModal = (record?: any) => {
  visibleLocal.value = true;
  if (record) {
    form.id = record.id;
    form.column = record.column || "";
    form.name = record.name || "";
    form.dataType = record.dataType;
    form.modelInputOutputId = record.modelInputOutputId;
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
    if (form.id) {
      const res: any = await updateDataStructure(String(form.id), form);
      if (res && res.code === 200) {
        message.success("更新成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "更新失败");
      }
    } else {
      const res: any = await createDataStructure(form);
      if (res && res.code === 200) {
        message.success("创建成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "创建失败");
      }
    }
  } catch (err: any) {
    console.error(err);
    message.error(err?.message || "保存失败");
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
