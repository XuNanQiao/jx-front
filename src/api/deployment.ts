import { request } from "@/utils/request";

// 模型部署列表
export function getModelDeployList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_deploy/retrieve", params || {});
}

// 模型部署详情
export function getModelDeployDetail(id: string | number): Promise<ApiResponse<any>> {
  return request.post("/api/model_deploy/detail", { id });
}

// 更新模型部署
export function updateModelDeploy(payload: any): Promise<ApiResponse<any>> {
  return request.put("/api/model_deploy/update", payload, { showMessage: true });
}

// 删除模型部署
export function deleteModelDeploy(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_deploy/delete", { data: { id }, showMessage: true });
}

// 批量删除模型部署
export function batchDeleteModelDeploy(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete("/api/model_deploy/batch_delete", { data: { ids }, showMessage: true });
}
// 模型部署作业
export function getDeployJobList(params: any): Promise<ApiResponse<any>> {
  return request.post("/api/model_deploy/jobs", params);
}

// 保存/复制模型部署
export function saveModelDeploy(payload: any): Promise<ApiResponse<any>> {
  return request.post("/api/model_deploy/create", payload, { showMessage: true });
}
