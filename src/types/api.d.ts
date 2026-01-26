/**
 * API 相关类型定义
 * 统一管理所有 API 请求和响应的类型
 */

// ==================== 通用类型 ====================

/**
 * API 响应统一格式
 */
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 列表查询通用参数
 */
interface ListQueryParams {
  page?: number; // 页码
  size?: number; // 每页数量
  keyword?: string; // 搜索关键词
  name?: string; // 名称关键字
  category?: string | number; // 类别筛选
  editor?: string | number; // 编辑器筛选
  [key: string]: any; // 其他筛选参数
}

// ==================== 认证相关 ====================

/**
 * 登录请求参数
 */
interface LoginParams {
  username: string;
  password: string;
}

/**
 * 用户信息
 */
interface UserInfo {
  id: string | number;
  username: string;
  nickname?: string;
  avatar?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * 登录响应数据
 */
interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

// ==================== 模型作业相关 ====================

/**
 * 模型作业列表查询参数
 */
interface JobListQueryParams {
  page?: number; // 页码
  size?: number; // 每页数量
  name?: string; // 名称关键词
  category?: string | number; // 分类等（兼容旧字段）
  status?: number; // 作业状态：0-待执行，1-执行中，2-执行成功，3-执行失败
  [key: string]: any; // 其他筛选参数
}

/**
 * 作业计划查询参数
 */
interface JobPlanQueryParams {
  model_id?: string | number; // 模型ID
  [key: string]: any;
}

/**
 * 作业计划项
 */
interface JobPlanItem {
  name: string; // 作业名称
  startTime: number; // 开始时间戳
  endTime: number; // 结束时间戳
  status: string; // 作业状态
  [key: string]: any;
}

/**
 * 作业计划响应数据结构
 */
interface JobPlanResponse {
  time_start: string;
  time_end: string;
  total: number;
  items: JobPlanItem[];
}

// ==================== 脚本文件相关 ====================

/**
 * 脚本文件上传响应
 */
interface ScriptFileUploadResponse {
  file_id?: string | number;
  path?: string;
  name?: string;
  url?: string;
  [key: string]: any;
}

/**
 * 脚本文件上传额外参数
 */
interface ScriptFileUploadExtraParams {
  is_run?: boolean;
  [key: string]: any;
}

/**
 * 创建脚本文件参数
 */
interface CreateScriptFileParams {
  file_path: string; // 文件路径
  content: string; // 文件内容
  is_run?: boolean; // 是否是主函数
}

/**
 * 更新脚本文件参数
 */
interface UpdateScriptFileParams {
  name: string; // 文件名称
  file_path: string; // 文件路径
  content: string; // 文件内容
  is_run?: boolean; // 是否是主函数
}

// ==================== 数据完整度相关 ====================

/**
 * 数据完整度查询参数
 */
interface CompletenessParams {
  year?: number | string;
  month?: number | string;
  day?: string;
  metric?: string;
}
