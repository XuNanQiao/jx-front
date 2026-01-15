/*
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:51
 * @LastEditTime: 2026-01-14 17:46:12
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\development\indexData.ts
 *
 */
// import { TreeProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

const formatDateTime = (value: dayjs.ConfigType) => (value && dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-');

const formatDurationWithStart = (start: dayjs.ConfigType, end: dayjs.ConfigType) => {
  const startTime = start ? dayjs(start) : null;
  const endTime = end ? dayjs(end) : null;

  if (!startTime || !startTime.isValid()) return '-';

  const base = formatDateTime(startTime);
  if (!endTime || !endTime.isValid()) return base;

  let diffSeconds = endTime.diff(startTime, 'second');
  if (diffSeconds < 0) diffSeconds = 0;

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}天`);
  if (hours) parts.push(`${hours}小时`);
  if (parts.length < 2 && minutes) parts.push(`${minutes}分`);
  if (parts.length < 2 && seconds) parts.push(`${seconds}秒`);

  if (!parts.length) parts.push('0秒');

  return `${base}（${parts.join('')}）`;
};

export const selectOptions: SelectOption[] = [
  { label: '其他', value: 0 },
  { label: '风机', value: 1 },
  { label: '光伏', value: 2 },
  { label: '电气', value: 3 },
];
// 作业状态选项
export const statusOptions: SelectOption[] = [
  { label: '待执行', value: 0 },
  { label: '执行中', value: 1 },
  { label: '执行成功', value: 2 },
  { label: '执行失败', value: 3 },
];
export const statusMap: Record<string | number, { text: string; color: string }> = {
  0: { text: '待执行', color: 'default' },
  1: { text: '执行中', color: 'processing' },
  2: { text: '成功', color: 'success' },
  3: { text: '失败', color: 'error' },
};
export const editorOptions: SelectOption[] = [{ label: 'canvas', value: 0 }];
export const extendedOptions: SelectOption[] = [
  { label: '未配置', value: false },
  { label: '已配置', value: true },
];

// 编程语言选项（默认 python32）
export const languageOptions: SelectOption[] = [
  { label: 'python32', value: 'python32' },
  { label: 'python3', value: 'python3' },
  { label: 'nodejs', value: 'nodejs' },
  { label: 'java', value: 'java' },
  { label: 'go', value: 'go' },
];

// 设备类型选项（需求：options: 0 - None）
export const deviceTypeOptions: SelectOption[] = [{ label: 'None', value: 0 }];

/* ----------------------detail------------------- */
export const detailColumns = [
  { dataIndex: 'name', title: '模型名称', key: 'name' },
  { dataIndex: 'version', title: '模型版本', key: 'version', align: 'center' },
  {
    dataIndex: 'extension_info',
    title: '扩展信息',
    key: 'extension_info',
    align: 'center',
    customRender: ({ record }: any) => {
      const enabled = record?.extension_info === true;
      const text = enabled ? '已配置' : '未配置';
      const color = enabled ? 'success' : 'error';
      return h(Tag, { color }, () => text);
    },
  },

  {
    dataIndex: 'category',
    title: '分类',
    key: 'category',
    align: 'center',
    customRender: ({ text }: any) => selectOptions.find((opt) => String(opt.value) === String(text))?.label || '-',
  },
  {
    dataIndex: 'editor',
    title: '编辑器',
    key: 'editor',
    align: 'center',
    customRender: ({ text }: any) => editorOptions.find((opt) => String(opt.value) === String(text))?.label || '-',
  },
  { dataIndex: 'created_time', title: '创建时间', key: 'created_time', align: 'center', customRender: ({ text }: any) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-') },
  { dataIndex: 'created_user_id', title: '创建人', key: 'created_user_id', align: 'center' },
  { dataIndex: 'action', title: '操作', key: 'action', align: 'center', width: 80 },
];
// OperatorPanel 下拉项
export const repoOptions: SelectOption[] = [
  { label: 'repo-a', value: 'repo-a' },
  { label: 'repo-b', value: 'repo-b' },
];

export const columnOptions: SelectOption[] = [
  { label: 'col1', value: 'col1' },
  { label: 'col2', value: 'col2' },
  { label: 'col3', value: 'col3' },
];

export const aggregateOptions: SelectOption[] = [
  { label: '求和', value: 'sum' },
  { label: '平均', value: 'avg' },
  { label: '最大', value: 'max' },
  { label: '最小', value: 'min' },
];

export const granularityOptions: SelectOption[] = [
  { label: '分钟', value: 'minute' },
  { label: '小时', value: 'hour' },
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '季度', value: 'quarter' },
  { label: '年', value: 'year' },
];
/* ----------------basicFields----------------- */

export const basicFields = [
  {
    title: '基础信息',
    key: 'basicInfo',
    fields: [
      { label: '模型名称', key: 'name', sort: 'default', type: 'input' },
      { label: '显示名称', key: 'name', sort: 'default', type: 'input' },
      { label: '模型版本', key: 'version', sort: 'default', type: 'input' },
      {
        label: '类别',
        key: 'category',
        sort: 'default',
        type: 'select',
        options: selectOptions,
        customRender: ({ text }: any) => selectOptions.find((opt) => String(opt.value) === String(text))?.label || '-',
      },
      {
        label: '编辑器',
        key: 'editor',
        sort: 'default',
        type: 'select',
        options: editorOptions,
        customRender: ({ text }: any) => editorOptions.find((opt) => String(opt.value) === String(text))?.label || '-',
      },
      { label: '编程语言', key: 'language', sort: 'default', type: 'select', options: languageOptions },
      {
        label: '设备类型',
        key: 'device_type',
        sort: 'default',
        type: 'select',
        options: deviceTypeOptions,
        customRender: ({ text }: any) => deviceTypeOptions.find((opt) => String(opt.value) === String(text))?.label || '-',
      },
      {
        label: '扩展信息',
        key: 'extension_info',
        sort: 'default',
        type: 'select',
        options: extendedOptions,
        customRender: ({ record }: any) => {
          const enabled = record?.extension_info === true;
          const text = enabled ? '已配置' : '未配置';
          const color = enabled ? 'success' : 'error';
          return h(Tag, { color }, () => text);
        },
      },
    ],
  },
  {
    title: '其他信息',
    key: 'otherFields',
    fields: [
      { label: '创建人', key: 'created_user_id', sort: 'default' },
      { label: '创建时间', key: 'created_time', sort: 'default', customRender: ({ text }: any) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-') },
      { label: '可用范围', key: 'version', sort: 'default' },
      { label: '备注', key: 'category', sort: 'default' },
    ],
  },
];
export const packageFields = [
  {
    title: '算子库',
    fields: [
      { label: '依赖包', key: 'name' },
      { label: '版本号', key: 'name' },
    ],
  },
  {
    title: '第三方',
    fields: [
      { label: '依赖包', key: 'name', type: 'link', editSlot: 'package' },
      { label: '版本号', key: 'name' },
    ],
  },
];
/* ----------------basicFields----------------- */
export const browseColumns = [
  { dataIndex: 'name', title: '作业名称', key: 'name' },
  { dataIndex: 'name', title: '模型/部署', key: 'name', align: 'center' },
  { dataIndex: 'name', title: '输入Repo', key: 'name', align: 'center' },
  { dataIndex: 'name', title: '输出Repo', key: 'name', align: 'center' },
  {
    dataIndex: 'data_start_time',
    title: '数据时间（时长）',
    key: 'data_start_time',
    customRender: ({ record }: any) => formatDurationWithStart(record?.data_start_time, record?.data_end_time),
  },
  { dataIndex: 'data_rows_nums', title: '数据行', key: 'name', align: 'center' },
  {
    dataIndex: 'exec_log',
    title: '查看日志',
    key: 'exec_log',
    align: 'center',
  },
  // { dataIndex: 'status', title: '状态', key: 'name' },
  {
    dataIndex: 'exec_start_time',
    title: '作业时间（时长）',
    key: 'name',
    customRender: ({ record }: any) => formatDurationWithStart(record?.exec_start_time, record?.exec_end_time),
  },
  { dataIndex: 'created_user_id', title: '创建人', key: 'name', align: 'center' },
  { dataIndex: 'action', title: '操作', key: 'action', align: 'center' },
];
