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
