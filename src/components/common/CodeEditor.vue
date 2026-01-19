<template>
  <div class="code-editor-wrapper">
    <div class="code-editor" ref="editorRef">
      <textarea
        ref="textareaRef"
        v-model="localValue"
        @input="handleInput"
        @scroll="handleScroll"
        @keydown="handleKeydown"
        class="code-textarea"
        spellcheck="false"></textarea>
      <pre class="code-highlight" ref="highlightRef"><code :class="`language-${language}`" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/monokai-sublime.css';

// 注册Python语言
hljs.registerLanguage('python', python);

interface Props {
  modelValue: string;
  language?: string;
  placeholder?: string;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  language: 'python',
  placeholder: '请输入代码',
  rows: 16,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const textareaRef = ref<HTMLTextAreaElement>();
const highlightRef = ref<HTMLPreElement>();
const editorRef = ref<HTMLDivElement>();
const localValue = ref(props.modelValue || '');

// 计算高亮后的代码
const highlightedCode = computed(() => {
  if (!localValue.value) {
    return '';
  }
  try {
    return hljs.highlight(localValue.value, { language: props.language }).value;
  } catch (e) {
    console.error('Highlight error:', e);
    return localValue.value;
  }
});

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== localValue.value) {
      localValue.value = newVal || '';
    }
  },
);

// 处理输入
const handleInput = () => {
  emit('update:modelValue', localValue.value);
};

// 同步滚动
const handleScroll = () => {
  if (textareaRef.value && highlightRef.value) {
    highlightRef.value.scrollTop = textareaRef.value.scrollTop;
    highlightRef.value.scrollLeft = textareaRef.value.scrollLeft;
  }
};

// 处理Tab键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const textarea = textareaRef.value;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = localValue.value;

    // 插入Tab（使用4个空格）
    localValue.value = value.substring(0, start) + '    ' + value.substring(end);

    // 恢复光标位置
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      handleInput();
    });
  }
};

onMounted(() => {
  // 设置初始高度
  if (textareaRef.value) {
    textareaRef.value.style.height = `${props.rows * 24}px`;
  }
});
</script>

<style scoped lang="scss">
.code-editor-wrapper {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #1e1e1e;
  overflow: hidden;

  &:hover {
    border-color: #40a9ff;
  }

  &:focus-within {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

.code-editor {
  position: relative;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.code-textarea,
.code-highlight {
  margin: 0;
  padding: 12px;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
}

.code-textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: transparent;
  background: transparent;
  caret-color: #fff;
  resize: vertical;
  z-index: 2;
  overflow: auto;

  &::placeholder {
    color: #999;
  }
}

.code-highlight {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  pointer-events: none;
  z-index: 1;
  background: #1e1e1e;

  code {
    display: block;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    background: transparent !important;
    padding: 0 !important;
  }
}

// 隐藏语法高亮区域的滚动条
.code-highlight {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>
