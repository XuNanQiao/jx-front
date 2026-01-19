import dayjs from 'dayjs';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

// 选项定义
export const selectOptions: SelectOption[] = [
  { label: '其他', value: 0 },
  { label: '风机', value: 1 },
  { label: '光伏', value: 2 },
  { label: '电气', value: 3 },
];

export const editorOptions: SelectOption[] = [{ label: 'canvas', value: 0 }];

export const extendedOptions: SelectOption[] = [
  { label: '未配置', value: false },
  { label: '已配置', value: true },
];

export const languageOptions: SelectOption[] = [
  { label: 'python32', value: 'python32' },
  { label: 'python3', value: 'python3' },
  { label: 'nodejs', value: 'nodejs' },
  { label: 'java', value: 'java' },
  { label: 'go', value: 'go' },
];

export const deviceTypeOptions: SelectOption[] = [{ label: 'None', value: 0 }];

// 触发方式选项
export const triggerOptions: SelectOption[] = [
  { label: '定时触发', value: 'scheduled' },
  { label: '作业触发', value: 'job' },
  { label: '手工触发', value: 'manual' },
  { label: '自启动', value: 'auto' },
];

/* ----------------------detail------------------- */
export const detailColumns = [
  { dataIndex: 'name', title: '名称', key: 'name' },
  { dataIndex: 'version', title: '模型', key: 'version', align: 'center' },
  {
    dataIndex: 'trigger_type',
    title: '触发方式',
    key: 'trigger_type',
    align: 'center',
    customRender: ({ text }: any) => {
      if (!text) return '-';
      // 如果是数组，显示多个标签
      if (Array.isArray(text)) {
        return text
          .map((val) => triggerOptions.find((opt) => opt.value === val)?.label)
          .filter(Boolean)
          .join('、');
      }
      // 如果是单个值
      return triggerOptions.find((opt) => opt.value === text)?.label || '-';
    },
  },
  { dataIndex: 'input_repo', title: '输入Repo', key: 'input_repo', align: 'left' },
  { dataIndex: 'output_repo', title: '输出Repo', key: 'output_repo', align: 'left' },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'createdTime',
    sorter: true,
    width: 150,
    customRender: ({ text }) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'),
  },

  { dataIndex: 'created_user_id', title: '创建人', key: 'created_user_id', align: 'center' },
  { dataIndex: 'is_active', title: '启动', key: 'is_active', align: 'center' },
  { dataIndex: 'action', title: '操作', key: 'action', align: 'center', width: 80 },
];

export const basicFields = [
  {
    title: '基础信息',
    key: 'basicInfo',
    fields: [
      {
        label: '模型名称',
        key: 'name',

        type: 'input',
        rules: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
      },
      { label: '显示名称', key: 'display_name', type: 'input' },
      { label: '运行环境', key: 'runtime_env', type: 'input' },
      {
        label: '触发方式',
        key: 'trigger_type',

        type: 'checkbox',
        options: triggerOptions,
        rules: [{ required: true, type: 'array', message: '请至少选择一种触发方式', trigger: 'change' }],
        customRender: ({ text }: any) => {
          if (!text) return '-';
          // 如果是数组，显示多个标签
          if (Array.isArray(text)) {
            return text
              .map((val) => triggerOptions.find((opt) => opt.value === val)?.label)
              .filter(Boolean)
              .join('、');
          }
          // 如果是单个值
          return triggerOptions.find((opt) => opt.value === text)?.label || '-';
        },
      },
      {
        label: '执行周期',
        key: 'cycle',
        editSlot: 'cycleEditor',
        type: 'input',
      },
      { label: '作业保留数', key: 'job_retention', type: 'input' },
    ],
  },
  {
    title: '其他信息',
    key: 'otherFields',
    fields: [
      { label: '创建人', key: 'created_user_id', sort: 'default' },
      {
        label: '创建时间',
        key: 'created_time',

        customRender: ({ text }: any) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-'),
      },
      { label: '可用范围', key: 'available_range', sort: 'default' },
      { label: '备注', key: 'remark', sort: 'default' },
    ],
  },
];
