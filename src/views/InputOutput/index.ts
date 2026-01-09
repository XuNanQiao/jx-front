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
    dataIndex: "data_input",
    key: "dataInput",
    width: 180,
  },
  {
    title: "周期（毫秒）",
    dataIndex: "cycle_time",
    key: "cycleTime",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "created_time",
    key: "createdTime",
    sorter: true,
    width: 180,
  },
  {
    title: "创建人",
    dataIndex: "created_user_id",
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
  { label: "输入", value: "输入" },
  { label: "输出", value: "输出" },
];

// 属性选项（用于表单）
export const attributeOptions: SelectOption[] = [
  { label: "系统", value: "1" },
  { label: "台账", value: "2" },
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
    dataIndex: "data_type",
    key: "dataType",
    sorter: true,
  },
  {
    title: "创建时间",
    dataIndex: "created_time",
    key: "createdTime",
    sorter: true,
  },
  {
    title: "创建人",
    dataIndex: "created_user_id",
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
  { key: "display_name", label: "显示名称" },
  { key: "data_type", label: "数据类型", sort: "dataType" },
  { key: "default_device", label: "使用默认设备", sort: "defaultDevice" },
  { key: "data_type", label: "存储引擎", sort: "storageEngine" },
  { key: "cycle_time", label: "数据周期(ms)" },
];

export const retentionFields = [
  { key: "batch_retention", label: "批量数据保留" },
  { key: "stream_retention", label: "流式数据保留" },
  { key: "archive_batch_retention", label: "归档数批保留" },
];

export const otherFields = [
  { key: "created_time", label: "创建人 / 创建时间" },
  { key: "scope", label: "可用范围" },
  { key: "custom_pk", label: "自定义主键" },
  { key: "ledger", label: "关联台账" },
  { key: "mock_cycle", label: "Mock周期" },
  { key: "category", label: "类别" },
  { key: "attribute", label: "输入输出类型" },
];
/* -------模型输入输出 - 数据浏览--------------- */
// 表格配置
export const DataBrowseColumns = [
  {
    title: "序号",
    key: "index",
    width: 80,
    fixed: "left",
  },
  {
    title: "设备",
    dataIndex: "device",
    key: "device",
    width: 150,
    sorter: true,
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 180,
    sorter: true,
  },
  {
    title: "温度(°C)",
    dataIndex: "temperature",
    key: "temperature",
    width: 120,
  },
  {
    title: "湿度(%)",
    dataIndex: "humidity",
    key: "humidity",
    width: 120,
  },
  {
    title: "压力(Pa)",
    dataIndex: "pressure",
    key: "pressure",
    width: 120,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
  },
];
