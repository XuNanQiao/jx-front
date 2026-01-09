<template>
  <a-modal v-model:open="visibleLocal" :confirm-loading="loadingLocal" :title="isViewMode ? '查看数据库连接配置' : form.id ? '编辑数据库连接配置' : '新建数据库连接配置'" :width="700" :ok-text="isViewMode ? '关闭' : '保存'" :cancel-button-props="{ style: { display: isViewMode ? 'none' : 'inline-block' } }" cancel-text="取消" @ok="onOk" @cancel="onCancel">
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" :disabled="isViewMode">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="数据库类别" name="database_category" required>
            <a-select v-model:value="form.database_category" placeholder="请选择数据库类别" @change="handleDatabaseCategoryChange" :disabled="isViewMode">
              <a-select-option value="PostgreSQL">PostgreSQL</a-select-option>
              <a-select-option value="InfluxDB">InfluxDB</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <template v-if="form.database_category">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="ip地址" name="database_connection_config.ip_address" required>
              <a-input v-model:value="form.database_connection_config.ip_address" placeholder="例如: 192.168.1.11" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="端口号" name="database_connection_config.port" required>
              <a-input-number v-model:value="form.database_connection_config.port" placeholder="例如: 3306" style="width: 100%" :min="1" :max="65535" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
      <!-- MySQL / PostgreSQL / Kingbase 配置 -->
      <template v-if="form.database_category == 'PostgreSQL'">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="密码" name="database_connection_config.password" required>
              <a-input-password v-model:value="form.database_connection_config.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="账号" name="database_connection_config.username" required>
              <a-input v-model:value="form.database_connection_config.username" placeholder="请输入账号" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数据库名" name="database_connection_config.database_name" required>
              <a-input v-model:value="form.database_connection_config.database_name" placeholder="请输入数据库名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="表名" name="database_connection_config.table_name" required>
              <a-input v-model:value="form.database_connection_config.table_name" placeholder="请输入表名" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- InfluxDB 配置 -->
      <template v-else-if="form.database_category === 'InfluxDB'">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="组织" name="database_connection_config.organization" required>
              <a-input v-model:value="form.database_connection_config.organization" placeholder="请输入组织名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="令牌(Token)" name="database_connection_config.token" required>
              <a-input-password v-model:value="form.database_connection_config.token" placeholder="请输入 Token" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="桶名" name="database_connection_config.bucket" required>
              <a-input v-model:value="form.database_connection_config.bucket" placeholder="请输入桶名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="表名" name="database_connection_config.table_name" required>
              <a-input v-model:value="form.database_connection_config.table_name" placeholder="请输入表名" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { getDatabaseConfig, createDatabaseConfig, updateDatabaseConfig } from "@/api/inputOutput";
import { message, type FormInstance } from "ant-design-vue";

// 数据库配置表单类型（使用下划线命名匹配后端）
interface DatabaseConfigForm {
  id?: string;
  database_category: string;
  database_connection_config: Record<string, any>;
  model_input_output_id?: number;
}

const emit = defineEmits(["saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const isViewMode = ref(false);

// 表单数据
const form = reactive<DatabaseConfigForm>({
  id: undefined,
  database_category: "",
  database_connection_config: {},
  model_input_output_id: undefined,
});

// 表单验证规则
const rules = {
  database_category: [{ required: true, message: "请选择数据库类别", trigger: "change" }],
  "database_connection_config.ip_address": [{ required: true, message: "请输入IP地址", trigger: "blur" }],
  "database_connection_config.port": [{ required: true, message: "请输入端口号", trigger: "blur" }],
  "database_connection_config.database_name": [{ required: true, message: "请输入数据库名", trigger: "blur" }],
  "database_connection_config.username": [{ required: true, message: "请输入账号", trigger: "blur" }],
  "database_connection_config.password": [{ required: true, message: "请输入密码", trigger: "blur" }],
  "database_connection_config.url": [{ required: true, message: "请输入 URL", trigger: "blur" }],
  "database_connection_config.token": [{ required: true, message: "请输入 Token", trigger: "blur" }],
  "database_connection_config.organization": [{ required: true, message: "请输入组织名", trigger: "blur" }],
  "database_connection_config.bucket": [{ required: true, message: "请输入桶名", trigger: "blur" }],
};

// 重置表单
const resetForm = () => {
  form.id = undefined;
  form.database_category = "";
  form.database_connection_config = {};
  form.model_input_output_id = undefined;
  formRef.value?.clearValidate();
};

// 数据库类别变化时重置连接配置
const handleDatabaseCategoryChange = () => {
  form.database_connection_config = {};
};

// 打开弹窗（编辑模式）
const openModal = async (modelInputOutputId: number) => {
  isViewMode.value = false;
  visibleLocal.value = true;
  form.model_input_output_id = modelInputOutputId;

  // 尝试加载已有配置
  try {
    const res: any = await getDatabaseConfig(modelInputOutputId);
    if (res && res.code === 200 && res.data) {
      Object.assign(form, res.data);
    } else {
      resetForm();
      form.model_input_output_id = modelInputOutputId;
    }
  } catch (err) {
    console.error(err);
    resetForm();
    form.model_input_output_id = modelInputOutputId;
  }
};

// 查看弹窗（只读模式）
const viewModal = async (modelInputOutputId: number) => {
  isViewMode.value = true;
  visibleLocal.value = true;

  try {
    const res: any = await getDatabaseConfig(modelInputOutputId);
    if (res && res.code === 200 && res.data) {
      Object.assign(form, res.data);
    } else {
      message.warning("暂无数据库配置");
      visibleLocal.value = false;
    }
  } catch (err) {
    console.error(err);
    message.error("加载配置失败");
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
    if (form.id) {
      const res: any = await updateDatabaseConfig(String(form.id), form);
      if (res && res.code === 200) {
        message.success("更新成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "更新失败");
      }
    } else {
      const res: any = await createDatabaseConfig(form);
      if (res && res.code === 200) {
        message.success("创建成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "创建失败");
      }
    }
  } catch (err: any) {
    console.error(err);
    message.error(err?.message || "保存失败");
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
