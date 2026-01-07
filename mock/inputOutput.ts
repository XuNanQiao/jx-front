import { MockMethod } from 'vite-plugin-mock'

// 模型输入输出列表
const list = [
  {
    id: '1',
    name: '模型A输入数据',
    attribute: '输入',
    category: '图像',
    integrity: 85,
    dataInput: '2024-01-15 10:30:00',
    dataInputTrend: [120, 132, 101, 134, 90, 230, 210],
    cycleTime: 1000,
    createdTime: '2024-01-10 09:00:00',
    createdUserId: '张三',
  },
  {
    id: '2',
    name: '模型B输出数据',
    attribute: '输出',
    category: '文本',
    integrity: 92,
    dataInput: '2024-01-16 14:20:00',
    dataInputTrend: [220, 182, 191, 234, 290, 330, 310],
    cycleTime: 500,
    createdTime: '2024-01-12 11:30:00',
    createdUserId: '李四',
  },
  {
    id: '3',
    name: '模型C输入数据',
    attribute: '输入',
    category: '音频',
    integrity: 78,
    dataInput: '2024-01-17 16:45:00',
    dataInputTrend: [150, 232, 201, 154, 190, 330, 410],
    cycleTime: 2000,
    createdTime: '2024-01-14 15:20:00',
    createdUserId: '王五',
  },
]

// 数据库配置列表
const databaseConfigList = [
  {
    id: '1',
    databaseCategory: 'MySQL',
    connectionConfig: {
      host: 'localhost',
      port: 3306,
      database: 'model_db',
      username: 'root',
      password: '123456',
      charset: 'utf8mb4',
    },
    modelInputOutputId: 1,
    createdTime: '2024-01-10 09:00:00',
    createdUserId: '张三',
  },
  {
    id: '2',
    databaseCategory: 'PostgreSQL',
    connectionConfig: {
      host: '192.168.1.100',
      port: 5432,
      database: 'model_db',
      username: 'postgres',
      password: 'postgres123',
      schema: 'public',
    },
    modelInputOutputId: 2,
    createdTime: '2024-01-12 11:30:00',
    createdUserId: '李四',
  },
  {
    id: '3',
    databaseCategory: 'InfluxDB',
    connectionConfig: {
      url: 'http://localhost:8086',
      token: 'my-token-123456',
      org: 'my-org',
      bucket: 'my-bucket',
    },
    modelInputOutputId: 3,
    createdTime: '2024-01-14 15:20:00',
    createdUserId: '王五',
  },
]

// 数据结构列表
const dataStructureList = [
  {
    id: '1',
    column: 'user_id',
    name: '用户ID',
    dataType: 'integer',
    modelInputOutputId: 1,
    createdTime: '2024-01-10 09:00:00',
    createdUserId: '张三',
  },
  {
    id: '2',
    column: 'user_name',
    name: '用户名称',
    dataType: 'string',
    modelInputOutputId: 1,
    createdTime: '2024-01-10 09:05:00',
    createdUserId: '张三',
  },
  {
    id: '3',
    column: 'created_at',
    name: '创建时间',
    dataType: 'timestamp',
    modelInputOutputId: 1,
    createdTime: '2024-01-10 09:10:00',
    createdUserId: '张三',
  },
  {
    id: '4',
    column: 'is_active',
    name: '是否激活',
    dataType: 'boolean',
    modelInputOutputId: 2,
    createdTime: '2024-01-12 11:30:00',
    createdUserId: '李四',
  },
  {
    id: '5',
    column: 'score',
    name: '评分',
    dataType: 'float',
    modelInputOutputId: 2,
    createdTime: '2024-01-12 11:35:00',
    createdUserId: '李四',
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
  // 数据结构相关接口
  {
    url: '/api/input-output/data-structure/list',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: dataStructureList,
      }
    },
  },
  {
    url: '/api/input-output/data-structure/detail',
    method: 'get',
    response: ({ query }) => {
      const { id } = query || {};
      const item = dataStructureList.find((i) => i.id === id) || null;
      return {
        code: 200,
        message: 'success',
        data: item,
      };
    },
  },
  {
    url: '/api/input-output/data-structure/create',
    method: 'post',
    response: ({ body }) => {
      const newItem = {
        id: String(dataStructureList.length + 1),
        ...body,
        createdTime: new Date().toISOString(),
      };
      dataStructureList.push(newItem);
      return {
        code: 200,
        message: 'created',
        data: newItem,
      };
    },
  },
  {
    url: '/api/input-output/data-structure/update/:id',
    method: 'put',
    response: ({ body, params }) => {
      const id = params?.id;
      const idx = dataStructureList.findIndex((i) => i.id === id);
      if (idx > -1) {
        dataStructureList[idx] = Object.assign({}, dataStructureList[idx], body);
        return {
          code: 200,
          message: 'updated',
          data: dataStructureList[idx],
        };
      }
      return {
        code: 404,
        message: 'not found',
        data: null,
      };
    },
  },
  {
    url: '/api/input-output/data-structure/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      const id = params?.id;
      const idx = dataStructureList.findIndex((i) => i.id === id);
      if (idx > -1) {
        dataStructureList.splice(idx, 1);
        return {
          code: 200,
          message: 'deleted',
          data: null,
        };
      }
      return {
        code: 404,
        message: 'not found',
        data: null,
      };
    },
  },
  // 数据库配置相关接口
  {
    url: '/api/input-output/database-config',
    method: 'get',
    response: ({ query }) => {
      const { modelInputOutputId } = query || {};
      const config = databaseConfigList.find((i) => i.modelInputOutputId === Number(modelInputOutputId)) || null;
      return {
        code: 200,
        message: 'success',
        data: config,
      };
    },
  },
  {
    url: '/api/input-output/database-config/create',
    method: 'post',
    response: ({ body }) => {
      const newConfig = {
        id: String(databaseConfigList.length + 1),
        ...body,
        createdTime: new Date().toISOString(),
      };
      databaseConfigList.push(newConfig);
      return {
        code: 200,
        message: 'created',
        data: newConfig,
      };
    },
  },
  {
    url: '/api/input-output/database-config/update/:id',
    method: 'put',
    response: ({ body, params }) => {
      const id = params?.id;
      const idx = databaseConfigList.findIndex((i) => i.id === id);
      if (idx > -1) {
        databaseConfigList[idx] = Object.assign({}, databaseConfigList[idx], body, {
          updatedTime: new Date().toISOString(),
        });
        return {
          code: 200,
          message: 'updated',
          data: databaseConfigList[idx],
        };
      }
      return {
        code: 404,
        message: 'not found',
        data: null,
      };
    },
  },
  {
    url: '/api/input-output/database-config/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      const id = params?.id;
      const idx = databaseConfigList.findIndex((i) => i.id === id);
      if (idx > -1) {
        databaseConfigList.splice(idx, 1);
        return {
          code: 200,
          message: 'deleted',
          data: null,
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
