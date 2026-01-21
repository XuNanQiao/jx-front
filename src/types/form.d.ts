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
  key: string | string[]; // 支持字符串或字符串数组（用于嵌套属性）
  type?: "input" | "select" | "switch" | "number" | "link" | "checkbox" | "radio";
  mode?: "multiple" | "tags";
  options?: SelectOption[];
  rules?: ValidationRule[];
  editSlot?: string;
  slot?: string;
  span?: number; // 字段占据的列数（24栅格系统）
  labelSpan?: number; // 标签占据的列数
  unit?: string; // 单位
  min?: number; // 最小值（仅number类型适用）
  max?: number; // 最大值（仅number类型适用）
  step?: number; // 步长（仅number类型适用）
  afterlabel?: string; // 标签后缀
  textType?: string; // 仅在非编辑模式下使用，指定文本类型
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
