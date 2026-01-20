/**
 * ===================================
 * 类型定义
 * ===================================
 */
interface SelectOption {
  label: string;
  value: string | number | boolean;
}

interface FieldConfig {
  key: string;
  label: string;
  sort?: string;
}

interface ApiResponse<T = any> {
  code: number;
  msg?: string;
  message?: string;
  data: T;
}
