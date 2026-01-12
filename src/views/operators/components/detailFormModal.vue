<template>
  <a-modal v-model:open="visibleLocal" :confirm-loading="loadingLocal" :title="form.id ? '编辑数据项' : '新建数据项'" :width="700" ok-text="保存" cancel-text="取消" @ok="onOk" @cancel="onCancel">
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
          <a-form-item label="版本" name="attribute" required>
            <a-input v-model:value="form.attribute" placeholder="请输入版本" allow-clear />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="类别" name="category" required>
            <a-select v-model:value="form.category" placeholder="请选择类别" :options="selectOptions"> </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="编辑器" name="editor" required>
            <a-select v-model:value="form.editor" placeholder="请选择编辑器" :options="editorOptions"> </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="扩展信息" name="extended" required>
            <a-select v-model:value="form.extended" placeholder="请选择扩展信息" :options="extendedOptions"> </a-select>
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
import { selectOptions, editorOptions, extendedOptions } from "../indexData";
const emit = defineEmits(["update:modelValue", "saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const formdate = {
  id: undefined,
  name: "",
  attribute: "",
  category: "1",
  editor: "0",
  extended: "0",
};
// 表单数据
const form = reactive({ ...formdate });

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  attribute: [{ required: true, message: "请输入版本", trigger: "blur" }],
  category: [{ required: true, message: "请选择类别", trigger: "change" }],
  editor: [{ required: true, message: "请选择编辑器", trigger: "change" }],
  extended: [{ required: true, message: "请选择扩展信息", trigger: "change" }],
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
