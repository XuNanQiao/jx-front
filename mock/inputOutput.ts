import { MockMethod } from 'vite-plugin-mock'

const list = [
  {
    id: '1',
    name: '模型A输入数据',
    attribute: '输入',
    category: '图像',
    completeness: 85,
    dataInput: '2024-01-15 10:30:00',
    dataInputTrend: [120, 132, 101, 134, 90, 230, 210],
    cycle: 1000,
    createTime: '2024-01-10 09:00:00',
    createBy: '张三',
  },
  {
    id: '2',
    name: '模型B输出数据',
    attribute: '输出',
    category: '文本',
    completeness: 92,
    dataInput: '2024-01-16 14:20:00',
    dataInputTrend: [220, 182, 191, 234, 290, 330, 310],
    cycle: 500,
    createTime: '2024-01-12 11:30:00',
    createBy: '李四',
  },
  {
    id: '3',
    name: '模型C输入数据',
    attribute: '输入',
    category: '音频',
    completeness: 78,
    dataInput: '2024-01-17 16:45:00',
    dataInputTrend: [150, 232, 201, 154, 190, 330, 410],
    cycle: 2000,
    createTime: '2024-01-14 15:20:00',
    createBy: '王五',
  },
]

export default [
  {
    url: '/api/input-output/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: list,
      }
    },
  },
  {
    url: '/api/input-output/detail',
    method: 'get',
    response: ({ query }) => {
      const { id } = query || {};
      const item = list.find((i) => i.id === id) || null;
      return {
        code: 200,
        message: 'success',
        data: item,
      };
    },
  },
  {
    url: '/api/input-output/update/:id',
    method: 'put',
    response: ({ body, params }) => {
      const id = params?.id;
      const idx = list.findIndex((i) => i.id === id);
      if (idx > -1) {
        list[idx] = Object.assign({}, list[idx], body);
        return {
          code: 200,
          message: 'updated',
          data: list[idx],
        };
      }
      return {
        code: 404,
        message: 'not found',
        data: null,
      };
    },
  },
] as MockMethod[]
