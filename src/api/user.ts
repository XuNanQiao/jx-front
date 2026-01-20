import { request } from "@/utils/request";

/**
 * 用户登录
 * @param data 登录表单数据 { username, password }
 */
export function login(data: LoginForm): Promise<ApiResponse<LoginResponse>> {
  return request.post("/api/login", data);
}

/**
 * 用户登出
 */
export function logout(): Promise<ApiResponse<null>> {
  return request.post("/api/logout");
}

/**
 * 获取用户信息
 */
export function getUserInfo(): Promise<ApiResponse<LoginResponse["user"]>> {
  return request.get("/api/user/info");
}
