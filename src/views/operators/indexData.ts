import { TreeProps } from "ant-design-vue";
import dayjs from "dayjs";

export const tableColumns = [
  { dataIndex: "name", title: "名称", key: "name" },
  { dataIndex: "un_env", title: "运行环境", align: "center" },
  { dataIndex: "created_time", title: "创建时间", align: "center", customRender: ({ text }) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-") },
  { dataIndex: "created_user_id", title: "创建人", align: "center" },
  { dataIndex: "action", title: "操作", key: "action", align: "center" },
];

export const treeData = [
  {
    title: "系统算子库",
    key: "0-0",
    children: [
      {
        title: "基础算子",
        key: "0",
      },
      {
        title: "文本编码",
        key: "1",
      },
      {
        title: "机器学习",
        key: "2",
      },
      {
        title: "信号处理",
        key: "3",
      },
    ],
  },
  {
    title: "用户算子库",
    key: "0-1",
  },
];
// 属性选项
export const versionOptions: SelectOption[] = [
  { label: "0.2.5", value: "1" },
  { label: "0.2.6", value: "2" },
];
/* ----------------------detail------------------- */
export const detailColumns = [
  { dataIndex: "name", title: "名称", key: "name" },
  { dataIndex: "version", title: "版本", align: "center" },
  { dataIndex: "data_type", title: "扩展信息", align: "center" },
  { dataIndex: "category", title: "类别", align: "center" },
  { dataIndex: "editor", title: "编辑器", align: "center" },
  { dataIndex: "reated_time", title: "创建时间", align: "center", customRender: ({ text }) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-") },
  { dataIndex: "reated_user_id", title: "创建人", align: "center" },
  { dataIndex: "action", title: "操作", key: "action" },
];
export const selectOptions: SelectOption[] = [
  { label: "其他", value: "0" },
  { label: "风机", value: "1" },
  { label: "光伏", value: "2" },
  { label: "电气", value: "3" },
];
export const editorOptions: SelectOption[] = [{ label: "canvas", value: "0" }];
export const extendedOptions: SelectOption[] = [
  { label: "未配置", value: "1" },
  { label: "已配置", value: "2" },
];
/* ----------------basicFields----------------- */
export const basicFields = [
  {
    title: "基础信息",
    key: "basicInfo",
    fields: [
      { label: "名称", key: "name", sort: "default", type: "input" },
      { label: "显示名称", key: "name", sort: "default", type: "input" },
      { label: "版本号", key: "version", sort: "default", type: "input" },
      { label: "类别", key: "category", sort: "default", type: "select", options: selectOptions },
      { label: "语言", key: "language", sort: "default", type: "input" },
      { label: "编辑器", key: "editor", sort: "default", type: "input" },
      { label: "设备类型", key: "levice_type", sort: "default", type: "input" },
      { label: "扩展信息", key: "extended_info", sort: "default", type: "input" },
    ],
  },
  {
    title: "其他信息",
    key: "otherFields",
    fields: [
      { label: "创建人", key: "created_user_id", sort: "default" },
      { label: "创建时间", key: "created_time", sort: "default" },
      { label: "可用范围", key: "version", sort: "default" },
      { label: "备注", key: "category", sort: "default" },
    ],
  },
];
export const packageFields = [
  {
    title: "算子库",
    fields: [
      { label: "依赖包", key: "name" },
      { label: "版本号", key: "name" },
    ],
  },
  {
    title: "第三方",
    fields: [
      { label: "依赖包", key: "name", type: "link", editSlot: "package" },
      { label: "版本号", key: "name" },
    ],
  },
];
export const browseColumns = [
  { dataIndex: "name", title: "作业名称", key: "name" },
  { dataIndex: "name", title: "模型/部署", key: "name" },
  { dataIndex: "name", title: "输入", key: "name" },
  { dataIndex: "name", title: "输出", key: "name" },
  { dataIndex: "name", title: "数据时间（时长）", key: "name" },
  { dataIndex: "data_rows_nums", title: "数据行", key: "name" },
  { dataIndex: "status", title: "状态", key: "name" },
  { dataIndex: "name", title: "作业时间（时长）", key: "name" },
  { dataIndex: "created_user_id", title: "创建人", key: "name" },
  { dataIndex: "action", title: "操作", key: "action" },
];
