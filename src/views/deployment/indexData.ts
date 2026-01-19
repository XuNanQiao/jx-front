import dayjs from 'dayjs';

/* ----------------------detail------------------- */
export const detailColumns = [
  { dataIndex: 'name', title: '名称', key: 'name' },
  { dataIndex: 'version', title: '模型', key: 'version', align: 'center' },
  { dataIndex: 'version', title: '触发方式', key: 'version', align: 'center' },
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
  { dataIndex: 'created_user_id', title: '启动', key: 'created_user_id', align: 'center' },
  { dataIndex: 'action', title: '操作', key: 'action', align: 'center', width: 80 },
];
