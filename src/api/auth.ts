import { request } from '@/utils/request'

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 登录请求参数
export interface LoginParams {
  username: string
  password: string
}

// 登录响应数据
export interface LoginResult {
  token: string
  userInfo: {
    id: string | number
    username: string
    nickname?: string
    avatar?: string
    roles?: string[]
    permissions?: string[]
  }
}

// 用户登录
export function login(data: LoginParams): Promise<ApiResponse<LoginResult>> {
  return request.post('/api/login', data)
}

// 用户登出
export function logout(): Promise<ApiResponse<any>> {
  return request.post('/api/logout')
}

// 获取用户信息
export function getUserInfo(): Promise<ApiResponse<LoginResult['userInfo']>> {
  return request.get('/api/user/info')
}

// 刷新Token
export function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  return request.post('/api/refresh-token')
}
