/**
 * 上传下载相关类型定义
 * 统一管理文件上传、下载相关的类型
 */

// ==================== 文件相关 ====================

/**
 * 文件项
 */
interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  createTime: string;
  status?: "pending" | "uploading" | "success" | "failed";
  [key: string]: any;
}

/**
 * 日志项
 */
interface LogItem {
  id: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}
