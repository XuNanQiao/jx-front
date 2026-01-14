import { request } from '@/utils/request';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface JobListQueryParams {
  page?: number; // 页码
  size?: number; // 每页数量
  name?: string; // 名称关键词
  category?: string | number; // 分类等（兼容旧字段）
  status?: number; // 作业状态：0-待执行，1-执行中，2-执行成功，3-执行失败
  [key: string]: any; // 其他筛选参数
}

// 模型作业列表查询
export function getModelJobList(params?: JobListQueryParams): Promise<ApiResponse<any>> {
  return request.post('/api/model_job/retrieve', params || {});
}

// 删除单个模型作业
export function deleteModelJob(id: string | number): Promise<ApiResponse<any>> {
  return request.delete('/api/model_job/delete', { data: { id }, showMessage: true });
}

// 批量删除模型作业
export function batchDeleteModelJob(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete('/api/model_job/batch_delete', { data: { ids }, showMessage: true });
}
