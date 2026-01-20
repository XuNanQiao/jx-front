/**
 * 组件相关类型定义
 * 统一管理所有组件的 Props 和通用类型
 */

// ==================== Ant Design 组件类型 ====================

/**
 * 按钮类型
 */
export type ButtonType = "default" | "primary" | "dashed" | "link" | "text";

/**
 * 间距大小类型
 */
export type SpaceSize = number | [number, number] | "small" | "middle" | "large";

// ==================== 通用工具类型 ====================

/**
 * 参数解析器 - 支持静态对象或函数返回
 */
export type ParamsResolver = Record<string, any> | (() => Record<string, any>);

// ==================== 上传下载组件类型 ====================

/**
 * 上传文件对象
 */
interface UploadFile {
  uid: string;
  name: string;
  status?: string;
  percent?: number;
  response?: unknown;
  error?: unknown;
  originFileObj?: File;
  [key: string]: any;
}

/**
 * 上传变化参数
 */
interface UploadChangeParam {
  file: UploadFile;
  fileList: UploadFile[];
  event?: ProgressEvent;
}

/**
 * 下载请求上下文
 */
interface DownloadRequestContext {
  params: Record<string, any>;
  config: any; // CustomAxiosRequestConfig
}

/**
 * 下载请求处理器
 */
export type DownloadRequestHandler = (context: DownloadRequestContext) => Promise<Blob | unknown>;

// ==================== 代码编辑器类型 ====================

/**
 * 代码编辑器 Props
 */
interface CodeEditorProps {
  modelValue: string;
  language?: string;
  placeholder?: string;
  rows?: number;
}

// ==================== 源码文件类型 ====================

/**
 * 源码文件
 */
interface SourceFile {
  id?: string | number;
  name: string;
  path?: string;
  content?: string;
  language?: string;
  [key: string]: any;
}

// ==================== 日志模态框类型 ====================

/**
 * 日志模态框 Props
 */
interface LogModalProps {
  visible?: boolean;
  title?: string;
  jobId?: string | number;
  [key: string]: any;
}

// ==================== 树节点类型 ====================

/**
 * 树节点
 */
interface TreeNode {
  key: string | number;
  title: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  [key: string]: any;
}
