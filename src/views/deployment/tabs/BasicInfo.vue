<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-19 16:35:03
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
            <a-button type="primary" @click="handleConfigCycle">
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
  </div>
</template>

<script setup lang="ts">
import { getModelDevDetail, updateModelDev } from '@/api/development';
import DescriptionsCom from '@/components/descriptionsCom.vue';
import { ImportOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref, watch } from 'vue';
import { basicFields, basicInp } from '../indexData';
const props = defineProps<{ id: any | null }>();
const loading = ref(false);
const editMode = ref(false);
const detail = ref<any>({});
const basicList = ref<any[]>([]);
const onSave = async (form: any) => {
  await save(form);
  editMode.value = false;
};
const save = async (form: any) => {
  if (!form.id) {
    message.error('缺少 id，无法保存');
    return;
  }
  try {
    let data = JSON.parse(JSON.stringify(form));
    delete data.dependency_package;
    await updateModelDev(data);
    message.success('保存成功');
    await loadDetail(); // 保存后重新加载数据
  } catch (err) {
    message.error('保存失败');
  }
};

// 配置执行周期
const handleConfigCycle = () => {
  // TODO: 打开执行周期配置弹窗
  message.info('执行周期配置功能开发中');
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
    let list = basicFields();

    // 创建新列表项
    const newList = [
      {
        title: '输入配置',
        key: 'inputConfig',
        fields: basicInp,
      },
    ];

    // 在第一项后插入新列表
    if (list.length > 0) {
      list.splice(1, 0, ...newList);
    }

    basicList.value = list;
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
<style scoped lang="scss"></style>
