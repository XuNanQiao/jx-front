<template>
  <ToggleBox position="right" :openVal="open" v-if="selected.id">
    <template #content>
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="info" tab="算子信息">
          <div>
            <a-form layout="vertical">
              <a-form-item label="节点显示名称">
                <a-input v-model:value="selected.form.displayName" />
              </a-form-item>
              <a-form-item label="节点名称">
                <a-input v-model:value="selected.form.name" />
              </a-form-item>
              <a-form-item label="算子名称">
                <a-input v-model:value="selected.form.operatorName" />
              </a-form-item>

              <template v-if="selected.type === 'input' || selected.type === 'output'">
                <a-form-item label="Repo">
                  <a-select v-model:value="selected.form.repo" placeholder="请选择 Repo">
                    <a-select-option value="repo-a">repo-a</a-select-option>
                    <a-select-option value="repo-b">repo-b</a-select-option>
                  </a-select>
                </a-form-item>
              </template>

              <template v-if="selected.type === 'input'">
                <a-form-item label="列">
                  <a-select v-model:value="selected.form.columns" mode="multiple" placeholder="请选择列">
                    <a-select-option value="col1">col1</a-select-option>
                    <a-select-option value="col2">col2</a-select-option>
                    <a-select-option value="col3">col3</a-select-option>
                  </a-select>
                </a-form-item>
              </template>

              <template v-if="selected.type === 'other'">
                <a-form-item label="语言类型">
                  <a-input v-model:value="selected.form.language" />
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
                  <div v-if="selected.files.length">
                    <a-list :dataSource="selected.files" bordered>
                      <template #renderItem="{ item, index }">
                        <a-list-item>
                          <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
                            <div>
                              <a-tag v-if="item.main" color="processing">主</a-tag>
                              <span style="margin-left: 8px">{{ item.name }}</span>
                            </div>
                            <div style="display: flex; gap: 8px">
                              <a-button size="small" @click="setMainScript(index)">设为主脚本</a-button>
                              <a-button size="small" @click="editScript(index)" v-if="item.name.endsWith('.py')">编辑</a-button>
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

        <a-tab-pane key="params" tab="参数配置" v-if="showParamsTab">
          <div>
            <a-form layout="vertical">
              <a-form-item label="聚合函数">
                <a-select v-model:value="selected.params.aggregate" placeholder="请选择">
                  <a-select-option value="sum">求和</a-select-option>
                  <a-select-option value="avg">平均</a-select-option>
                  <a-select-option value="max">最大</a-select-option>
                  <a-select-option value="min">最小</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="数据聚合粒度">
                <div style="display: flex; gap: 8px; align-items: center">
                  <a-input-number v-model:value="selected.params.granularity.value" :min="1" />
                  <a-select v-model:value="selected.params.granularity.unit">
                    <a-select-option value="minute">分钟</a-select-option>
                    <a-select-option value="hour">小时</a-select-option>
                    <a-select-option value="day">天</a-select-option>
                    <a-select-option value="week">周</a-select-option>
                    <a-select-option value="month">月</a-select-option>
                    <a-select-option value="quarter">季度</a-select-option>
                    <a-select-option value="year">年</a-select-option>
                  </a-select>
                </div>
              </a-form-item>
              <a-form-item label="填充空值">
                <a-switch v-model:checked="selected.params.fillNa" />
              </a-form-item>
            </a-form>
          </div>
        </a-tab-pane> </a-tabs
    ></template>
  </ToggleBox>

  <a-modal v-model:open="showCreateFile" title="创建/编辑脚本" @ok="onCreateFileOk" @cancel="onCreateFileCancel">
    <a-form layout="vertical">
      <a-form-item label="文件名称">
        <a-input v-model:value="editFile.name" />
      </a-form-item>
      <a-form-item label="文件内容">
        <a-input-textarea v-model:value="editFile.content" rows="10" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import ToggleBox from "./toggleBox.vue";

const open = ref(false);
const activeTab = ref("info");
const showCreateFile = ref(false);
const editFile = reactive({ name: "", content: "", editIndex: -1 });

