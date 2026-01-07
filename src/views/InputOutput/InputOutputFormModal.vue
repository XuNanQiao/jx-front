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
        <a-col :span="24">
          <a-form-item label="名称" name="name" required>
            <a-input
              v-model:value="form.name"
              placeholder="请输入名称"
              :maxlength="50"
              show-count
              allow-clear
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="属性" name="attribute" required>
            <a-select
              v-model:value="form.attribute"
              placeholder="请选择属性"
              :options="attributeOptions"
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="类别" name="category" required>
            <a-select
              v-model:value="form.category"
              placeholder="请选择类别"
              allow-clear
            >
              <a-select-option
                v-for="opt in selectOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="完整度" name="integrity">
            <template #label>
              <span>完整度 (%)</span>
            </template>
            <a-input-number
              v-model:value="form.integrity"
              :min="0"
              :max="100"
              :step="1"
              placeholder="请输入完整度"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="周期" name="cycleTime">
            <template #label>
              <span>周期 (ms)</span>
            </template>
            <a-input-number
              v-model:value="form.cycleTime"
              :min="1"
              :step="100"
              placeholder="请输入周期"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ModelInputOutput } from "@/types/model";
import { createItem, updateItem } from "@/api/inputOutput";
import { message, type FormInstance } from "ant-design-vue";
import { selectOptions, attributeOptions } from "./index";
const emit = defineEmits(["update:modelValue", "saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();

// 表单数据
const form = reactive<Partial<ModelInputOutput>>({
  id: undefined,
  name: "",
  attribute: "输入",
  category: undefined,
  integrity: 0,
  cycleTime: 1000,
});

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入名称", trigger: "blur" },
    { min: 1, max: 50, message: "名称长度应在1-50个字符之间", trigger: "blur" },
  ],
  attribute: [{ required: true, message: "请选择属性", trigger: "change" }],
  category: [{ required: true, message: "请选择类别", trigger: "change" }],
  integrity: [
    { type: "number", min: 0, max: 100, message: "完整度应在0-100之间", trigger: "blur" },
  ],
  cycleTime: [{ type: "number", min: 1, message: "周期必须大于0", trigger: "blur" }],
};

// 重置表单
const resetForm = () => {
  form.id = undefined;
  form.name = "";
  form.attribute = "输入";
  form.category = undefined;
  form.integrity = 0;
  form.cycleTime = 1000;
  formRef.value?.clearValidate();
};

// 打开弹窗
const openModal = (record?: any) => {
  visibleLocal.value = true;
  if (record) {
    form.id = record.id;
    form.name = record.name || "";
    form.attribute = record.attribute || "输入";
    form.category = record.category;
    form.integrity = record.integrity ?? 0;
    form.cycleTime = record.cycleTime ?? 1000;
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
      const res: any = await updateItem(String(form.id), form);
      if (res && res.code === 200) {
        message.success("更新成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "更新失败");
      }
    } else {
      const res: any = await createItem(form);
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
