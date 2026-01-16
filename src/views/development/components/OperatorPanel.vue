<template>
  <ToggleBox position="right" :openVal="open" v-if="selected.type">
    <template #content>
      <a-tabs v-model:activeKey="activeTab" type="card">
        <a-tab-pane key="info" tab="算子信息">
          <div class="OperatorPanel">
            <div class="title">基础信息</div>
            <a-form layout="vertical">
              <a-form-item label="节点显示名称">
                <a-input v-model:value="selected.form.name" />
              </a-form-item>
              <a-form-item label="节点名称">
                <a-input v-model:value="selected.form.display_name" />
              </a-form-item>
              <a-form-item label="算子名称">
                <a-input :disabled="true" v-model:value="selected.form.operatorName" />
              </a-form-item>

              <template v-if="selected.type === 'input' || selected.type === 'output'">
                <a-form-item label="Repo">
                  <a-select
                    v-model:value="selected.form.repo"
                    :options="repoOptions"
                    placeholder="请选择 Repo"></a-select>
                </a-form-item>
              </template>

              <template v-if="selected.type === 'input'">
                <a-form-item label="列">
                  <a-select
                    v-model:value="selected.form.columns"
                    :options="columnOptions"
                    mode="multiple"
                    placeholder="请选择列"></a-select>
                </a-form-item>
              </template>

              <template v-if="selected.type === 'operator' || selected.type == 'otherAdd'">
                <a-form-item label="语言类型">
                  <a-input :disabled="true" v-model:value="selected.form.language" />
                </a-form-item>
                <a-form-item label="算子描述">
                  <a-input v-model:value="selected.form.description" />
                </a-form-item>
                <a-form-item label="脚本文件">
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px">
                    <ImportDownloadActions
                      import-label="上传文件"
                      :show-download="false"
                      :auto-upload="false"
                      :multiple="true"
                      @import-success="handleScriptImport" />
                    <a-button type="default" @click="createFile">创建文件</a-button>
                  </div>
                  <div v-if="selected.form.files?.length">
                    <a-list :dataSource="selected.form.files" bordered>
                      <template #renderItem="{ item, index }">
                        <a-list-item>
                          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
                            <div>
                              <a-tag v-if="item.main" color="processing">主</a-tag>
                              <span style="margin-left: 8px">{{ item.name }}</span>
                            </div>
                            <div style="display: flex; gap: 8px">
                              <a-button size="small" @click="setMainScript(index)">设为主脚本</a-button>
                              <a-button size="small" @click="editScript(index)" v-if="item.name.endsWith('.py')">
                                编辑
                              </a-button>
                              <a-button size="small" danger @click="removeScript(index)">删除</a-button>
                            </div>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </div>
                </a-form-item>
              </template>
            </a-form>
          </div>
        </a-tab-pane>

        <a-tab-pane key="params" tab="参数配置" v-if="selected.type !== 'output' && selected.type !== 'otherAdd'">
          <div class="OperatorPanel">
            <div class="title">聚合参数</div>

            <a-form layout="vertical">
              <a-form-item label="聚合函数">
                <a-select
                  v-model:value="selected.params.aggregate"
                  :options="aggregateOptions"
                  placeholder="请选择"></a-select>
              </a-form-item>
              <a-form-item label="数据聚合粒度">
                <a-input-number v-model:value="selected.params.granularity.value">
                  <template #addonAfter>
                    <a-select
                      class="!w-80px"
                      v-model:value="selected.params.granularity.unit"
                      :options="granularityOptions"></a-select>
                  </template>
                </a-input-number>
              </a-form-item>
              <a-form-item label="填充空值">
                <a-switch v-model:checked="selected.params.fillNa" />
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </template>
  </ToggleBox>

  <a-modal v-model:open="showCreateFile" title="创建/编辑脚本" @ok="onCreateFileOk" @cancel="onCreateFileCancel">
    <a-textarea v-model:value="editFile.content" placeholder="Basic usage" :rows="16" />
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import ToggleBox from './toggleBox.vue';
import { aggregateOptions, granularityOptions } from '../indexData';
import { getDataStructureList } from '@/api/inputOutput';
import ImportDownloadActions from '@/components/common/ImportDownloadActions.vue';
import { createCustomOperator } from '@/api/development';
import { JsxEmit } from 'typescript';
const emit = defineEmits(['save']);
const props = defineProps<{
  modelId: string | number;
}>();
const open = ref(false);
const activeTab = ref('info');
const showCreateFile = ref(false);
const columnOptions = ref<SelectOption[]>([]);
const repoOptions = ref<SelectOption[]>([]);
const editFile = reactive({ name: '', content: '', editIndex: -1 });
const formVal = {
  display_name: 'ceshi_name',
  name: '测试名称',
  operatorName: '',
  repo: null,
  columns: [] as string[],
  language: '',
  description: '算子描述',
  files: [],
};
const selected = reactive<any>({
  type: null,
  id: null,
  form: {
    ...formVal,
  },
  params: {
    aggregate: null,
    granularity: { value: 1, unit: 'minute' },
    fillNa: false,
  },
});

