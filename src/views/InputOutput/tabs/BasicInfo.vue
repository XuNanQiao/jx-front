<template>
  <div class="basic-info">
    <!-- 基础信息 模块 -->
    <div class="module">
        <div class="module-header" @click="toggle('basic')">
          <DownOutlined :class="{ open: open.basic }" />
          <span class="module-title">基础信息</span>
        </div>
      <div v-show="open.basic" class="module-body">
        <a-row :gutter="16">
          <a-col :span="12" v-for="field in basicFields" :key="field.key">
            <div class="field-row">
              <div class="field-label">{{ field.label }}</div>
              <div class="field-value">
                <a-input v-model:value="form[field.key]" />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 数据保留 模块 -->
    <div class="module">
      <div class="module-header" @click="toggle('retention')">
        <DownOutlined :class="{ open: open.retention }" />
        <span class="module-title">数据保留</span>
      </div>
      <div v-show="open.retention" class="module-body">
        <a-row :gutter="16">
          <a-col :span="12" v-for="field in retentionFields" :key="field.key">
            <div class="field-row">
              <div class="field-label">{{ field.label }}</div>
              <div class="field-value">
                <a-input v-model:value="form[field.key]" />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 其他信息 模块 -->
    <div class="module">
      <div class="module-header" @click="toggle('other')">
        <DownOutlined :class="{ open: open.other }" />
        <span class="module-title">其他信息</span>
      </div>
      <div v-show="open.other" class="module-body">
        <a-row :gutter="16">
          <a-col :span="12" v-for="field in otherFields" :key="field.key">
            <div class="field-row">
              <div class="field-label">{{ field.label }}</div>
              <div class="field-value">
                <a-input v-model:value="form[field.key]" />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="actions">
      <a-button type="primary" @click="save">保存</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { updateItem } from '@/api/inputOutput'
import { message } from 'ant-design-vue'

const props = defineProps<{ detailData: any | null }>()
const emit = defineEmits<{
  (e: 'saved', data: any): void
}>()

const open = ref({ basic: true, retention: false, other: false })

const form = reactive<any>({})

watch(
  () => props.detailData,
  (val) => {
    if (val) {
      Object.assign(form, val)
    }
  },
  { immediate: true }
)

const basicFields = [
  { key: 'name', label: '名称' },
  { key: 'displayName', label: '星示名称' },
  { key: 'dataType', label: '数据类型' },
  { key: 'defaultDevice', label: '使用默认设备' },
  { key: 'storageEngine', label: '存储引擎' },
  { key: 'dataCycle', label: '数据周期' },
]

const retentionFields = [
  { key: 'batchRetention', label: '批量数据保留' },
  { key: 'streamRetention', label: '流式数据保留' },
  { key: 'archiveBatchRetention', label: '归档数批保留' },
]

const otherFields = [
  { key: 'created', label: '创建人 / 创建时间' },
  { key: 'scope', label: '可用范围' },
  { key: 'customPK', label: '自定义主键' },
  { key: 'ledger', label: '关联台账' },
  { key: 'mockCycle', label: 'Mock周期' },
  { key: 'category', label: '类别' },
  { key: 'ioType', label: '输入输出类型' },
]

const toggle = (key: 'basic' | 'retention' | 'other') => {
  open.value[key] = !open.value[key]
}

const save = async () => {
  if (!form.id) {
    message.error('缺少 id，无法保存')
    return
  }
  try {
    const res: any = await updateItem(form.id, form)
    const updated = res?.data || form
    message.success('保存成功')
    emit('saved', updated)
  } catch (err) {
    console.error(err)
    message.error('保存失败')
  }
}
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

      .anticon {
        color: var(--theme-info);
        transition: transform 0.2s ease;
      }
      .anticon.open {
        transform: rotate(180deg);
      }

      .module-title {
        margin-left: 8px;
        font-weight: 700;
        color: var(--theme-info);
      }
    }

    .module-body {
      padding: 12px 0 0 8px;

      .field-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        color: #ffffff;

        .field-label {
          color: rgba(255,255,255,0.85);
        }
        .field-value {
          color: #ffffff;
          font-weight: 600;
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
</style>
