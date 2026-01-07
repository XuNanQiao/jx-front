import { request } from '@/utils/request'

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export function getList(): Promise<ApiResponse<any[]>> {
  return request.get('/input-output/list')
}

export function getDetail(id: string): Promise<ApiResponse<any>> {
  return request.get('/input-output/detail', { params: { id } })
}

export function createItem(payload: any): Promise<ApiResponse<any>> {
  return request.post('/input-output/create', payload)
}

export function updateItem(id: string, payload: any): Promise<ApiResponse<any>> {
  return request.put(`/input-output/update/${id}`, payload)
}

export function deleteItem(id: string): Promise<ApiResponse<any>> {
  return request.delete(`/input-output/delete/${id}`)
}

// 数据结构相关 API
export function getDataStructureList(): Promise<ApiResponse<any[]>> {
  return request.get('/input-output/data-structure/list')
}

export function getDataStructureDetail(id: string): Promise<ApiResponse<any>> {
  return request.get('/input-output/data-structure/detail', { params: { id } })
}

export function createDataStructure(payload: any): Promise<ApiResponse<any>> {
  return request.post('/input-output/data-structure/create', payload)
}

export function updateDataStructure(id: string, payload: any): Promise<ApiResponse<any>> {
  return request.put(`/input-output/data-structure/update/${id}`, payload)
}

export function deleteDataStructure(id: string): Promise<ApiResponse<any>> {
  return request.delete(`/input-output/data-structure/delete/${id}`)
}

// 数据完整度查询
export type CompletenessParams = {
  year?: number | string;
  month?: number | string;
  day?: string;
  metric?: string;
}

export function getCompleteness(params: CompletenessParams): Promise<ApiResponse<any[]>> {
  return request.get('/input-output/completeness', { params })
}

// 数据库配置相关 API
export function getDatabaseConfig(modelInputOutputId: number): Promise<ApiResponse<any>> {
  return request.get('/input-output/database-config', { params: { modelInputOutputId } })
}

export function createDatabaseConfig(payload: any): Promise<ApiResponse<any>> {
  return request.post('/input-output/database-config/create', payload)
}

export function updateDatabaseConfig(id: string, payload: any): Promise<ApiResponse<any>> {
  return request.put(`/input-output/database-config/update/${id}`, payload)
}

export function deleteDatabaseConfig(id: string): Promise<ApiResponse<any>> {
  return request.delete(`/input-output/database-config/delete/${id}`)
}

// 数据浏览相关 API
export interface DataBrowseParams {
  deviceInstance?: string
  dataColumns?: string[]
  timeRangeType?: string
  startDate?: string
  endDate?: string
  sortOrder?: 'asc' | 'desc' | 'none'
  dataType?: string
  samplingRate?: number
  current?: number
  pageSize?: number
}

export function getBrowseData(params: DataBrowseParams): Promise<ApiResponse<any>> {
  return request.get('/input-output/browse-data', { params })
}

export function getDeviceInstances(): Promise<ApiResponse<any[]>> {
  return request.get('/input-output/device-instances')
}

export function getDataColumns(deviceInstance?: string): Promise<ApiResponse<any[]>> {
  return request.get('/input-output/data-columns', { params: { deviceInstance } })
}
