/**
 * InputOutput 模块共享常量
 */

// 时间范围选项
export const TIME_RANGE_OPTIONS = [
  { label: '最近', value: '0' },
  { label: '昨天', value: '1' },
  { label: '最近一周', value: '7' },
  { label: '最近一月', value: '30' },
  { label: '自定义', value: 'custom' },
] as const;

// 排序选项
export const SORT_ORDER_OPTIONS = [
  { label: '正序', value: 'asc' },
  { label: '不排序', value: 'none' },
  { label: '倒序', value: 'desc' },
] as const;

// 数据类型选项
export const DATA_TYPE_OPTIONS = [
  { label: '全部', value: 'all' },
  { label: '实时数据', value: 'realtime' },
  { label: '历史数据', value: 'history' },
] as const;
