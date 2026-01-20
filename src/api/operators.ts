import { request } from "@/utils/request";

// 算子管理列表 - 使用真实后端接口
export function getList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_operator/retrieve", params || {});
}

// 获取算子源码
export function getSourceCode(id: string | number): Promise<ApiResponse<any>> {
  return request.post("/api/model_operator/source_code", { id });
}
