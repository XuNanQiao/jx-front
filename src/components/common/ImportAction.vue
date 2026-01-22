<template>
  <a-upload
    :show-upload-list="false"
    multiple
    :accept="accept"
    :data="resolvedExtraData"
    :headers="headers"
    :action="uploadAction"
    :method="importMethod"
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
import { computed, ref } from "vue";
import { ImportOutlined } from "@ant-design/icons-vue";
import { message, Upload } from "ant-design-vue";
import { request, type CustomAxiosRequestConfig } from "@/utils/request";
const uploadListIgnore = (Upload as any)?.LIST_IGNORE;

type ButtonType = "default" | "primary" | "dashed" | "link" | "text";
type ParamsResolver = Record<string, any> | (() => Record<string, any>);
type UploadFile = {
  uid: string;
  name: string;
  status?: string;
  percent?: number;
  response?: unknown;
  error?: unknown;
  originFileObj?: File;
  [key: string]: any;
};
type UploadChangeParam = {
  file: UploadFile;
  fileList: UploadFile[];
  event?: ProgressEvent;
};

const props = withDefaults(
  defineProps<{
    importLabel?: string;
    importType?: ButtonType;
    importDisabled?: boolean;
    importLoading?: boolean;
    importUrl?: string;
    importParams?: ParamsResolver;
    importMethod?: "post" | "put";
    accept?: string;
    multiple?: boolean;
    autoUpload?: boolean;
    paramsResolver?: Record<string, any> | any[];
  }>(),
  {
    importLabel: "导入",
    importType: "default",
    importDisabled: false,
    importLoading: false,
    importUrl: "",
    importParams: undefined,
    importMethod: "post",
    accept: "",
    multiple: true,
    autoUpload: true,
    paramsResolver: () => [],
  },
);

const emit = defineEmits<{
  (e: "import-success", payload?: unknown): void;
  (e: "import-error", error: unknown): void;
}>();

const ensureFormDataValue = (value: any): string | Blob => {
  if (value instanceof Blob) return value;
  if (typeof value === "string" || value instanceof String) return value as string;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "";
  return JSON.stringify(value);
};

const parseAccept = (accept?: string): string[] => {
  if (!accept) return [];
  return accept
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const isAcceptedFile = (fileName: string, fileType: string, acceptedList: string[]): boolean => {
  if (!acceptedList.length) return true;
  if (!fileName && !fileType) return true;

  return acceptedList.some((acceptItem) => {
    if (acceptItem.startsWith(".")) {
      return fileName.endsWith(acceptItem);
    }
    if (acceptItem.endsWith("/*")) {
      const prefix = acceptItem.slice(0, acceptItem.lastIndexOf("/"));
      return prefix ? fileType.startsWith(`${prefix}/`) : false;
    }
    if (acceptItem.includes("/")) {
      return fileType === acceptItem;
    }
    return false;
  });
};
const uploadData = ref<Record<string, any>>({});
const uploadFileList = ref<UploadFile[]>([]);
const innerImportLoading = ref(false);

const resolvedExtraData = computed(() => ({ ...props.importParams, ...uploadData.value }));
const acceptedTypes = computed(() => parseAccept(props.accept));
const headers = computed((): Record<string, string> => {
  const token = localStorage.getItem("token");
  const h: Record<string, string> = {};
  if (token) {
    h.Authorization = `Bearer ${token}`;
  }
  return h;
});
const uploadAction = computed(() => {
  if (!props.importUrl) return "";
  const base = import.meta.env.VITE_API_BASE_URL || "";
  return `${base}${props.importUrl}`;
});

const isImportLoading = computed(() => props.importLoading || innerImportLoading.value);
const isImportDisabled = computed(() => {
  if (props.autoUpload !== false && !props.importUrl) return true;
  return props.importDisabled || isImportLoading.value;
});

const manualUpload = async (rawFile: File, displayName: string) => {
  if (!props.importUrl) {
    if (props.multiple) {
      emit("import-success", [rawFile]);
    } else {
      emit("import-success", rawFile);
    }
    message.success("导入成功");
    uploadFileList.value = [];
    return;
  }

  innerImportLoading.value = true;
  try {
    const formData = new FormData();
    formData.append("file", rawFile);

    const extraData = resolvedExtraData.value;
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, ensureFormDataValue(value));
    });

    const requestConfig: CustomAxiosRequestConfig = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const method = props.importMethod ?? "post";
    let response;
    if (method === "put") {
      response = await request.put(props.importUrl, formData, requestConfig);
    } else {
      response = await request.post(props.importUrl, formData, requestConfig);
    }

    message.success(`${displayName} 上传成功`);
    emit("import-success", response);
  } catch (error) {
    message.error(`${displayName} 上传失败`);
    emit("import-error", error);
  } finally {
    innerImportLoading.value = false;
    uploadFileList.value = [];
  }
};

const beforeUpload = (file: UploadFile) => {
  // 在上传开始前，将 paramsResolver 数组中的 { key, values } 映射为从 file 中取值
  const resolvers = props.paramsResolver as any;
  if (Array.isArray(resolvers)) {
    resolvers.forEach((item: any) => {
      if (!item || typeof item.key !== "string") return;
      const vals = item.values;
      if (Array.isArray(vals)) {
        let v: any = file as any;
        for (const k of vals) {
          if (v == null) break;
          v = (v as any)[k];
        }
        // 支持 transform 函数对提取的值进行转换
        if (typeof item.transform === "function") {
          v = item.transform(v);
        }
        uploadData.value[item.key] = v;
      } else {
        // 非数组场景，直接赋值
        uploadData.value[item.key] = vals;
      }
    });
  }
  const rawFile = file.originFileObj as File | undefined;
  const fileName = (rawFile?.name ?? file.name ?? "").toLowerCase();
  const fileType = (rawFile?.type ?? (file as any).type ?? "").toLowerCase();

  if (!isAcceptedFile(fileName, fileType, acceptedTypes.value)) {
    const acceptTip = props.accept ? `仅支持上传 ${props.accept} 文件` : "文件格式不支持";
    message.error(acceptTip);
    uploadFileList.value = [];
    return uploadListIgnore ?? false;
  }

  if (props.autoUpload === false) {
    if (rawFile) {
      manualUpload(rawFile, rawFile.name ?? file.name ?? "文件");
    }
    return uploadListIgnore ?? false;
  }
  return true;
};

const handleFileChange = (info: UploadChangeParam) => {
  if (props.autoUpload === false) {
    uploadFileList.value = [];
    return;
  }

  uploadFileList.value = info.fileList;
  const { file } = info;

  if (file.status === "uploading") {
    innerImportLoading.value = true;
    return;
  }

  if (file.status === "done") {
    innerImportLoading.value = false;
    message.success(`${file.name} 上传成功`);
    emit("import-success", file);
    uploadFileList.value = [];
    return;
  }

  if (file.status === "error") {
    innerImportLoading.value = false;
    const errorMsg = (file?.response as any)?.detail?.msg || (file.error as any)?.message;
    console.log(file, "------file.status");
    message.error(errorMsg || `${file.name} 上传失败`);
    emit("import-error", file.error ?? new Error(`${file.name} 上传失败`));
    uploadFileList.value = [];
  }
};
</script>
