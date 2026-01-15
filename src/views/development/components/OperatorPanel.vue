<template>
  <ToggleBox position="right" :openVal="open" v-if="selected.type">
    <template #content>
      <a-tabs v-model:activeKey="activeTab" type="card">
        <a-tab-pane key="info" tab="算子信息">
          <div class="OperatorPanel">
            <div class="title">基础信息</div>
            <a-form layout="vertical">
              <a-form-item label="节点显示名称">
                <a-input v-model:value="selected.form.node_name_en" />
              </a-form-item>
              <a-form-item label="节点名称">
                <a-input v-model:value="selected.form.name" />
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

              <template v-if="selected.type === 'other' || selected.type == 'otherAdd'">
                <a-form-item label="语言类型">
                  <a-input :disabled="true" v-model:value="selected.form.language" />
                </a-form-item>
                <a-form-item label="算子描述">
                  <a-input v-model:value="selected.form.description" />
                </a-form-item>
                <a-form-item label="脚本文件">
                  <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px">
                    <a-upload :beforeUpload="beforeUpload" :show-upload-list="false">
                      <a-button>上传文件</a-button>
                    </a-upload>
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
import { computed, reactive, ref } from 'vue';
import ToggleBox from './toggleBox.vue';
import { repoOptions, columnOptions, aggregateOptions, granularityOptions } from '../indexData';
const emit = defineEmits(['save']);

const open = ref(false);
const activeTab = ref('info');
const showCreateFile = ref(false);
const editFile = reactive({ name: '', content: '', editIndex: -1 });
const formVal = {
  node_name_en: '',
  name: '',
  operatorName: '',
  repo: null,
  columns: [] as string[],
  language: '',
  description: '',
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

const beforeUpload = (file: any) => {
  selected.form.files.push({ name: file.name, content: '', main: selected.form.files.length === 0 });
  return false;
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
  console.log('openNode', node);
  Object.assign(selected.form, formVal);
  if (!node) {
    selected.type = 'otherAdd';
  } else {
    selected.id = node.id ?? node.name ?? node.title;
    if (node.attribute === '输入') {
      node.operatorName = 'Repo输入';
      selected.type = 'input';
    } else if (node.attribute === '输出') {
      node.operatorName = 'Repo输出';
      selected.type = 'output';
    } else {
      node.operatorName = 'python3自定义算子';
      selected.type = 'other';
    }
    Object.assign(selected.form, node);

    selected.params = selected.params || {
      aggregate: null,
      granularity: { value: 1, unit: 'minute' },
      fillNa: false,
    };
  }

  open.value = true;
  activeTab.value = 'info';
};
const saveHand = () => {
  switch (selected.type) {
    case 'otherAdd':
      break;

    default:
      break;
  }
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
