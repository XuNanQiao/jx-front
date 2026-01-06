<template>
  <a-modal v-model:open="visibleLocal" :title="isEditing ? '编辑数据项' : '新建数据项'" ok-text="保存" cancel-text="取消" @ok="onOk" @cancel="onCancel">
    <a-form layout="vertical">
      <a-form-item label="名称" required>
        <a-input v-model:value="form.name" placeholder="请输入名称" />
      </a-form-item>

      <a-form-item label="属性" required>
        <a-select v-model:value="form.attribute" style="width: 100%">
          <a-select-option value="输入">输入</a-select-option>
          <a-select-option value="输出">输出</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="类别" required>
        <a-select v-model:value="form.category" style="width: 100%" allow-clear>
          <a-select-option v-for="opt in selectOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="完整度(%)">
        <a-input-number v-model:value="form.completeness" :min="0" :max="100" style="width: 100%" />
      </a-form-item>

      <a-form-item label="周期(ms)">
        <a-input-number v-model:value="form.cycle" :min="0" style="width: 100%" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, watch, toRefs, ref, computed } from "vue";
import type { ModelInputOutput } from "@/types/model";

const props = defineProps<{
  modelValue: boolean;
  editData?: Partial<ModelInputOutput> | null;
  selectOptions: { label: string; value: string }[];
}>();

const emit = defineEmits(["update:modelValue", "save"]);

const visibleLocal = ref<boolean>(!!props.modelValue);

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

const onOk = () => {
  if (!form.name || !form.attribute || !form.category) {
    // 仅通过事件通知父级显示提示
    emit("save", { error: "validation", payload: null });
    return;
  }

  // 发出保存事件，父组件决定新增或更新
  emit("save", { error: null, payload: { ...form } });
};

const onCancel = () => {
  visibleLocal.value = false;
};
</script>
