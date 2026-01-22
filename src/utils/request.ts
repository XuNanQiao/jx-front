/*
 * @Author: ZHAO
 * @Date: 2026-01-07 16:28:06
 * @LastEditTime: 2026-01-22 17:03:18
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\utils\request.ts
 *
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { message } from "ant-design-vue";

// 扩展 AxiosRequestConfig 类型，添加自定义配置
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  showMessage?: boolean; // 是否在响应拦截器中显示消息提示，默认 false
  showSuccessMessage?: boolean; // 是否显示成功消息，默认 false
  showErrorMessage?: boolean; // 是否显示错误消息，默认 true
  messageData?: string[]; // 指定响应数据中用于消息提示的字段路径数组
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    const config = response.config as CustomAxiosRequestConfig;
    console.log(res, "------res");

    // 如果返回的状态码不是 200，则判断为错误
    if (!res.code && res.code !== 200) {
      console.error("Response error:", res.msg || "Error");

      // 根据配置决定是否显示错误消息
      const shouldShowError =
        config.showErrorMessage !== false && (config.showMessage === true || config.showErrorMessage === true);
      if (shouldShowError) {
        let msg = "";
        if (config.messageData && Array.isArray(config.messageData)) {
          let data = res;
          for (const key of config.messageData) {
            data = data[key];
          }
          msg = data;
        }
        message.error(msg || res.msg || "请求失败，请稍后重试");
      }

      // 401: 未授权，跳转到登录页
      if (res.code === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      }

      return Promise.reject(new Error(res.msg || "Error"));
    }

    // 根据配置决定是否显示成功消息
    const shouldShowSuccess = config.showSuccessMessage === true || config.showMessage === true;
    if (shouldShowSuccess) {
      let msg = "";
      if (config.messageData && Array.isArray(config.messageData)) {
        let data = res;
        for (const key of config.messageData) {
          data = data[key];
        }
        msg = data;
      }
      message.success(msg || res.msg || "请求成功");
    }

    return res;
  },
  (error) => {
    const config = error.config as CustomAxiosRequestConfig;
    // 根据配置决定是否显示错误消息
    const shouldShowError =
      config?.showErrorMessage !== false && (config?.showMessage === true || config?.showErrorMessage === true);
    if (shouldShowError) {
      message.error(error.message || "请求失败，请稍后重试");
    }

    // 处理 401 未授权
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    return service.get(url, config);
  },

  post<T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },

  put<T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },

  delete<T = any>(url: string, config?: CustomAxiosRequestConfig): Promise<T> {
    return service.delete(url, config);
  },
};

export default service;
