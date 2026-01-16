<template>
  <a-upload
    :show-upload-list="false"
    :multiple="multiple"
    :accept="accept"
    :data="{ ...importParams, ...hearData }"
    :headers="headers"
    :action="url + importUrl"
    :disabled="isImportDisabled"
    :beforeUpload="beforeUpload"
    @change="handleFileChange"
    :file-list="uploadFileList">
    <a-button :type="importType" :loading="isImportLoading" :disabled="isImportDisabled">
      <template #icon>
        <slot name="importIcon">
          <ImportOutlined />
        </slot>
      </template>
      {{ importLabel }}
    </a-button>
  </a-upload>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue';
import { ImportOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { request, type CustomAxiosRequestConfig } from '@/utils/request';
const url = import.meta.env.VITE_PROXY_TARGET;
type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text';
type ParamsResolver = Record<string, any> | (() => Record<string, any>);
type ImportRequestContext = {
  files: File[];
  formData: FormData;
  extraParams: Record<string, any>;
};
type ImportRequestHandler = (context: ImportRequestContext) => Promise<unknown>;

const props = withDefaults(
  defineProps<{
    importLabel?: string;
    importType?: ButtonType;
    importDisabled?: boolean;
    importLoading?: boolean;
    importUrl?: string;
    importParams?: ParamsResolver;
    importMethod?: 'post' | 'put';
    accept?: string;
    multiple?: boolean;
    autoUpload?: boolean;
  }>(),
  {
    importLabel: '导入',
    importType: 'default',
    importDisabled: false,
    importLoading: false,
    importUrl: '',
    importParams: undefined,
    importMethod: 'post',
    accept: '',
    multiple: true,
    autoUpload: true,
  },
);

const emit = defineEmits<{
  (e: 'import-success', payload?: unknown): void;
  (e: 'import-error', error: unknown): void;
}>();
const isImportDisabled = ref(false);
const isImportLoading = ref(false);
const headers = ref<Record<string, string>>({});
const hearData = ref<FormData | null>(null);
const beforeUpload = (file: File) => {
  if (!props.autoUpload) {
    return false;
  }
  return true;
};
const handleFileChange = async (info: any) => {
  const { file } = info;
  if (file.status === 'uploading') {
    isImportLoading.value = true;
    return;
  }
  if (file.status === 'done') {
    isImportLoading.value = false;
    message.success(`${file.name} 上传成功`);
    emit('import-success', file.response);
  } else if (file.status === 'error') {
    isImportLoading.value = false;
    message.error(`${file.name} 上传失败`);
    emit('import-error', file.error);
  }
};
</script>
