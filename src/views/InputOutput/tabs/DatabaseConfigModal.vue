<template>
  <a-modal
    v-model:open="visibleLocal"
    :confirm-loading="loadingLocal"
    :title="isViewMode ? '查看数据库连接配置' : (form.id ? '编辑数据库连接配置' : '新建数据库连接配置')"
    :width="700"
    :ok-text="isViewMode ? '关闭' : '保存'"
    :cancel-button-props="{ style: { display: isViewMode ? 'none' : 'inline-block' } }"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" :disabled="isViewMode">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="数据库类别" name="databaseCategory" required>
            <a-select
              v-model:value="form.databaseCategory"
              placeholder="请选择数据库类别"
              @change="handleDatabaseCategoryChange"
              :disabled="isViewMode"
            >
              <a-select-option value="MySQL">MySQL</a-select-option>
              <a-select-option value="PostgreSQL">PostgreSQL</a-select-option>
              <a-select-option value="InfluxDB">InfluxDB</a-select-option>
              <a-select-option value="Kingbase">Kingbase</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- MySQL / PostgreSQL / Kingbase 配置 -->
      <template v-if="['MySQL', 'PostgreSQL', 'Kingbase'].includes(form.databaseCategory)">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="主机地址" name="connectionConfig.host" required>
              <a-input
                v-model:value="form.connectionConfig.host"
                placeholder="例如: localhost"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="端口" name="connectionConfig.port" required>
              <a-input-number
                v-model:value="form.connectionConfig.port"
                placeholder="例如: 3306"
                style="width: 100%"
                :min="1"
                :max="65535"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数据库名" name="connectionConfig.database" required>
              <a-input
                v-model:value="form.connectionConfig.database"
                placeholder="请输入数据库名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="用户名" name="connectionConfig.username" required>
              <a-input
                v-model:value="form.connectionConfig.username"
                placeholder="请输入用户名"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="密码" name="connectionConfig.password" required>
              <a-input-password
                v-model:value="form.connectionConfig.password"
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              v-if="form.databaseCategory === 'MySQL'"
              label="字符集"
              name="connectionConfig.charset"
            >
              <a-input
                v-model:value="form.connectionConfig.charset"
                placeholder="例如: utf8mb4"
              />
            </a-form-item>
            <a-form-item
              v-else
              label="Schema"
              name="connectionConfig.schema"
            >
              <a-input
                v-model:value="form.connectionConfig.schema"
                placeholder="例如: public"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <!-- InfluxDB 配置 -->
      <template v-else-if="form.databaseCategory === 'InfluxDB'">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="URL" name="connectionConfig.url" required>
              <a-input
                v-model:value="form.connectionConfig.url"
                placeholder="例如: http://localhost:8086"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Token" name="connectionConfig.token" required>
              <a-input-password
                v-model:value="form.connectionConfig.token"
                placeholder="请输入 Token"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="组织(Org)" name="connectionConfig.org" required>
              <a-input
                v-model:value="form.connectionConfig.org"
                placeholder="请输入组织名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Bucket" name="connectionConfig.bucket" required>
              <a-input
                v-model:value="form.connectionConfig.bucket"
                placeholder="请输入 Bucket 名"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { DatabaseConfig } from "@/types/model";
import { getDatabaseConfig, createDatabaseConfig, updateDatabaseConfig } from "@/api/inputOutput";
import { message, type FormInstance } from "ant-design-vue";

const emit = defineEmits(["saved"]);
const visibleLocal = ref<boolean>(false);
const loadingLocal = ref(false);
const formRef = ref<FormInstance>();
const isViewMode = ref(false);

// 表单数据
const form = reactive<Partial<DatabaseConfig>>({
  id: undefined,
  databaseCategory: "",
  connectionConfig: {},
  modelInputOutputId: undefined,
});

// 表单验证规则
const rules = {
  databaseCategory: [{ required: true, message: "请选择数据库类别", trigger: "change" }],
  "connectionConfig.host": [{ required: true, message: "请输入主机地址", trigger: "blur" }],
  "connectionConfig.port": [{ required: true, message: "请输入端口", trigger: "blur" }],
  "connectionConfig.database": [{ required: true, message: "请输入数据库名", trigger: "blur" }],
  "connectionConfig.username": [{ required: true, message: "请输入用户名", trigger: "blur" }],
  "connectionConfig.password": [{ required: true, message: "请输入密码", trigger: "blur" }],
  "connectionConfig.url": [{ required: true, message: "请输入 URL", trigger: "blur" }],
  "connectionConfig.token": [{ required: true, message: "请输入 Token", trigger: "blur" }],
  "connectionConfig.org": [{ required: true, message: "请输入组织名", trigger: "blur" }],
  "connectionConfig.bucket": [{ required: true, message: "请输入 Bucket 名", trigger: "blur" }],
};

// 重置表单
const resetForm = () => {
  form.id = undefined;
  form.databaseCategory = "";
  form.connectionConfig = {};
  form.modelInputOutputId = undefined;
  formRef.value?.clearValidate();
};

// 数据库类别变化时重置连接配置
const handleDatabaseCategoryChange = () => {
  form.connectionConfig = {};
};

// 打开弹窗（编辑模式）
const openModal = async (modelInputOutputId: number) => {
  isViewMode.value = false;
  visibleLocal.value = true;
  form.modelInputOutputId = modelInputOutputId;

  // 尝试加载已有配置
  try {
    const res: any = await getDatabaseConfig(modelInputOutputId);
    if (res && res.code === 200 && res.data) {
      Object.assign(form, res.data);
    } else {
      resetForm();
      form.modelInputOutputId = modelInputOutputId;
    }
  } catch (err) {
    console.error(err);
    resetForm();
    form.modelInputOutputId = modelInputOutputId;
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
