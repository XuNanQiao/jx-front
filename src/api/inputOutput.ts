import { DataBrowseParams } from "@/types/model";
import { request } from "@/utils/request";

// 重新导出类型以便其他模块使用
export type { DataBrowseParams };

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
/* -------------------------列表-------------------------------- */
// 列表查询参数
export interface ListQueryParams {
  size?: number; // 当前页码
  page?: number; // 每页数量
  keyword?: string; // 搜索关键词
  category?: string; // 类别筛选
  [key: string]: any; // 其他筛选参数
}

// 模型输入输出列表
export function getList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/retrieve", params || {});
}

// 详情查询接口 - 通过真实后端 API 获取数据
export function getDetail(id: string): Promise<ApiResponse<any>> {
  return request.post(`/api/model_input_output/detail`, { id });
}

// 创建接口
export function createItem(payload: any): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/create", payload, { showMessage: true });
}

// 更新接口
export function updateItem(payload: any): Promise<ApiResponse<any>> {
  delete payload.updated_user_id;
  return request.put("/api/model_input_output/update", payload, { showMessage: true });
}

// 删除接口
export function deleteItem(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_input_output/delete", { data: { id }, showMessage: true });
}

// 批量删除接口
export function batchDeleteItems(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete("/api/model_input_output/batch_delete", {
    data: { ids },
    showMessage: true,
  });
}
/* -------------------------数据结构-------------------------------- */

// 数据结构相关 API
// 数据结构列表查询接口 - 使用真实后端 API
export function getDataStructureList(params: any): Promise<ApiResponse<any>> {
  return request.get("/api/model_input_output/data_struct/retrieve", { params: params });
}
export function createDataStructure(payload: any): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/data_struct/create", payload, { showMessage: true });
}

export function updateDataStructure(id: string, payload: any): Promise<ApiResponse<any>> {
  return request.put(`/api/model_input_output/data_struct/update`, { id, ...payload }, { showMessage: true });
}

// 数据结构删除接口 - 使用真实后端 API
export function deleteDataStructure(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_input_output/data_struct/delete", { data: { id }, showMessage: true });
}

// 数据结构批量删除接口
export function batchDeleteDataStructures(ids: (string | number)[]): Promise<ApiResponse<any>> {
  return request.delete("/api/model_input_output/data_struct/batch_delete", {
    data: { ids },
    showMessage: true,
  });
}
/* -------------------------数据完整度-------------------------------- */

// 数据完整度查询
export type CompletenessParams = {
  year?: number | string;
  month?: number | string;
  day?: string;
  metric?: string;
};

export function getCompleteness(params: CompletenessParams): Promise<ApiResponse<any[]>> {
  return request.get("/input-output/completeness", { params });
}
/* -------------------------数据库配置-------------------------------- */

// 数据库配置相关 API
export function getDatabaseConfig(model_input_output_id: number): Promise<ApiResponse<any>> {
  return request.get("/input-output/database-config", { params: { model_input_output_id } });
}

export function createDatabaseConfig(payload: any): Promise<ApiResponse<any>> {
  return request.post("/input-output/database-config/create", payload, { showMessage: true });
}

export function updateDatabaseConfig(id: string, payload: any): Promise<ApiResponse<any>> {
  return request.put(`/input-output/database-config/update/${id}`, payload, { showMessage: true });
}

export function deleteDatabaseConfig(id: string): Promise<ApiResponse<any>> {
  return request.delete(`/input-output/database-config/delete/${id}`, { showMessage: true });
}
/* -------------------------数据浏览-------------------------------- */

// 数据浏览相关 API

export function getBrowseData(params: DataBrowseParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/data_browsing/retrieve", params);
}

export function getDeviceInstances(): Promise<ApiResponse<any[]>> {
  return request.get("/input-output/device-instances");
}

export function getDataColumns(device_instance?: string): Promise<ApiResponse<any[]>> {
  return request.get("/input-output/data-columns", { params: { device_instance } });
}
