<template>
  <div class="basic-info page">
    <!-- 基础信息 模块 -->
    <div class="module">
      <div class="module-header">
        <span class="module-title">算子库</span>
      </div>
      <div class="module-body">
        <a-descriptions bordered :column="2">
          <template v-for="(item, index) in operatorPackages" :key="index">
            <a-descriptions-item :span="1" label="依赖包">
              <span class="desc-text">{{ item.name }}</span>
            </a-descriptions-item>
            <a-descriptions-item :span="1" label="版本号">
              <span class="desc-text">{{ item.version }}</span>
            </a-descriptions-item>
          </template>
        </a-descriptions>
      </div>
    </div>
    <div class="module">
      <div class="module-header flex-between">
        <span class="module-title">第三方</span>
        <a-button size="small" type="primary" @click="openDatabaseConfigModal()">
          <template #icon>
            <PlusOutlined />
          </template>
          添加依赖
        </a-button>
      </div>
      <div class="module-body">
        <a-descriptions bordered :column="2" v-for="(item, index) in thirdPartyPackages" :key="index">
          <a-descriptions-item :span="1" label="依赖包">
            <span class="desc-text">{{ item.name }}</span>
          </a-descriptions-item>
          <a-descriptions-item :span="1" label="版本号">
            <span class="desc-text">{{ item.version }}</span>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </div>
  </div>

  <!-- 数据库连接配置弹窗 -->
  <a-alert message="如果模型依赖K2ASsets未预装的第三方python包，请在“依赖包”部分填写包名和版本，并通知营理员在后台安装此依赖包。" type="info" show-icon />

  <DatabaseConfigModal ref="databaseConfigModalRef" :detail="detail" :model-input-output-id="detail.id" @saved="handleDatabaseConfigSaved" />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getModelDevDetail } from '@/api/development';
import { message } from 'ant-design-vue';
import DatabaseConfigModal from './DatabaseConfigModal.vue';
import { PlusOutlined } from '@ant-design/icons-vue';

const props = defineProps<{ id: any | null }>();
const loading = ref(false);
const detail = ref<any>({});

const ensureAtLeastOne = (list: any[]) => (list && list.length ? list : [{ name: '', version: '' }]);

const operatorPackages = computed(() => ensureAtLeastOne((detail.value?.dependency_package || []).filter((item: any) => !String(item?.name || '').endsWith('.txt'))));

const thirdPartyPackages = computed(() => ensureAtLeastOne((detail.value?.dependency_package || []).filter((item: any) => String(item?.name || '').endsWith('.txt'))));

// 数据库配置弹窗引用
const databaseConfigModalRef = ref<any>(null);

// 打开数据库配置弹窗（编辑模式）
const openDatabaseConfigModal = () => {
  if (!detail.value.id) {
    message.warning('请先保存基础信息');
    return;
  }
  databaseConfigModalRef.value?.openModal(detail.value);
};

// 数据库配置保存成功回调
const handleDatabaseConfigSaved = () => {
  loadDetail();
  message.success('数据库配置已保存');
};

// 加载详情数据
const loadDetail = async () => {
  if (!props.id) {
    message.error('缺少ID参数');
    return;
  }

  loading.value = true;
  try {
    const res: any = await getModelDevDetail(props.id);
    if (res?.code === 200 && res?.data) {
      detail.value = res.data;
    }
  } catch (err: any) {
    console.error('❌ 详情数据加载错误:', err);
  } finally {
    loading.value = false;
  }
};

// 监听 id 变化
watch(
  () => props.id,
  (val) => {
    if (val) {
      loadDetail();
    }
  },
  { immediate: true },
);
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
