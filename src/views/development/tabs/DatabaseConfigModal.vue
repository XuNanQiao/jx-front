<template>
  <a-modal
    v-model:open="visibleLocal"
    :confirm-loading="loadingLocal"
    title="依赖包"
    :width="700"
    :ok-text="isViewMode ? '关闭' : '保存'"
    :cancel-button-props="{ style: { display: isViewMode ? 'none' : 'inline-block' } }"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" :disabled="isViewMode">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="依赖包" name="database_connection_config.bucket">
            <a-input v-model:value="form.database_connection_config.bucket" placeholder="请输入桶名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="版本号" name="database_connection_config.table_name">
            <a-input v-model:value="form.database_connection_config.table_name" placeholder="请输入表名" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { updateItem } from '@/api/development';
import { message, type FormInstance } from 'ant-design-vue';
import { computed, ref } from 'vue';

// 数据库配置表单类型（使用下划线命名匹配后端）
interface DatabaseConfigForm {
  id?: string;
  database_category: string;
  database_connection_config: Record<string, any>;
  model_input_output_id?: number;
}

const emit = defineEmits(['saved']);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const isViewMode = ref(false);
const isAddMode = ref(false);
const detailVal = ref({});

// 表单数据
const form = ref<DatabaseConfigForm>({
  id: undefined,
  database_category: '',
  database_connection_config: {
    ip_address: undefined,
    port: undefined,
  },
  model_input_output_id: undefined,
});

// IP地址验证规则
const validateIP = (_rule: any, value: string) => {
  // 从 form.value.database_connection_config 直接获取值，因为嵌套属性的 value 参数可能为 undefined
  const ipValue = value || form.value.database_connection_config?.ip_address;

  if (!ipValue) {
    return Promise.reject('请输入IP地址');
  }
  const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipPattern.test(ipValue)) {
    return Promise.reject('请输入有效的IP地址');
  }
  const parts = ipValue.split('.');
  if (parts.some((part: string) => parseInt(part) > 255)) {
    return Promise.reject('IP地址每段应在0-255之间');
  }
  return Promise.resolve();
};

// 端口号验证规则
const validatePort = (_rule: any, value: number) => {
  // 从 form.value.database_connection_config 直接获取值，因为嵌套属性的 value 参数可能为 undefined
  const portValue = value || form.value.database_connection_config?.port;

  if (!portValue) {
    return Promise.reject('请输入端口号');
  }
  if (portValue < 1 || portValue > 65535) {
    return Promise.reject('端口号应在1-65535之间');
  }
  return Promise.resolve();
};

// 通用必填字段验证规则
const validateRequired = (fieldName: string, message: string) => {
  return (_rule: any, value: any) => {
    // 从 form.value.database_connection_config 直接获取值，因为嵌套属性的 value 参数可能为 undefined
    const fieldValue = value || form.value.database_connection_config?.[fieldName];

    if (!fieldValue || (typeof fieldValue === 'string' && !fieldValue.trim())) {
      return Promise.reject(message);
    }
    return Promise.resolve();
  };
};

// 动态表单验证规则
const rules = computed(() => {
  const baseRules: Record<string, any> = {
    database_category: [{ required: true, message: '请选择数据库类别', trigger: 'change' }],
  };

  if (!form.value.database_category) {
    return baseRules;
  }

  // 通用规则（IP和端口）
  baseRules['database_connection_config.ip_address'] = [{ validator: validateIP, trigger: 'blur' }];
  baseRules['database_connection_config.port'] = [{ validator: validatePort, trigger: 'blur' }];

  // PostgreSQL 特有规则
  if (form.value.database_category === 'Postgresql' || form.value.database_category === 'MySQL') {
    baseRules['database_connection_config.database_name'] = [{ validator: validateRequired('database_name', '请输入数据库名'), trigger: 'blur' }];
    baseRules['database_connection_config.username'] = [{ validator: validateRequired('username', '请输入账号'), trigger: 'blur' }];
    baseRules['database_connection_config.password'] = [{ validator: validateRequired('password', '请输入密码'), trigger: 'blur' }];
    baseRules['database_connection_config.table_name'] = [{ validator: validateRequired('table_name', '请输入表名'), trigger: 'blur' }];
  }

  // InfluxDB 特有规则
  if (form.value.database_category === 'InfluxDB') {
    baseRules['database_connection_config.organization'] = [{ validator: validateRequired('organization', '请输入组织名'), trigger: 'blur' }];
    baseRules['database_connection_config.token'] = [{ validator: validateRequired('token', '请输入Token'), trigger: 'blur' }];
    baseRules['database_connection_config.bucket'] = [{ validator: validateRequired('bucket', '请输入桶名'), trigger: 'blur' }];
    baseRules['database_connection_config.table_name'] = [{ validator: validateRequired('table_name', '请输入表名'), trigger: 'blur' }];
  }

  return baseRules;
});

// 重置表单
const resetForm = () => {
  form.value.id = undefined;
  form.value.database_category = '';
  form.value.database_connection_config = {
    ip_address: undefined,
    port: undefined,
  };
  form.value.model_input_output_id = undefined;
  formRef.value?.clearValidate();
};

// 数据库类别变化时重置连接配置
const handleDatabaseCategoryChange = () => {
  form.value.database_connection_config = {
    ip_address: undefined,
    port: undefined,
  };
  // 清除之前的验证错误
  formRef.value?.clearValidate();
};

// 打开弹窗（编辑模式）
const openModal = async (detail: any, isAddModeVal: boolean) => {
  isViewMode.value = false;
  visibleLocal.value = true;
  isAddMode.value = isAddModeVal;
  detailVal.value = JSON.parse(JSON.stringify(detail));
  // 先清空表单和验证
  resetForm();

  // 再加载数据
  try {
    // 深度合并 config，保留初始化的响应式属性
    const configData = detail.database_connection_config || {};
    form.value.id = detail.id;
    form.value.database_category = detail.database_category || '';
    form.value.model_input_output_id = detail.model_input_output_id;
    form.value.database_connection_config = {
      ip_address: configData.ip_address,
      port: configData.port,
      ...configData,
    };
  } catch (err) {
    console.error(err);
  }
};

// 查看弹窗（只读模式）
const viewModal = async (detail: any) => {
  isViewMode.value = true;
  visibleLocal.value = true;
  try {
    // 深度合并 config，保留初始化的响应式属性
    const configData = detail.database_connection_config || {};
    form.value.id = detail.id;
    form.value.database_category = detail.database_category || '';
    form.value.model_input_output_id = detail.model_input_output_id;
    form.value.database_connection_config = {
      ip_address: configData.ip_address,
      port: configData.port,
      ...configData,
    };
  } catch (err) {
    console.error(err);
    message.error('加载配置失败');
    visibleLocal.value = false;
  }
};

// 确定提交
const onOk = async () => {
  if (isViewMode.value) {
    visibleLocal.value = false;
    return;
  }
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  loadingLocal.value = true;
  try {
    let data = JSON.parse(JSON.stringify(detailVal.value));
    data.database_connection_config = form.value.database_connection_config;
    data.database_category = form.value.database_category;
    if (!isAddMode.value) {
      const res: any = await updateItem(data);
      if (res && res.code === 200) {
        emit('saved', data);
        visibleLocal.value = false;
        resetForm();
      }
    } else {
      emit('saved', data);
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
  viewModal,
});
</script>
