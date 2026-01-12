<template>
  <div class="basic-info page">
    <!-- 全局操作 -->
    <div class="global-actions">
      <a-space>
        <a-button type="default" size="small" v-if="!editMode" @click="toggleEdit">编辑</a-button>
        <a-space v-else>
          <a-button size="small" @click="cancelEdit">取消</a-button>
          <a-button type="primary" size="small" @click="onSave">保存</a-button>
        </a-space>
      </a-space>
    </div>

    <!-- 基础信息 模块 -->
    <div class="module" v-for="(item, index) in list" :key="index">
      <div class="module-header" @click="toggle(item.key)">
        <span class="triangle" v-if="openHand" :class="{ open: open[item.key] }" aria-hidden="true"></span>
        <span class="module-title">{{ item.title }}</span>
      </div>
      <div v-show="open[item.key] ||!openHand" class="module-body">
        <a-descriptions :bordered="bordered" :column="2">
          <a-descriptions-item :span="1" v-for="(field, chilIndex) in item.fields" :key="chilIndex" :label="field.label">
            <template v-if="editMode && field.editSort">
              <sort :name="field.editSort" />
            </template>
            <template v-else-if="editMode && field.type === 'switch'">
              <a-switch v-model:checked="form[field.key]" />
            </template>
            <template v-else-if="editMode && field.type === 'select'">
              <a-select v-model:value="form.retention" style="width: 100%" placeholder="请选择数据保留周期">
                <a-select-option v-for="option in field.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </a-select-option>
              </a-select>
            </template>
            <template v-else-if="editMode && field.type === 'number'">
              <a-input-number v-model:value="form[field.key]" :min="0" style="width: 100%" placeholder="请输入数据周期" />
            </template>
            <template v-else-if="editMode && field.type === 'input'">
              <a-input v-model:value="form[field.key]" />
            </template>
            <template v-else-if="!editMode && field.sort">
              <sort :name="field.sort" />
            </template>
            <template v-else>
              <span class="desc-text">{{ detail[field.key] ?? "-" }}</span>
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from "vue";
const props = defineProps({
  detail: {
    type: Object,
    default: () => ({}),
  },
  list: {
    type: Array,
    default: () => [],
  },
  openAll: { type: Boolean, default: true },
  bordered: { type: Boolean, default: false },
  editModeShow: { type: Boolean, default: false },
  openHand: { type: Boolean, default: true },
});
const emit = defineEmits(["save", "update:editModeShow"]);

const open = ref<Record<string, boolean>>({});
const editMode = ref(false);
const detail = ref<any>({});
const form = reactive<any>({});
watch(
  () => props.list,
  (val) => {
    if (val) {
      val.forEach((item: any) => {
        open.value[item.key] = props.openAll;
      });
    }
  },
  { immediate: true }
);
watch(
  () => props.detail,
  (val) => {
    if (val) {
      Object.keys(form).forEach((k) => delete form[k]);
      Object.assign(form, val);
    }
  },
  { immediate: true }
);
watch(
  () => props.editModeShow,
  (val) => {
    editMode.value = val;
  },
  { immediate: true }
);

const toggle = (key: string) => {
  open.value[key] = !open.value[key];
};

const toggleEdit = () => {
  editMode.value = true;
  emit("update:editModeShow", true);
};

const cancelEdit = () => {
  editMode.value = false;
  emit("update:editModeShow", false);
  if (detail.value) {
    Object.keys(form).forEach((k) => delete form[k]);
    Object.assign(form, detail.value);
  }
};

const onSave = async () => {
  emit("save", form);
};
</script>
<style scoped lang="scss">
.basic-info {
  .module {
    margin-bottom: 12px;

    .module-header {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 0;

      .header-actions {
        margin-left: auto;
      }

      .triangle {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid var(--theme-info);
        display: inline-block;
        transition: transform 0.2s ease;
      }
      .triangle.open {
        transform: rotate(180deg);
      }

      .module-title {
        margin-left: 8px;
        font-weight: 700;
        color: var(--theme-info);
      }
    }

    .module-body {
      padding: 0 0 0 8px;
      :deep(.ant-descriptions) {
        /* 强制两列各占 50% */

        .ant-descriptions-item-label {
          color: #ffffff;
          width: 150px;
          min-width: 150px !important;
          padding: 8px 16px;
        }
        .ant-descriptions-item-content {
          width: 50%;
        }
        .ant-descriptions-item-content,
        .desc-text {
          color: #ffffff;
        }
      }
    }
  }

  .actions {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.global-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: -48px;
  margin-bottom: 16px;
  width: 200px;
  float: right;
}
</style>
