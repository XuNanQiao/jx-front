import dayjs from "dayjs";

// 选项定义
export const selectOptions: SelectOption[] = [
  { label: "其他", value: 0 },
  { label: "风机", value: 1 },
  { label: "光伏", value: 2 },
  { label: "电气", value: 3 },
];
// 触发方式选项
export const triggerOptions: SelectOption[] = [
  { label: "定时触发", value: 0 },
  { label: "作业触发", value: 2 },
  { label: "手工触发", value: 1 },
  { label: "自启动", value: 3 },
];
export const retentionOptions: SelectOption[] = [{ label: "指定", value: "指定" }];
export const jobOptions: SelectOption[] = [
  { label: "全部", value: "全部" },
  { label: "指定", value: "指定" },
];
/* ----------------------detail------------------- */
export const detailColumns = () => [
  { dataIndex: "name", title: "名称", key: "name", fixed: "left" },
  { dataIndex: "model_name", title: "模型", key: "model_name", align: "center" },
  {
    dataIndex: "trigger_type",
    title: "触发方式",
    key: "trigger_type",
    align: "center",
    customRender: ({ text }: any) => {
      // 如果是单个值
      return triggerOptions.find((opt) => opt.value === text)?.label || "-";
    },
  },
  {
    dataIndex: "input_config",
    title: "输入Repo",
    key: "input_config",
    align: "left",
    width: 150,
    customRender: ({ text }: { text: any }) => (text?.length ? text[0].repo : "-"),
  },
  {
    dataIndex: "output_config",
    title: "输出Repo",
    key: "output_config",
    align: "left",
    width: 150,
    customRender: ({ text }: { text: any }) => (text?.length ? text[0].repo : "-"),
  },
  {
    title: "创建时间",
    dataIndex: "created_time",
    key: "createdTime",
    width: 150,
    customRender: ({ text }: { text: any }) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-"),
  },

  { dataIndex: "created_user_id", title: "创建人", key: "created_user_id", align: "center" },
  { dataIndex: "is_active", title: "启动", key: "is_active", align: "center" },
  { dataIndex: "action", title: "操作", key: "action", align: "center", width: 80, fixed: "right" },
];

export const basicFields = () => {
  return [
    {
      title: "基础信息",
      key: "basicInfo",
      fields: [
        {
          label: "模型名称",
          key: "name",
          type: "input",
          rules: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
        },
        { label: "显示名称", key: "display_name", type: "input" },
        { label: "运行环境", key: "runtime_env", type: "input", span: 9, labelSpan: 7 },
        { afterlabel: "复用容器", key: "is reuse container", type: "switch", span: 3, labelSpan: 14 },
        {
          label: "触发方式",
          key: "trigger_type",
          type: "radio",
          options: triggerOptions,
          rules: [{ required: true, message: "请至少选择一种触发方式", trigger: "change" }],
          customRender: ({ text }: any) => {
            if (!text) return "-";
            // 如果是数组，显示多个标签
            if (Array.isArray(text)) {
              return text
                .map((val) => triggerOptions.find((opt) => opt.value === val)?.label)
                .filter(Boolean)
                .join("、");
            }
            // 如果是单个值
            return triggerOptions.find((opt) => opt.value === text)?.label || "-";
          },
        },
        {
          label: "执行周期",
          key: ["trigger_config", "next_run"],
          editSlot: "cycleEditor",
          type: "input",
        },
        {
          label: "作业保留数",
          key: "job_retained_numbers",
          type: "input",
          options: jobOptions,
          editSlot: "jobRetentionEditor",
          customRender: ({ text }: any) => {
            if (!text) return "-";
            return text === -1 ? "全部" : text;
          },
        },
      ],
    },
    {
      title: "其他信息",
      key: "otherFields",
      fields: [
        { label: "创建人", key: "created_user_id" },
        {
          label: "创建时间",
          key: "created_time",

          customRender: ({ text }: { text: any }) => (text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-"),
        },
        { label: "可用范围", key: "available_range" },
        { label: "备注", key: "remark" },
      ],
    },
  ];
};
export const basicInp = () => {
  // 使用深拷贝确保每次调用都返回全新的对象，避免多个配置共享引用
  return JSON.parse(
    JSON.stringify([
      { label: "Repo", key: "repo", type: "select", span: 9 },
      { label: "数据列", key: "data_columns", type: "select", span: 9, mode: "multiple" },
      { label: "设备实例", key: "device_instance", type: "select", span: 9, mode: "multiple" },
      { label: "数据时间", key: "data_time", type: "select", options: jobOptions, span: 5, labelSpan: 10 },
      { label: "窗口长度", key: "window_length", type: "number", unit: "M", min: 1, span: 5, labelSpan: 10 },
      { label: "对齐时间", key: "alignment_time", type: "number", unit: "M", min: 1, span: 5, labelSpan: 10 },
    ]),
  );
};
