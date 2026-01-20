/**
 * 表格相关类型定义
 * 统一管理所有表格相关的类型
 */

// ==================== 显示模式 ====================

/**
 * 数据展示模式
 */
export type DisplayMode = "table" | "chart" | "json";

// ==================== 时间范围 ====================

/**
 * 时间范围类型
 */
export type TimeRangeType = "today" | "week" | "month" | "custom" | "all";

// ==================== 排序 ====================

/**
 * 排序方式
 */
export type SortOrder = "asc" | "desc" | "none";

// ==================== 数据完整度 ====================

/**
 * 完整度行数据
 */
interface CompletenessRow {
  metric: string; // 指标名称
  total: number; // 总条数
  complete: number; // 完整条数
  missing: number; // 缺失条数
  completeness: number; // 完整度百分比
  [key: string]: any;
}
