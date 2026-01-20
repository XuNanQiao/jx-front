/**
 * ===================================
 * 类型定义统一导出
 * ===================================
 */

// 导出 API 相关类型
export * from './api';

// 导出组件相关类型
export * from './component';

// 导出表单相关类型
export * from './form';

// 导出表格相关类型
export * from './table';

// 导出上传下载相关类型
export * from './upload';

// 导出模型相关类型
export * from './model';

// 导出用户相关类型
export * from './user';

// ===================================
// 全局类型声明（向后兼容）
// ===================================

declare global {
  interface SelectOption {
    label: string;
    value: any;
  }

  interface FieldConfig {
    key: string;
    label: string;
    sort?: string;
  }
}

export {};
