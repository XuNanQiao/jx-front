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
