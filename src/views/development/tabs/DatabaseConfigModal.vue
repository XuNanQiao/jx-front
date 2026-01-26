<template>
  <a-modal
    v-model:open="visibleLocal"
    :confirm-loading="loadingLocal"
    title="依赖包"
    :width="800"
    ok-text="保存"
    :cancel-button-props="{ style: { display: 'inline-block' } }"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel">
    <a-form ref="formRef" :model="form" layout="vertical">
      <div
        v-for="(item, index) in form.dependencies"
        :key="index"
        class="mb-4 p-4 border border-#f0f0f0 rounded relative">
        <a-row :gutter="16">
          <a-col :span="11">
            <a-form-item
              label="依赖包"
              :name="['dependencies', index, 'name']"
              :rules="[{ required: true, message: '依赖包不能为空', trigger: 'blur' }]">
              <a-input v-model:value="item.name" placeholder="请输入依赖包" />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item
              label="版本号"
              :name="['dependencies', index, 'version']"
              :rules="[{ required: true, message: '版本号不能为空', trigger: 'blur' }]">
              <a-input v-model:value="item.version" placeholder="请输入版本号" />
            </a-form-item>
          </a-col>
          <a-col :span="2" class="flex items-end pb-6">
            <a-button v-if="form.dependencies.length > 1" type="text" danger @click="removeDependency(index)">
              删除
            </a-button>
          </a-col>
        </a-row>
      </div>
      <a-button type="dashed" block @click="addDependency" class="mt-2">+ 添加依赖包</a-button>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { updateModelDev } from "@/api/development";
import { type FormInstance } from "ant-design-vue";
import { ref } from "vue";

interface Dependency {
  name: string | null;
  version: string | null;
}

interface FormData {
  dependencies: Dependency[];
}

const emit = defineEmits(["saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const detailVal = ref({});

// 表单数据
const form = ref<FormData>({
  dependencies: [
    {
      name: null,
      version: null,
    },
  ],
});

// 添加依赖包
const addDependency = () => {
  form.value.dependencies.push({
    name: null,
    version: null,
  });
};

// 删除依赖包
const removeDependency = (index: number) => {
  form.value.dependencies.splice(index, 1);
};

// 重置表单
const resetForm = () => {
  form.value.dependencies = [
    {
      name: null,
      version: null,
    },
  ];
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
    // 将所有依赖包添加到数组中
    form.value.dependencies.forEach((dep) => {
      data.dependency_package.push({
        name: dep.name,
        version: dep.version,
      });
    });
    const res: any = await updateModelDev(data);
    if (res && res.code === 200) {
      emit("saved", data);
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
