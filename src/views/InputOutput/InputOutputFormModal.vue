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
        <a-col :span="12">
          <a-form-item label="显示名称" name="name" required>
            <a-input v-model:value="form.name" placeholder="请输入显示名称" :maxlength="50" show-count allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="节点名称" name="node_name_en" required>
            <a-input
              v-model:value="form.node_name_en"
              placeholder="请输入节点名称"
              :maxlength="50"
              show-count
              allow-clear />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="属性" name="attribute" required>
            <a-select v-model:value="form.attribute" placeholder="请选择属性" :options="selectOptions" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="类别" name="category" required>
            <a-select v-model:value="form.category" placeholder="请选择类别" :options="attributeOptions"></a-select>
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
              style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="周期" name="cycle_time">
            <template #label>
              <span>周期 (ms)</span>
            </template>
            <a-input-number
              v-model:value="form.cycle_time"
              :min="1"
              :step="100"
              placeholder="请输入周期"
              style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { createItem, updateItem } from "@/api/inputOutput";
import { type FormInstance } from "ant-design-vue";
import { selectOptions, attributeOptions } from "./index";
const emit = defineEmits(["update:modelValue", "saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const formdate = {
  id: undefined,
  name: "",
  node_name_en: "",
  attribute: "输入",
  category: "1",
  integrity: 0,
  cycle_time: 1000,
};
// 表单数据
const form = reactive<Partial<ModelInputOutput>>({ ...formdate });

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入显示名称", trigger: "blur" },
    { min: 1, max: 50, message: "显示名称长度应在1-50个字符之间", trigger: "blur" },
  ],
  node_name_en: [
    { required: true, message: "请输入节点名称", trigger: "blur" },
    { min: 1, max: 50, message: "节点名称长度应在1-50个字符之间", trigger: "blur" },
  ],
  attribute: [{ required: true, message: "请选择属性", trigger: "change" }],
  category: [{ required: true, message: "请选择类别", trigger: "change" }],
  integrity: [{ type: "number", min: 0, max: 100, message: "完整度应在0-100之间", trigger: "blur" }],
  cycle_time: [{ type: "number", min: 1, message: "周期必须大于0", trigger: "blur" }],
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
    form.integrity = record.integrity ? record.integrity * 100 : 0;
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
    data.integrity = data.integrity / 100;
    if (form.id) {
      // 编辑模式
      const res: any = await updateItem(data);
      if (res && res.code === 200) {
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      }
    } else {
      // 新建模式
      const res: any = await createItem(data);
      if (res && res.code === 200) {
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      }
    }
  } catch (err: any) {
    console.error("保存失败:", err);
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
