import { request } from "@/utils/request";

// 模型部署列表
export function getModelDeployList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_deploy/retrieve", params || {});
}

// 删除模型部署
export function deleteModelDeploy(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_deploy/delete", { data: { id }, showMessage: true });
}
