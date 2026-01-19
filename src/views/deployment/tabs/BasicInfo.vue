<!--
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:50
 * @LastEditTime: 2026-01-19 16:03:49
 * @LastEditors: ZHAO
 * @Description: 
 * @FilePath: \jx\src\views\deployment\tabs\BasicInfo.vue
 * 
-->
<template>
  <div class="basic-info page">
    <DescriptionsCom v-model:edit-mode-show="editMode" :detail="detail" :list="basicFields" @save="onSave">
      <template #cycleEditor="{ form, field }">
        <a-input-group compact>
          <a-input v-model:value="form[field.key]" style="width: calc(100% - 200px)" />
          <a-button type="primary">
            <template #icon>
              <ImportOutlined />
            </template>
            配置
          </a-button>
        </a-input-group>
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
import { basicFields } from '../indexData';
const props = defineProps<{ id: any | null }>();
const loading = ref(false);
const editMode = ref(false);
const detail = ref<any>({});

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
<style scoped lang="scss"></style>
