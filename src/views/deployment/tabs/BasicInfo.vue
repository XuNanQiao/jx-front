<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-20 17:45:49
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\deployment\tabs\BasicInfo.vue
 * 
-->
<template>
  <div class="page">
    <DescriptionsCom v-model:edit-mode-show="editMode" :detail="detail" :list="basicList" @save="onSave">
      <template #cycleEditor="slotProps: any">
        <a-form-item :name="slotProps.field.key" :rules="slotProps.field.rules" class="form-item-inline">
          <a-input-group compact class="cycle-input-group">
            <a-input
              v-model:value="slotProps.form[slotProps.field.key]"
              placeholder="请输入执行周期"
              style="width: calc(100% - 120px)" />
            <a-button type="primary" @click="handleConfigCycle(slotProps.form, slotProps.field.key)">
              <template #icon>
                <ImportOutlined />
              </template>
              配置
            </a-button>
          </a-input-group>
        </a-form-item>
      </template>
      <template #jobRetentionEditor="slotProps: any">
        <a-form-item :name="slotProps.field.key" :rules="slotProps.field.rules" class="form-item-inline">
          <a-input-group compact class="cycle-input-group">
            <a-select
              v-model:value="slotProps.form[slotProps.field.key]"
              :options="slotProps.field.options"
              style="width: 150px" />
            <a-input-number
              style="width: 200px"
              v-model:value="slotProps.form[slotProps.field.key]"
              :min="0"
              placeholder="请输入数据周期" />
          </a-input-group>
        </a-form-item>
      </template>
    </DescriptionsCom>

    <!-- Crontab 配置弹窗 -->
    <a-modal
      v-model:open="cronModalVisible"
      title="配置执行周期"
      :width="600"
      @ok="handleCronConfirm"
      @cancel="handleCronCancel">
      <a-form :model="cronForm" layout="vertical">
        <a-form-item label="Crontab 表达式">
          <a-input
            v-model:value="cronForm.expression"
            placeholder="请输入 Crontab 表达式，例如：0 0 * * *"
            :maxlength="100" />
          <!--    <div class="cron-tips">
            <p>格式说明：分 时 日 月 周</p>
            <p>示例：</p>
            <ul>
              <li>0 0 * * * - 每天凌晨执行</li>
              <li>0 */2 * * * - 每2小时执行一次</li>
              <li>0 0 * * 1 - 每周一凌晨执行</li>
            </ul>
          </div> -->
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { getModelDeployDetail, updateModelDeploy } from "@/api/deployment";
import DescriptionsCom from "@/components/descriptionsCom.vue";
import { ImportOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { ref, watch } from "vue";
import { basicFields, basicInp } from "../indexData";
import { getDataStructureList } from "@/api/inputOutput";
const props = defineProps<{ id: any | null }>();
const loading = ref(false);
const editMode = ref(false);
const detail = ref<any>({});
const basicList = ref<any[]>([]);

// Crontab 配置弹窗相关
const cronModalVisible = ref(false);
const cronForm = ref({
  expression: "",
});
let currentForm: any = null;
let currentFieldKey: string = "";

// 配置执行周期
const handleConfigCycle = (form: any, fieldKey: string) => {
  currentForm = form;
  currentFieldKey = fieldKey;
  cronForm.value.expression = form[fieldKey] || "";
  cronModalVisible.value = true;
};

// 确认配置
const handleCronConfirm = () => {
  if (!cronForm.value.expression.trim()) {
    message.warning("请输入 Crontab 表达式");
    return;
  }

  if (currentForm && currentFieldKey) {
    currentForm[currentFieldKey] = cronForm.value.expression.trim();
  }

  cronModalVisible.value = false;
  message.success("配置成功");
};

// 取消配置
const handleCronCancel = () => {
  cronModalVisible.value = false;
};

const onSave = async (form: any) => {
  await save(form);
  editMode.value = false;
};

const save = async (form: any) => {
  if (!form.id) {
    message.error("缺少 id，无法保存");
    return;
  }
  try {
    let data = JSON.parse(JSON.stringify(form));
    delete data.dependency_package;
    await updateModelDeploy(data);
    message.success("保存成功");
    await loadDetail(); // 保存后重新加载数据
  } catch (err) {
    message.error("保存失败");
  }
};

// 加载详情数据
const loadDetail = async () => {
  if (!props.id) {
    message.error("缺少ID参数");
    return;
  }

  loading.value = true;
  try {
    const res: any = await getModelDeployDetail(props.id);
    if (res?.code === 200 && res?.data) {
      detail.value = res.data;
    }
    let list = basicFields();
    const newList: any = [];
    if (res?.data?.input_config?.length) {
      for (let item of res.data.input_config) {
        try {
          await getDataStructureList({ model_input_output_id: item.input_repo_id }).then((res: any) => {
            if (res?.code === 200) {
              const options = res.data.items.map((ds: any) => ({
                label: ds.name,
                value: ds.column,
              }));
              let fields: any = basicInp();
              fields[1].options = options;
              newList.push({
                title: "输入配置",
                key: "inputConfig" + item.input_repo_id,
                fields: fields,
              });
            }
          });
        } catch (error) {
          let fields: any = basicInp();
          fields[1].options = [];
          newList.push({
            title: "输入配置",
            key: "inputConfig" + item.input_repo_id,
            fields: fields,
          });
        }
      }
    }
    if (res?.data?.output_config?.length) {
      for (let item of res.data.output_config) {
        try {
          await getDataStructureList({ model_input_output_id: item.output_repo_id }).then((res: any) => {
            if (res?.code === 200) {
              const options = res.data.items.map((ds: any) => ({
                label: ds.name,
                value: ds.column,
              }));
              let fields: any = basicInp();
              fields[1].options = options;
              newList.push({
                title: "输出配置",
                key: "outputConfig" + item.output_repo_id,
                fields: fields,
              });
            }
          });
        } catch (error) {
          let fields: any = basicInp();
          fields[1].options = [];
          newList.push({
            title: "输出配置",
            key: "outputConfig" + item.output_repo_id,
            fields: fields,
          });
        }
      }
    }

    // 创建新列表项

    // 在第一项后插入新列表
    if (list.length > 0) {
      list.splice(1, 0, ...newList);
    }

    basicList.value = list;
  } catch (err: any) {
    console.error("❌ 详情数据加载错误:", err);
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
.cron-tips {
  margin-top: 8px;
  padding: 12px;
  background-color: #f6f8fa;
  border-radius: 4px;
  font-size: 12px;
  color: #666;

  p {
    margin: 0 0 8px 0;
    font-weight: 500;
  }

  ul {
    margin: 0;
    padding-left: 20px;

    li {
      margin: 4px 0;
      color: #999;
    }
  }
}
</style>