const selected = reactive<any>({
  type: "other",
  id: null,
  form: {
    displayName: "",
    name: "",
    operatorName: "",
    repo: null,
    columns: [] as string[],
    language: "",
    description: "",
  },
  params: {
    aggregate: null,
    granularity: { value: 1, unit: "minute" },
    fillNa: false,
  },
  files: [] as Array<{ name: string; content?: string; main?: boolean }>,
});

const showParamsTab = computed(() => selected.type !== "output");

const beforeUpload = (file: any) => {
  selected.files.push({ name: file.name, content: "", main: selected.files.length === 0 });
  return false;
};

const onCreateFileOk = () => {
  if (!editFile.name) return;
  if (editFile.editIndex >= 0) {
    selected.files[editFile.editIndex].name = editFile.name;
    selected.files[editFile.editIndex].content = editFile.content;
  } else {
    selected.files.push({ name: editFile.name, content: editFile.content, main: selected.files.length === 0 });
  }
  editFile.name = "";
  editFile.content = "";
  editFile.editIndex = -1;
  showCreateFile.value = false;
};

const onCreateFileCancel = () => {
  editFile.name = "";
  editFile.content = "";
  editFile.editIndex = -1;
  showCreateFile.value = false;
};

const createFile = () => {
  editFile.editIndex = -1;
  editFile.name = "new_script.py";
  editFile.content = "# new script";
  showCreateFile.value = true;
};

const editScript = (index: number) => {
  const f = selected.files[index];
  editFile.editIndex = index;
  editFile.name = f.name;
  editFile.content = f.content || "";
  showCreateFile.value = true;
};

const setMainScript = (index: number) => {
  selected.files.forEach((f, i) => (f.main = i === index));
};

const removeScript = (index: number) => {
  selected.files.splice(index, 1);
};

// 对外暴露方法：用于父组件在点击节点时调用
const openNode = (node: any) => {
  selected.id = node.id ?? node.name ?? node.title;
  if (node.attribute === "输入") {
    selected.type = "input";
  } else if (node.attribute === "输出") {
    selected.type = "output";
  } else {
    selected.type = "other";
  }
  selected.form.displayName = node.name ?? node.title ?? "";
  selected.form.name = (node.name ?? node.title ?? "").replace(/\s+/g, "_");
  selected.form.operatorName = node.title ?? node.name ?? "";
  selected.form.repo = selected.form.repo || null;
  selected.form.columns = selected.form.columns || [];
  selected.form.language = selected.form.language || "python";
  selected.form.description = selected.form.description || "";
  selected.params = selected.params || { aggregate: null, granularity: { value: 1, unit: "minute" }, fillNa: false };
  selected.files = selected.files || [];
  // 请父组件展开面板（不要直接修改 props）
  open.value = true;
  activeTab.value = "info";
};

defineExpose({ openNode });
</script>

<style scoped lang="scss">
.box {
  width: 0px;
  transition: width 0.5s;
  height: calc(100vh - 90px);
  position: fixed;
  flex-shrink: 0;

  .icon {
    width: 30px;
    position: absolute;
    line-height: 30px;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .filter-panel {
    height: calc(100vh - 90px);
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow-y: auto;
    padding: 16px;
    overflow-x: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: transform 0.5s;
    transform: scaleX(0);
  }
}
.leftBox {
  top: 88px;
  left: 0;
  &.open {
    width: 280px;
  }
  .icon {
    right: -30px;
    border-radius: 0 5px 5px 0;
  }
  .filter-panel {
    transform-origin: left;
  }
}
.rightBox {
  right: 0;
  top: 88px;
  transform-origin: right;
  &.open {
    width: 280px;
  }
  .icon {
    left: -30px;
    border-radius: 5px 0 0 5px;
  }
  .filter-panel {
    padding-top: 0;
    transform-origin: right;
  }
}
.open {
  .filter-panel {
    transform: scaleX(1);
  }
}
.data-panel {
  width: 100%;
  height: calc(100vh - 90px);
}
</style>
