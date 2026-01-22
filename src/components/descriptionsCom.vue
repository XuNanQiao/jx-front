<!--
 * @Author: ZHAO
 * @Date: 2026-01-20 16:24:36
 * @LastEditTime: 2026-01-22 09:23:54
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\components\descriptionsCom.vue
 * 
-->
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
    <a-form ref="formRef" :model="form">
      <div class="module" v-for="(item, index) in list" :key="index">
        <div class="module-header" @click="toggle(item.key)">
          <span class="triangle" v-if="openHand" :class="{ open: open[item.key] }" aria-hidden="true"></span>
          <span class="module-title">{{ item.title }}</span>
        </div>
        <div v-show="open[item.key] || !openHand" class="module-body">
          <a-row :gutter="16">
            <template v-for="(field, chilIndex) in item.fields" :key="chilIndex">
              <a-col :span="field.span || 12" v-if="shouldShowField(field)">
                <div class="h-38px mb-16px !pl-16px">
                  <a-row :gutter="16">
                    <a-col v-if="field.label" :span="field.labelSpan || 5" class="leading-32px">
                      {{ field.label }}：
                    </a-col>
                    <a-col :span="24 - (field.labelSpan || 5)">
                      <template v-if="editMode && field.editSlot">
                        <slot :name="field.editSlot" :form="form" :field="field" />
                      </template>
                      <template v-else-if="editMode && field.type === 'switch'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-switch
                            :checked="getNestedValue(form, field.key)"
                            @update:checked="(val: any) => setNestedValue(form, field.key, val)" />
                        </a-form-item>
                      </template>
                      <template v-else-if="editMode && field.type === 'checkbox'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-checkbox-group
                            :value="getNestedValue(form, field.key)"
                            @update:value="(val: any) => setNestedValue(form, field.key, val)"
                            :options="field.options" />
                        </a-form-item>
                      </template>
                      <template v-else-if="editMode && field.type === 'radio'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-radio-group
                            :value="getNestedValue(form, field.key)"
                            @update:value="(val: any) => setNestedValue(form, field.key, val)"
                            :options="field.options" />
                        </a-form-item>
                      </template>
                      <template v-else-if="editMode && field.type === 'select'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-select
                            :value="getNestedValue(form, field.key)"
                            @update:value="(val: any) => setNestedValue(form, field.key, val)"
                            :mode="field.mode"
                            style="width: 100%"
                            placeholder="请选择">
                            <a-select-option v-for="option in field.options" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </template>
                      <template v-else-if="editMode && field.type === 'number'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-input-number
                            :value="getNestedValue(form, field.key)"
                            @update:value="(val: any) => setNestedValue(form, field.key, val)"
                            :min="field.min"
                            :max="field.max"
                            :addon-after="field.unit"
                            style="width: 100%"
                            placeholder="请输入" />
                        </a-form-item>
                      </template>
                      <template v-else-if="editMode && field.type === 'input'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-input
                            :value="getNestedValue(form, field.key)"
                            @update:value="(val: any) => setNestedValue(form, field.key, val)" />
                        </a-form-item>
                      </template>
                      <!-- 非编辑态优先使用自定义渲染 -->
                      <template v-else-if="!editMode && field.customRender">
                        <VNodeRenderer
                          class="leading-32px"
                          :vnode="field.customRender({ text: getNestedValue(detail, field.key), record: detail })" />
                      </template>
                      <template v-else-if="!editMode && field.slot">
                        <slot :name="field.slot" />
                      </template>
                      <template v-else-if="!editMode && field.textType === 'switch'">
                        <a-form-item :name="field.key" :rules="field.rules" class="form-item-inline">
                          <a-switch disabled :checked="getNestedValue(detail, field.key)" />
                        </a-form-item>
                      </template>
                      <template v-else>
                        <span class="leading-32px desc-text">{{ formatValue(getNestedValue(detail, field.key)) }}</span>
                      </template>
                    </a-col>
                    <a-col :span="field.labelSpan || 5" class="leading-32px">{{ field.afterlabel }}</a-col>
                  </a-row>
                </div>
              </a-col>
            </template>
          </a-row>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, defineComponent, h } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { getNestedValue, setNestedValue } from "@/utils/useFunction";

// 用于直接挂载 VNode 或字符串到模板
const VNodeRenderer = defineComponent({
  name: "VNodeRenderer",
  props: {
    vnode: { type: [Object, String, Number], required: true },
  },
  setup(props) {
    return () => (typeof props.vnode === "object" ? (props.vnode as any) : h("span", {}, String(props.vnode)));
  },
});

const props = withDefaults(
  defineProps<{
    detail: Record<string, any>;
    list: ModuleItem[];
    openAll?: boolean;
    bordered?: boolean;
    editModeShow?: boolean;
    openHand?: boolean;
  }>(),
  {
    detail: () => ({}) as Record<string, any>,
    list: () => [] as ModuleItem[],
    openAll: true,
    bordered: false,
    editModeShow: false,
    openHand: true,
  },
);
const emit = defineEmits(["save", "update:editModeShow"]);

const formRef = ref<FormInstance>();
const open = ref<Record<string, boolean>>({});
const editMode = ref(false);
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
  { immediate: true },
);
watch(
  () => props.detail,
  (val) => {
    if (val) {
      Object.keys(form).forEach((k) => delete form[k]);
      Object.assign(form, val);
    }
  },
  { immediate: true },
);
watch(
  () => props.editModeShow,
  (val) => {
    editMode.value = val;
  },
  { immediate: true },
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
  // 重置表单验证状态
  formRef.value?.clearValidate();
  if (props.detail) {
    Object.keys(form).forEach((k) => delete form[k]);
    Object.assign(form, props.detail);
  }
};

const onSave = async () => {
  try {
    console.log(form, "-----1212");

    // 执行表单验证
    await formRef.value?.validate();
    // 验证通过，触发保存事件
    emit("save", form);
  } catch (error) {
    // 验证失败
    message.error("请检查表单填写是否正确");
    console.error("表单验证失败:", error);
  }
};

// 统一处理显示逻辑：支持对象或数组条件
const shouldShowField = (field: any) => {
  const s = field?.show;
  if (!s) return true;
  if (Array.isArray(s)) {
    return s.every((cond: any) => getNestedValue(form, cond.label) == cond.value);
  }
  return getNestedValue(form, s.label) == s.value;
};

const formatValue = (value: any) => {
  if (value === undefined || value === null || value === "") return "-";
  if (Array.isArray(value)) return value.length ? JSON.stringify(value) : "-";
  if (typeof value === "object") return Object.keys(value).length ? JSON.stringify(value) : "-";
  return value;
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
          width: max-content;
          min-width: 100px !important;
          padding: 8px 16px;
        }
        .ant-descriptions-item-content {
          width: 50%;
          padding: 8px 16px;
        }
        .ant-descriptions-item-content,
        .desc-text {
          color: #ffffff;
        }
      }
      /* 表单项内联样式，去除默认间距 */
      :deep(.form-item-inline) {
        margin-bottom: 0;
        .ant-form-item-explain-error {
          margin-top: 4px;
          font-size: 12px;
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
