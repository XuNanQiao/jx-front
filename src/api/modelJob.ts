import { request } from "@/utils/request";

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface JobListQueryParams {
  page?: number; // 页码
  size?: number; // 每页数量
  name?: string; // 名称关键词
  category?: string | number; // 分类等(兼容旧字段)
  status?: number; // 作业状态:0-待执行,1-执行中,2-执行成功,3-执行失败
  [key: string]: any; // 其他筛选参数
}

// 作业计划查询参数
export interface JobPlanQueryParams {
  model_id?: string | number; // 模型ID
  time_start?: string; // 开始时间
  time_end?: string; // 结束时间
  [key: string]: any;
}

// 作业计划数据项
export interface JobPlanItem {
  name: string; // 作业名称
  data_start_time: number; // 开始时间戳(毫秒)
  data_end_time: number; // 结束时间戳(毫秒)
  status: "0" | "1" | "2" | "3" | "4"; // 作业状态:0-待执行,1-执行中,2-执行成功,3-执行失败,4-其他
  [key: string]: any;
}

// 作业计划响应数据
export interface JobPlanResponse {
  items: JobPlanItem[];
  total?: number;
}

// 模型作业列表查询
export function getModelJobList(params?: JobListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_job/retrieve", params || {});
}

// 删除单个模型作业
export function deleteModelJob(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_job/delete", { data: { id }, showMessage: true, messageData: ["data", "message"] });
}

// 批量删除模型作业
export function batchDeleteModelJob(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete("/api/model_job/batch_delete", {
    data: { ids },
    showMessage: true,
    messageData: ["data", "message"],
  });
}

// 获取作业计划数据
export function getModelJobPlan(params?: JobPlanQueryParams): Promise<ApiResponse<JobPlanResponse>> {
  return request.post("/api/model_job/plan", params || {});
}
