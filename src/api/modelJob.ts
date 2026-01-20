import { request } from "@/utils/request";

// 模型作业列表查询
export function getModelJobList(params?: JobListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_job/retrieve", params || {});
}

// 删除单个模型作业
export function deleteModelJob(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_job/delete", { data: { id }, showMessage: true });
}

// 批量删除模型作业
export function batchDeleteModelJob(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete("/api/model_job/batch_delete", { data: { ids }, showMessage: true });
}

// 获取作业计划数据
export function getModelJobPlan(params?: JobPlanQueryParams): Promise<ApiResponse<JobPlanResponse>> {
  return request.post("/api/model_job/plan", params || {});
}
