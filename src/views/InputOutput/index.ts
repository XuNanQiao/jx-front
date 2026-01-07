import { ModelInputOutput, DataStructure } from "@/types/model";
import type { TableColumnType, TableProps } from "ant-design-vue";

// 选项接口
export interface SelectOption {
  label: string;
  value: string;
}

// 表格列定义
export const columns: TableColumnType<ModelInputOutput>[] = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    sorter: true,
    width: 150,
  },
  {
    title: "属性",
    dataIndex: "attribute",
    key: "attribute",
    width: 120,
  },
  {
    title: "类别",
    dataIndex: "category",
    key: "category",
    width: 120,
  },
  {
    title: "完整度",
    dataIndex: "integrity",
    key: "integrity",
    width: 150,
  },
  {
    title: "数据输入",
    dataIndex: "dataInput",
    key: "dataInput",
    width: 180,
  },
  {
    title: "周期（毫秒）",
    dataIndex: "cycleTime",
    key: "cycleTime",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    key: "createdTime",
    sorter: true,
    width: 180,
  },
  {
    title: "创建人",
    dataIndex: "createdUserId",
    key: "createdUserId",
    width: 120,
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 70,
  },
];
export const selectOptions = [ 
  { label: "输入", value: "input" },
  { label: "输出", value: "output" },
];

// 属性选项（用于表单）
export const attributeOptions: SelectOption[] = [
  { label: "输入", value: "输入" },
  { label: "输出", value: "输出" },
];

/* -------------------------- */
// 数据结构表格列定义
export const columnsDataStructure: TableColumnType<DataStructure>[] = [
  {
    title: "列名",
    dataIndex: "column",
    key: "column",
    sorter: true,
  },
  {
    title: "显示名称",
    dataIndex: "name",
    key: "name",
    sorter: true,
  },
  {
    title: "数据类型",
    dataIndex: "dataType",
    key: "dataType",
  },
  {
    title: "创建时间",
    dataIndex: "createdTime",
    key: "createdTime",
    sorter: true,
  },
  {
    title: "创建人",
    dataIndex: "createdUserId",
    key: "createdUserId",
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 100,
  },
];
export const basicFields = [
  { key: "name", label: "名称" },
  { key: "displayName", label: "星示名称" },
  { key: "dataType", label: "数据类型" },
  { key: "defaultDevice", label: "使用默认设备" },
  { key: "storageEngine", label: "存储引擎" },
  { key: "dataCycle", label: "数据周期" },
];

export const retentionFields = [
  { key: "batchRetention", label: "批量数据保留" },
  { key: "streamRetention", label: "流式数据保留" },
  { key: "archiveBatchRetention", label: "归档数批保留" },
];

export const otherFields = [
  { key: "created", label: "创建人 / 创建时间" },
  { key: "scope", label: "可用范围" },
  { key: "customPK", label: "自定义主键" },
  { key: "ledger", label: "关联台账" },
  { key: "mockCycle", label: "Mock周期" },
  { key: "category", label: "类别" },
  { key: "ioType", label: "输入输出类型" },
];
