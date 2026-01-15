<template>
  <a-space :size="size" wrap>
    <a-button
      v-if="showImport"
      :type="importType"
      :loading="isImportLoading"
      :disabled="isImportDisabled"
      @click="triggerFileSelect">
      <template #icon>
        <slot name="importIcon">
          <ImportOutlined />
        </slot>
      </template>
      {{ importLabel }}
    </a-button>
    <a-button
      v-if="showDownload"
      :type="downloadType"
      :loading="isDownloadLoading"
      :disabled="isDownloadDisabled"
      @click="handleDownload">
      <template #icon>
        <slot name="downloadIcon">
          <DownloadOutlined />
        </slot>
      </template>
      {{ downloadLabel }}
    </a-button>
    <slot name="extra" />
    <input
      v-if="showImport"
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      style="display: none"
      @change="onFileChange" />
  </a-space>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DownloadOutlined, ImportOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import service, { request, type CustomAxiosRequestConfig } from '@/utils/request';

type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text';
type SpaceSize = number | [number, number] | 'small' | 'middle' | 'large';
type ParamsResolver = Record<string, any> | (() => Record<string, any>);

const props = withDefaults(
  defineProps<{
    importLabel?: string;
    downloadLabel?: string;
    importType?: ButtonType;
    downloadType?: ButtonType;
    showImport?: boolean;
    showDownload?: boolean;
    importDisabled?: boolean;
    downloadDisabled?: boolean;
    importLoading?: boolean;
    downloadLoading?: boolean;
    size?: SpaceSize;
    importUrl?: string;
    downloadUrl?: string;
    importParams?: ParamsResolver;
    downloadParams?: ParamsResolver;
    importMethod?: 'post' | 'put';
    downloadMethod?: 'get' | 'post';
    importFileField?: string;
    downloadFileName?: string;
    accept?: string;
    multiple?: boolean;
  }>(),
  {
    importLabel: '导入',
    downloadLabel: '下载',
    importType: 'default',
    downloadType: 'default',
    showImport: true,
    showDownload: true,
    importDisabled: false,
    downloadDisabled: false,
    importLoading: false,
    downloadLoading: false,
    size: 16,
    importUrl: '',
    downloadUrl: '',
    importParams: undefined,
    downloadParams: undefined,
    importMethod: 'post',
    downloadMethod: 'get',
    importFileField: 'file',
    downloadFileName: '',
    accept: '',
    multiple: false,
  },
);

const emit = defineEmits<{
  (e: 'import-success', payload?: unknown): void;
  (e: 'import-error', error: unknown): void;
  (e: 'download-success'): void;
  (e: 'download-error', error: unknown): void;
}>();

const resolveParams = (params?: ParamsResolver) => {
  if (!params) return {};
  try {
    return typeof params === 'function' ? params() || {} : params;
  } catch (error) {
    console.error('解析参数失败:', error);
    return {};
  }
};

const ensureFormDataValue = (value: any): string | Blob => {
  if (value instanceof Blob) return value;
  if (typeof value === 'string' || value instanceof String) return value as string;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return '';
  return JSON.stringify(value);
};

const fileInputRef = ref<HTMLInputElement | null>(null);
const innerImportLoading = ref(false);
const innerDownloadLoading = ref(false);

const isImportLoading = computed(() => props.importLoading || innerImportLoading.value);
const isDownloadLoading = computed(() => props.downloadLoading || innerDownloadLoading.value);

const isImportDisabled = computed(() => !props.importUrl || props.importDisabled || isImportLoading.value);
const isDownloadDisabled = computed(() => !props.downloadUrl || props.downloadDisabled || isDownloadLoading.value);

const resetFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const triggerFileSelect = () => {
  if (isImportDisabled.value) return;
  fileInputRef.value?.click();
};

const onFileChange = async (event: Event) => {
  const { files } = event.target as HTMLInputElement;
  if (!files || files.length === 0) {
    resetFileInput();
    return;
  }

  const fileList = Array.from(files);
  await uploadFiles(fileList);
  resetFileInput();
};

const uploadFiles = async (files: File[]) => {
  if (!props.importUrl) {
    message.warning('未配置导入地址');
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append(props.importFileField, file);
  });

  const extraParams = resolveParams(props.importParams);
  Object.entries(extraParams).forEach(([key, value]) => {
    formData.append(key, ensureFormDataValue(value));
  });

  innerImportLoading.value = true;
  try {
    const method = props.importMethod || 'post';
    const config: CustomAxiosRequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      showSuccessMessage: false,
      showErrorMessage: false,
    };

    let response: unknown;
    if (method === 'put') {
      response = await request.put(props.importUrl, formData, config);
    } else {
      response = await request.post(props.importUrl, formData, config);
    }

    message.success('导入成功');
    emit('import-success', response);
  } catch (error: any) {
    console.error('导入失败:', error);
    message.error(error?.message || '导入失败');
    emit('import-error', error);
  } finally {
    innerImportLoading.value = false;
  }
};

const createBlobUrl = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  return url;
};

const downloadFile = (blob: Blob) => {
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = createBlobUrl(blob);
  link.download = props.downloadFileName || `download-${Date.now()}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleDownload = async () => {
  if (!props.downloadUrl) {
    message.warning('未配置下载地址');
    return;
  }
  if (isDownloadDisabled.value) return;

  innerDownloadLoading.value = true;
  try {
    const params = resolveParams(props.downloadParams);
    const method = props.downloadMethod || 'get';

    const config: CustomAxiosRequestConfig = {
      responseType: 'blob',
      showSuccessMessage: false,
      showErrorMessage: false,
    };

    let data: unknown;
    if (method === 'post') {
      data = await service.post(props.downloadUrl, params, config);
    } else {
      config.params = params;
      data = await service.get(props.downloadUrl, config);
    }

    if (!data) {
      message.warning('暂无可下载的数据');
      return;
    }

    const blob = data instanceof Blob ? data : new Blob([data as any]);

    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      try {
        const json = JSON.parse(text);
        message.error(json?.message || '下载失败');
        emit('download-error', json);
      } catch (parseError) {
        console.error('解析下载失败信息异常:', parseError);
        message.error('下载失败');
        emit('download-error', parseError);
      }
      return;
    }

    downloadFile(blob);
    message.success('下载开始');
    emit('download-success');
  } catch (error: any) {
    console.error('下载失败:', error);
    message.error(error?.message || '下载失败');
    emit('download-error', error);
  } finally {
    innerDownloadLoading.value = false;
  }
};
</script>
