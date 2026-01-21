/*
 * @Author: ZHAO
 * @Date: 2026-01-20 12:08:46
 * @LastEditTime: 2026-01-21 15:35:40
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\api\auth.ts
 *
 */
import { request } from "@/utils/request";

// 用户登录
export function login(data: LoginParams): Promise<ApiResponse<LoginResult>> {
  return request.post("/api/login", data);
}

// 用户登出
export function logout(): Promise<ApiResponse<any>> {
  return request.post("/api/logout");
}

// 获取用户信息
export function getUserInfo(): Promise<ApiResponse<UserInfo>> {
  return request.get("/api/user/info");
}

// 刷新Token
export function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  return request.post("/api/refresh-token");
}