const handleScriptImport = (payload: unknown) => {
  if (!payload) return;
  const files = Array.isArray(payload) ? payload : [payload];
  files.forEach((file: any) => {
    const fileName = file?.name || `script-${Date.now()}`;
    const isFirst = selected.form.files.length === 0;
    selected.form.files.push({ name: fileName, content: '', main: isFirst });
  });
  if (!selected.form.files.some((item: any) => item.main) && selected.form.files.length > 0) {
    selected.form.files[0].main = true;
  }
};

const onCreateFileOk = () => {
  if (!editFile.name) return;
  if (editFile.editIndex >= 0) {
    selected.form.files[editFile.editIndex].name = editFile.name;
    selected.form.files[editFile.editIndex].content = editFile.content;
  } else {
    selected.form.files.push({
      name: editFile.name,
      content: editFile.content,
      main: selected.form.files.length === 0,
    });
  }
  editFile.name = '';
  editFile.content = '';
  editFile.editIndex = -1;
  showCreateFile.value = false;
};

const onCreateFileCancel = () => {
  editFile.name = '';
  editFile.content = '';
  editFile.editIndex = -1;
  showCreateFile.value = false;
};

const createFile = () => {
  editFile.editIndex = -1;
  editFile.name = 'new_script.py';
  editFile.content = '# new script';
  showCreateFile.value = true;
};

const editScript = (index: number) => {
  const f = selected.form.files[index];
  editFile.editIndex = index;
  editFile.name = f.name;
  editFile.content = f.content || '';
  showCreateFile.value = true;
};

const setMainScript = (index: number) => {
  selected.form.files.forEach((f, i) => (f.main = i === index));
};

const removeScript = (index: number) => {
  selected.form.files.splice(index, 1);
};

// 对外暴露方法：用于父组件在点击节点时调用
const openNode = (node: any) => {
  Object.assign(selected.form, formVal);
  columnOptions.value = [];
  repoOptions.value = [];
  if (!node) {
    selected.form.operatorName = 'python3自定义算子';
    selected.form.language = 'python32';
    selected.type = 'otherAdd';
  } else {
    selected.id = node.idVal;
    selected.type = node.type;
    let data: any = {
      display_name: node.display_name || '',
      name: node.name || '',
      columns: node.columns || [],
    };
    if (node.type === 'input') {
      getColumnsForRepo(node.idVal);
      data.operatorName = node.operator_name || 'Repo输入';
      data.repo = node.idVal;
      repoOptions.value = [{ label: node.title, value: node.idVal }];
    } else if (node.type === 'output') {
      getColumnsForRepo(node.idVal);
      data.operatorName = node.operator_name || 'Repo输出';
      data.repo = node.idVal;
      repoOptions.value = [{ label: node.title, value: node.idVal }];
    } else {
      data.operatorName = node.operator_name || 'python3自定义算子';
      data.language = node.language || 'python3';
      data.description = node.description || null;
    }

    Object.assign(selected.form, data);

    selected.params = selected.params || {
      aggregate: null,
      granularity: { value: 1, unit: 'minute' },
      fillNa: false,
    };
  }

  open.value = true;
  activeTab.value = 'info';
};
const getColumnsForRepo = async (repoId: string) => {
  try {
    getDataStructureList({ model_input_output_id: repoId }).then((response) => {
      if (response?.data?.items?.length) {
        let options = response.data.items.map((item: any) => ({
          label: item.name,
          value: item.column,
        }));
        columnOptions.value = [...options];
      } else {
        columnOptions.value = [];
      }
    });
  } catch (error) {
    columnOptions.value = [];
  }
};
const saveHand = () => {
  let data = {
    model_id: props.modelId,
    node_display_name: selected.form.display_name,
    node_name: selected.form.name,
    operator_name: selected.form.operatorName,
    language: selected.form.language,
    description: selected.form.description,
    // files: JSON.stringify(selected.form.files),
    script_files: [
      {
        path: 'custom/my_op/main.py',
        is_main: true,
        source_type: 'create',
        name: 'main.py',
        content: 'def run(context):\n    return {...}\n',
      },
    ],
  };
  createCustomOperator(data).then((response) => {
    if (response?.code == 200 && response?.data) {
      emit('save', { ...selected.form, node_id: response.data.node_id });
    }
  });
};
defineExpose({ openNode, saveHand });
</script>

<style scoped lang="scss">
:deep(.ant-tabs) {
  .ant-tabs-nav {
    margin-bottom: 0;
  }
}
.OperatorPanel {
  padding: 16px;
  background: #2e3f60;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #bbb;
    margin-bottom: 16px;
  }
}
</style>
