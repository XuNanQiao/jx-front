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
                    <ImportAction
                      import-label="上传文件"
                      accept=".pyc"
                      :paramsResolver="[
                        {
                          key: 'file_path',
                          values: ['name'],
                          transform: (fileName: string | undefined): string => {
                            if (!fileName) return '';
                            // 去掉文件后缀，支持多个后缀如 .tar.gz
                            return 'operators/';
                          },
                        },
                      ]"
                      importUrl="/api/workflow/script_file/upload"
                      @import-success="handleScriptUploadSuccess" />
                    <a-button type="default" @click="createFile">创建文件</a-button>
                  </div>
                  <div v-if="selected.form.files?.length">
                    <a-list :dataSource="selected.form.files" bordered>
                      <template #renderItem="{ item, index }">
                        <a-list-item>
                          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
                            <span style="margin-left: 8px">{{ item.name }}</span>
                            <div style="display: flex; gap: 8px; align-items: center">
                              <a-tooltip title="设为主文件">
                                <a-radio :checked="item.is_run === true" @click="setMainScript(index)" />
                              </a-tooltip>
                              <a-tooltip title="编辑" v-if="item.name.endsWith('.py')">
                                <EditOutlined
                                  :style="{ fontSize: '16px', cursor: 'pointer', color: '#1890ff' }"
                                  @click="editScript(index)" />
                              </a-tooltip>
                              <a-tooltip title="删除">
                                <DeleteOutlined
                                  :style="{ fontSize: '16px', cursor: 'pointer', color: '#ff4d4f' }"
                                  @click="removeScript(index)" />
                              </a-tooltip>
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
                  v-model:value="selected.params.aggregation_function"
                  :options="aggregateOptions"
                  placeholder="请选择"></a-select>
              </a-form-item>
              <a-form-item label="数据聚合粒度">
                <a-input-number v-model:value="selected.params.aggregation_granularity" :min="1">
                  <template #addonAfter>
                    <a-select
                      class="!w-80px"
                      v-model:value="selected.params.aggregation_unit"
                      :options="granularityOptions"></a-select>
                  </template>
                </a-input-number>
              </a-form-item>
              <a-form-item label="填充空值">
                <a-switch v-model:checked="selected.params.fill_null_values" />
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane>
      </a-tabs>
    </template>
  </ToggleBox>

  <a-modal v-model:open="showCreateFile" title="创建/编辑脚本" @ok="onCreateFileOk" @cancel="onCreateFileCancel">
    <a-form layout="vertical">
      <a-form-item label="文件名称">
        <a-input v-model:value="editFile.name" placeholder="请输入文件名称，如：script" />
      </a-form-item>
      <a-form-item label="文件内容">
        <a-textarea v-model:value="editFile.content" placeholder="请输入文件内容" :rows="16" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import ToggleBox from './toggleBox.vue';
import { aggregateOptions, granularityOptions } from '../indexData';
import { getDataStructureList } from '@/api/inputOutput';
import ImportAction from '@/components/common/ImportAction.vue';
import { createCustomOperator, createScriptFile, updateScriptFile } from '@/api/development';
import { values } from 'lodash-es';
import { message } from 'ant-design-vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
const emit = defineEmits(['save', 'update']);
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
    aggregation_function: null,
    aggregation_granularity: 5,
    aggregation_unit: '分钟',
    fill_null_values: true,
  },
});

const handleScriptUploadSuccess = (payload: any) => {
  if (!payload) return;

  selected.form.files.push({
    path: payload.response.data.file_path,
    is_run: false, // 默认不是主文件，由用户手动选择
    source_type: 'upload',
    name: payload.name,
    content: null,
  });
};

const onCreateFileOk = async () => {
  if (!editFile.name) {
    message.warning('请输入文件名称');
    return;
  }
  if (!editFile.content) {
    message.warning('请输入文件内容');
    return;
  }

  // 编辑已有文件
  if (editFile.editIndex >= 0) {
    const file = selected.form.files[editFile.editIndex];

    // 如果文件是通过接口创建的，调用接口更新
    if (file.source_type === 'create' || file.path) {
      try {
        const response = await updateScriptFile({
          file_path: 'operators/' /* file.path || editFile.name + '.py' */,
          content: editFile.content,
          is_run: file.is_run || false,
        });

        if (response?.code === 200) {
          selected.form.files[editFile.editIndex] = {
            ...file,
            name: editFile.name + '.py',
            content: editFile.content,
            path: file.path || editFile.name + '.py',
          };
          message.success('文件更新成功');
        }
      } catch (error) {
        console.error('更新脚本文件失败:', error);
        message.error('更新脚本文件失败');
        return;
      }
    } else {
      // 本地编辑，不调用接口
      selected.form.files[editFile.editIndex].name = editFile.name + '.py';
      selected.form.files[editFile.editIndex].content = editFile.content;
    }
  } else {
    // 创建新文件
    try {
      const response = await createScriptFile({
        file_path: editFile.name + '.py',
        content: editFile.content,
        is_run: false,
      });

      if (response?.code === 200 && response?.data) {
        selected.form.files.push({
          path: response.data.file_path || editFile.name + '.py',
          is_run: false,
          source_type: 'create',
          name: editFile.name + '.py',
          content: editFile.content,
        });
        message.success('文件创建成功');
      }
    } catch (error) {
      console.error('创建脚本文件失败:', error);
      message.error('创建脚本文件失败');
      return;
    }
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
  selected.form.files.forEach((f: any, i: number) => {
    f.is_run = i === index;
  });
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
      // getColumnsForRepo(node.idVal);
      data.operatorName = node.operator_name || 'Repo输出';
      data.repo = node.idVal;
      repoOptions.value = [{ label: node.title, value: node.idVal }];
    } else {
      data.operatorName = node.operator_name || 'python3自定义算子';
      data.language = node.language || 'python3';
      data.description = node.description || null;
    }

    Object.assign(selected.form, data);

    // 从节点数据中读取参数配置
    selected.params = {
      aggregation_function: node.aggregation_function ?? null,
      aggregation_granularity: node.aggregation_granularity ?? 5,
      aggregation_unit: node.aggregation_unit ?? '分钟',
      fill_null_values: node.fill_null_values ?? true,
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
    script_files: selected.form.files,
  };
  createCustomOperator(data).then((response) => {
    if (response?.code == 200 && response?.data) {
      emit('save', { ...selected.form, node_id: response.data.node_id });
    }
  });
};

// 获取当前编辑的数据
const getCurrentData = () => {
  if (!selected.id) return null;
  return {
    id: selected.id,
    type: selected.type,
    form: { ...selected.form },
    params: { ...selected.params },
  };
};

// 关闭抽屉弹窗
const closePanel = () => {
  open.value = false;
  selected.type = null;
  selected.id = null;
};

// 监听 selected.form 的变化，实时同步到父组件
watch(
  () => selected.form,
  () => {
    if (selected.id) {
      const currentData = getCurrentData();
      emit('update', currentData);
    }
  },
  { deep: true },
);
watch(
  () => selected.params,
  () => {
    if (selected.id) {
      const currentData = getCurrentData();
      emit('update', currentData);
    }
  },
  { deep: true },
);

defineExpose({ openNode, saveHand, getCurrentData, closePanel });
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
