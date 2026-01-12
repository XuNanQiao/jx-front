import { ModelInputOutput, DataStructure } from "@/types/model";
import type { TableColumnType } from "ant-design-vue";
import dayjs from "dayjs";
/**
 * ===================================
 * 表格列配置
 * ===================================
 */

// 模型输入输出列表表格列
export const columns: TableColumnType<ModelInputOutput>[] = [
  { title: "名称", dataIndex: "name", key: "name", sorter: true },
  { title: "属性", dataIndex: "attribute", key: "attribute", width: 120, align: "center" },
  { title: "类别", dataIndex: "category", key: "category", width: 120, align: "center", customRender: ({ text }) => (text == "1" ? "系统" : "台账") },
  { title: "完整度", dataIndex: "integrity", key: "integrity", align: "center" },
  { title: "数据输入", dataIndex: "data_input", key: "dataInput", align: "center" },
  { title: "周期（毫秒）", dataIndex: "cycle_time", key: "cycleTime", width: 120, align: "center", customRender: ({ text }) => text + "ms" },
  { title: "创建时间", dataIndex: "created_time", key: "createdTime", sorter: true, width: 180, customRender: ({ text }) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-") },
  { title: "创建人", dataIndex: "created_user_id", key: "createdUserId", width: 120, align: "center" },
  { title: "操作", key: "action", fixed: "right", width: 70 },
];

// 数据结构表格列
export const columnsDataStructure: TableColumnType<DataStructure>[] = [
  { title: "列名", dataIndex: "column", key: "column", sorter: true },
  { title: "显示名称", dataIndex: "name", key: "name", sorter: true },
  { title: "数据类型", dataIndex: "data_type", key: "dataType" },
  { title: "创建时间", dataIndex: "created_time", key: "createdTime" },
  { title: "创建人", dataIndex: "created_user_id", key: "createdUserId" },
  { title: "操作", key: "action", fixed: "right", width: 100 },
];

// 数据浏览表格基础列（固定列）
export const DataBrowseColumns = [
  { title: "序号", key: "index", width: 80, customRender: ({ index }) => index + 1 },
  { title: "设备", dataIndex: "name", key: "device", width: 150 },
  { title: "时间", dataIndex: "created_time", key: "time", width: 180, customRender: ({ text }) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-") },
];

/**
 * ===================================
 * 选项配置
 * ===================================
 */

// 输入输出类型选项
export const selectOptions: SelectOption[] = [
  { label: "输入", value: "输入" },
  { label: "输出", value: "输出" },
];

// 属性选项
export const attributeOptions: SelectOption[] = [
  { label: "系统", value: "1" },
  { label: "台账", value: "2" },
];
// 属性选项
export const allColumnsOptions: SelectOption[] = [
  { label: "序号", value: "index" },
  { label: "设备", value: "device" },
  { label: "时间", value: "time" },
];

/**
 * ===================================
 * 字段配置（用于详情页面）
 * ===================================
 */

// 基础信息字段
export const basicFields: FieldConfig[] = [
  { key: "name", label: "名称" },
  { key: "display_name", label: "显示名称" },
  { key: "data_type", label: "数据类型", sort: "dataType" },
  { key: "default_device", label: "使用默认设备", sort: "defaultDevice" },
  { key: "database_category", label: "存储引擎", sort: "storageEngine" },
  { key: "cycle_time", label: "数据周期(ms)", sort: "cycleTime" },
];

// 数据保留字段
export const retentionFields: FieldConfig[] = [
  { key: "batch_retention", label: "批量数据保留", sort: "retention" },
  { key: "stream_retention", label: "流式数据保留", sort: "retention" },
  { key: "archive_batch_retention", label: "归档数批保留", sort: "retention" },
];

// 数据保留选项
export const retentionOptions: SelectOption[] = [
  { label: "不启用", value: "0" },
  { label: "永久保留", value: "-1" },
];

// 其他信息字段
export const otherFields: FieldConfig[] = [
  { key: "created_time", label: "创建人 / 创建时间", sort: "created" },
  { key: "scope", label: "可用范围" },
  { key: "custom_pk", label: "自定义主键" },
  { key: "ledger", label: "关联台账" },
  { key: "mock_cycle", label: "Mock周期" },
  { key: "category", label: "类别", sort: "category" },
  { key: "attribute", label: "输入输出类型" },
];
