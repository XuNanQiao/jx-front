/**
 * 表单相关类型定义
 * 统一管理所有表单相关的类型
 */

// ==================== 通用选项类型 ====================

/**
 * 下拉选项
 */
interface SelectOption {
  label: string;
  value: any;
}

// ==================== 表单字段配置 ====================

/**
 * 验证规则
 */
interface ValidationRule {
  required?: boolean;
  message?: string;
  type?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: any, value: any) => Promise<void>;
  trigger?: string | string[];
}

/**
 * 自定义渲染上下文
 */
interface CustomRenderCtx {
  text: any;
  record: Record<string, any>;
}

/**
 * 字段项配置
 */
interface FieldItem {
  label: string;
  key: string;
  type?: "input" | "select" | "switch" | "number" | "link" | "checkbox";
  mode?: "multiple" | "tags";
  options?: SelectOption[];
  rules?: ValidationRule[];
  editSlot?: string;
  slot?: string;
  span?: number; // 字段占据的列数（24栅格系统）
  labelSpan?: number; // 标签占据的列数
  customRender?: (ctx: CustomRenderCtx) => any;
}

/**
 * 模块项配置
 */
interface ModuleItem {
  title: string;
  key: string;
  fields: FieldItem[];
}

// ==================== 数据库配置相关 ====================

/**
 * 数据库配置表单
 */
interface DatabaseConfigForm {
  id?: string;
  database_category: string;
  database_connection_config: Record<string, any>;
  model_input_output_id?: number;
}

/**
 * 依赖包配置
 */
interface Dependency {
  name: string;
  version?: string;
  [key: string]: any;
}

/**
 * 通用表单数据
 */
interface FormData {
  [key: string]: any;
}
