import { request } from '@/utils/request';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface ListQueryParams {
  page?: number; // 页码
  size?: number; // 每页数量
  name?: string; // 关键字搜索
  keyword?: string; // 历史字段，兼容旧接口
  category?: string | number; // 类别筛选
  editor?: string | number; // 编辑器筛选
  [key: string]: any; // 其他筛选参数
}

// 模型开发列表
export function getModelDevList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post('/api/model_dev/retrieve', params || {});
}

// 模型开发详情
export function getModelDevDetail(id: string | number): Promise<ApiResponse<any>> {
  return request.post('/api/model_dev/detail', { id });
}

// 创建模型开发
export function createModelDev(payload: any): Promise<ApiResponse<any>> {
  return request.post('/api/model_dev/create', payload, { showMessage: true });
}

// 更新模型开发
export function updateModelDev(payload: any): Promise<ApiResponse<any>> {
  return request.put('/api/model_dev/update', payload, { showMessage: true });
}

// 删除模型开发
export function deleteModelDev(id: string | number): Promise<ApiResponse<any>> {
  return request.delete('/api/model_dev/delete', { data: { id }, showMessage: true });
}

// 批量删除模型开发
export function batchDeleteModelDev(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete('/api/model_dev/batch_delete', { data: { ids }, showMessage: true });
}

// 查询模型任务日志
export function fetchModelJobLog(job_id: string | number): Promise<ApiResponse<any>> {
  return request.post('/api/model_job/log', { job_id });
}

// 执行任务接口
export function executeJob(params: { job_id: string; run_type: 'debug' | 'formal' }): Promise<ApiResponse<any>> {
  return request.post('/api/model_dev/execute', params, { showMessage: true, messageData: ['data', 'message'] });
}

// 获取算子库树
export function getModelLibraryTree(payload?: Record<string, any>): Promise<ApiResponse<any>> {
  return request.post('/api/model_dev/library_tree', payload || {});
}
