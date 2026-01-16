<template>
  <a-button :type="downloadType" :loading="isDownloadLoading" :disabled="isDownloadDisabled" @click="handleDownload">
    <template #icon>
      <slot name="downloadIcon">
        <DownloadOutlined />
      </slot>
    </template>
    {{ downloadLabel }}
  </a-button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { DownloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import service, { type CustomAxiosRequestConfig } from '@/utils/request';

type ButtonType = 'default' | 'primary' | 'dashed' | 'link' | 'text';
type ParamsResolver = Record<string, any> | (() => Record<string, any>);
type DownloadRequestContext = {
  params: Record<string, any>;
  config: CustomAxiosRequestConfig;
};
type DownloadRequestHandler = (context: DownloadRequestContext) => Promise<Blob | unknown>;

const props = withDefaults(
  defineProps<{
    downloadLabel?: string;
    downloadType?: ButtonType;
    downloadDisabled?: boolean;
    downloadLoading?: boolean;
    downloadUrl?: string;
    downloadParams?: ParamsResolver;
    downloadMethod?: 'get' | 'post';
    downloadFileName?: string;
    downloadRequest?: DownloadRequestHandler;
  }>(),
  {
    downloadLabel: '下载',
    downloadType: 'default',
    downloadDisabled: false,
    downloadLoading: false,
    downloadUrl: '',
    downloadParams: undefined,
    downloadMethod: 'post',
    downloadFileName: '',
    downloadRequest: undefined,
  },
);

const emit = defineEmits<{
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

const innerDownloadLoading = ref(false);

const isDownloadLoading = computed(() => props.downloadLoading || innerDownloadLoading.value);
const isDownloadDisabled = computed(
  () => (!props.downloadUrl && !props.downloadRequest) || props.downloadDisabled || isDownloadLoading.value,
);

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

const processDownloadResponse = async (data: unknown) => {
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
};

const handleDownload = async () => {
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

    if (props.downloadRequest) {
      const data = await props.downloadRequest({ params, config: { ...config } });
      await processDownloadResponse(data);
      return;
    }

    if (!props.downloadUrl) {
      message.warning('未配置下载地址');
      return;
    }

    let data: unknown;
    if (method === 'post') {
      data = await service.post(props.downloadUrl, params, config);
    } else {
      config.params = params;
      data = await service.get(props.downloadUrl, config);
    }

    await processDownloadResponse(data);
  } catch (error: any) {
    console.error('下载失败:', error);
    message.error(error?.message || '下载失败');
    emit('download-error', error);
  } finally {
    innerDownloadLoading.value = false;
  }
};
</script>
