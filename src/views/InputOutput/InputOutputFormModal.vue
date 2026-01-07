<template>
  <a-modal v-model:open="visibleLocal" :confirm-loading="loadingLocal" :title="isEditing ? '编辑数据项' : '新建数据项'" ok-text="保存" cancel-text="取消" @ok="onOk" @cancel="onCancel">
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="名称" required>
            <a-input v-model:value="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="属性" required>
            <a-select v-model:value="form.attribute" style="width: 100%">
              <a-select-option value="输入">输入</a-select-option>
              <a-select-option value="输出">输出</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="8">
          <a-form-item label="类别" required>
            <a-select v-model:value="form.category" style="width: 100%" allow-clear>
              <a-select-option v-for="opt in selectOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="完整度(%)">
            <a-input-number v-model:value="form.completeness" :min="0" :max="100" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="周期(ms)">
            <a-input-number v-model:value="form.cycle" :min="0" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs, ref, computed } from "vue";
import type { ModelInputOutput } from "@/types/model";
import { createItem, updateItem } from '@/api/inputOutput'
import { message } from 'ant-design-vue'

const props = defineProps<{
  modelValue: boolean;
  editData?: Partial<ModelInputOutput> | null;
  selectOptions: { label: string; value: string }[];
}>();

const emit = defineEmits(["update:modelValue", "saved"]);

const visibleLocal = ref<boolean>(!!props.modelValue);
const loadingLocal = ref(false);

watch(
  () => props.modelValue,
  (v) => {
    visibleLocal.value = !!v;
  }
);

watch(visibleLocal, (v) => {
  emit("update:modelValue", v);
});

const isEditing = computed(() => !!(props.editData && (props.editData as any).id));

const form = reactive<Partial<ModelInputOutput>>({
  id: undefined,
  name: "",
  attribute: "输入",
  category: undefined,
  completeness: 0,
  cycle: 1000,
});

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.id = val.id;
      form.name = val.name || "";
      form.attribute = val.attribute || "输入";
      form.category = val.category;
      form.completeness = val.completeness ?? 0;
      form.cycle = val.cycle ?? 1000;
    } else {
      form.id = undefined;
      form.name = "";
      form.attribute = "输入";
      form.category = undefined;
      form.completeness = 0;
      form.cycle = 1000;
    }
  },
  { immediate: true }
);

const onOk = async () => {
  if (!form.name || !form.attribute || !form.category) {
    message.warning('请填写名称、属性和类别')
    return;
  }

  loadingLocal.value = true;
  try {
    if (isEditing.value && form.id) {
      const res: any = await updateItem(String(form.id), form)
      if (res && res.code === 200) {
        message.success('更新成功')
        emit('saved', res.data)
        visibleLocal.value = false
      } else {
        throw new Error(res?.message || '更新失败')
      }
    } else {
      const res: any = await createItem(form)
      if (res && res.code === 200) {
        message.success('创建成功')
        emit('saved', res.data)
        visibleLocal.value = false
      } else {
        throw new Error(res?.message || '创建失败')
      }
    }
  } catch (err: any) {
    console.error(err)
    message.error(err?.message || '保存失败')
  } finally {
    loadingLocal.value = false
  }
};

const onCancel = () => {
  visibleLocal.value = false;
};
</script>
