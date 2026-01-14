import { request } from '@/utils/request';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 列表查询参数（与页面筛选兼容）
export interface ListQueryParams {
  size?: number;
  page?: number;
  keyword?: string;
  category?: string;
  [key: string]: any;
}

// 算子管理列表 - 使用真实后端接口
export function getList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post('/api/model_operator/retrieve', params || {});
}

// 获取算子源码
export function getSourceCode(id: string | number): Promise<ApiResponse<any>> {
  return request.post('/api/model_operator/source_code', { id });
}
