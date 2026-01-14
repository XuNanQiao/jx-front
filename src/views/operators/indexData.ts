/*
 * @Author: ZHAO
 * @Date: 2026-01-14 09:05:28
 * @LastEditTime: 2026-01-14 09:46:06
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\operators\indexData.ts
 *
 */
import dayjs from 'dayjs';

const categoryMap: Record<number, string> = {
  0: '基础算子',
  1: '文件读写',
  2: '机器学习',
  3: '信号处理',
};

export const tableColumns = [
  { dataIndex: 'name', title: '名称', key: 'name' },
  { dataIndex: 'run_env', title: '运行环境', align: 'center' },
  { dataIndex: 'created_time', title: '创建时间', align: 'center', customRender: ({ text }) => (text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-') },
  { dataIndex: 'created_user_id', title: '创建人', align: 'center' },
  { dataIndex: 'action', title: '操作', key: 'action', align: 'center' },
];

export const treeDataVal: any = [
  {
    title: '系统算子库',
    key: '0-0',
    children: [
      {
        title: '基础算子',
        key: '0',
      },
      { title: '文件读写', key: '1' },
      {
        title: '机器学习',
        key: '2',
      },
      {
        title: '信号处理',
        key: '3',
      },
    ],
  },
  {
    title: '用户算子库',
    key: '0-1',
  },
];
export const treeData = () => {
  return JSON.parse(JSON.stringify(treeDataVal));
};
// 属性选项
export const versionOptions: SelectOption[] = [
  { label: '0.2.5', value: '1' },
  { label: '0.2.6', value: '2' },
];
