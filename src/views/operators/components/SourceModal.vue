<template>
  <a-modal
    :open="open"
    :title="title || '算子源码'"
    :footer="null"
    width="960px"
    @cancel="handleClose"
    @update:open="emit('update:open', $event)">
    <div class="source-modal">
      <div class="file-list" v-if="files.length">
        <div
          v-for="file in files"
          :key="file.path || file.content"
          :class="['file-item', { active: file.path === selectedPath }]"
          @click="emit('update:selectedPath', file.path)">
          {{ file.path || '未命名文件' }}
        </div>
      </div>
      <div v-else class="file-empty">暂无文件</div>

      <div class="source-view">
        <a-spin :spinning="loading">
          <pre class="code-block"><code ref="codeRef" >{{ formattedContent }}</code></pre>
        </a-spin>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/github-dark.css';

hljs.registerLanguage('python', python);

interface SourceFile {
  path: string;
  content: string;
}

const props = defineProps<{
  open: boolean;
  loading: boolean;
  title?: string;
  files: SourceFile[];
  selectedPath: string;
}>();

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'update:selectedPath', value: string): void;
}>();

const codeRef = ref<HTMLElement | null>(null);

const currentFile = computed(() => props.files.find((f) => f.path === props.selectedPath) || props.files[0] || null);

const normalizeContent = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value ?? '');
};

const formattedContent = computed(() => {
  const raw = currentFile.value?.content;
  if (raw === undefined || raw === null || raw === '') return '暂无内容';

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return normalizeContent(parsed);
    } catch (e) {
      return raw;
    }
  }

  return normalizeContent(raw);
});

const handleClose = () => {
  emit('update:open', false);
};

const highlight = () => {
  if (!codeRef.value) return;
  hljs.highlightElement(codeRef.value);
};

const scheduleHighlight = async () => {
  await nextTick();
  highlight();
};

onMounted(scheduleHighlight);

watch(formattedContent, scheduleHighlight);
</script>

<style scoped lang="scss">
.source-modal {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 12px;
  min-height: 400px;
}

.file-list {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: auto;
  max-height: 60vh;
}

.file-item {
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-white);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.file-item:hover,
.file-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffa500;
}

.file-empty {
  color: #999;
  padding: 12px;
}

.source-view {
  max-height: 60vh;
  overflow: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.code-block {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  line-height: 1.5;
}
</style>
