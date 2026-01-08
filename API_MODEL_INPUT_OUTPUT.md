# 模型输入输出 API 文档

## 列表查询接口

### 接口信息

- **路径**: `/api/model_input_output/retrieve`
- **方法**: `POST`
- **描述**: 查询模型输入输出列表，支持分页、搜索和筛选

### 请求参数

**Content-Type**: `application/json`

```typescript
interface ListQueryParams {
  current?: number      // 当前页码，默认：1
  pageSize?: number     // 每页数量，默认：10
  keyword?: string      // 搜索关键词（搜索名称、属性、类别）
  category?: string     // 类别筛选（图像、文本、音频等）
  [key: string]: any    // 其他自定义筛选参数
}
```

**请求示例**:

```json
{
  "current": 1,
  "pageSize": 10,
  "keyword": "模型A",
  "category": "图像"
}
```

### 响应数据

**成功响应** (200):

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": "1",
        "name": "模型A输入数据",
        "attribute": "输入",
        "category": "图像",
        "integrity": 85,
        "dataInput": "2024-01-15 10:30:00",
        "dataInputTrend": [120, 132, 101, 134, 90, 230, 210],
        "cycleTime": 1000,
        "createdTime": "2024-01-10 09:00:00",
        "createdUserId": "张三"
      }
    ],
    "total": 100,
    "current": 1,
    "pageSize": 10
  }
}
```

**错误响应**:

```json
{
  "code": 400,
  "message": "参数错误",
  "data": null
}
```

## 数据模型

### ModelInputOutput

| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 记录ID |
| name | string | 模型名称 |
| attribute | string | 属性（输入/输出） |
| category | string | 类别（图像/文本/音频） |
| integrity | number | 完整度（0-100） |
| dataInput | string | 数据输入时间 |
| dataInputTrend | number[] | 数据输入趋势（用于图表） |
| cycleTime | number | 周期时间（毫秒） |
| createdTime | string | 创建时间 |
| createdUserId | string | 创建用户 |

## 前端使用示例

### 1. API 调用

```typescript
import { getList, type ListQueryParams } from "@/api/inputOutput";

// 构建查询参数
const params: ListQueryParams = {
  current: 1,
  pageSize: 10,
  keyword: "模型A",
  category: "图像",
};

// 调用接口
const response = await getList(params);

if (response.code === 200) {
  const { list, total } = response.data;
  console.log("数据列表:", list);
  console.log("总数:", total);
}
```

### 2. 组件集成

```vue
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getList, type ListQueryParams } from "@/api/inputOutput";

const loading = ref(false);
const dataSource = ref([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const filters = reactive({
  keyword: "",
  category: undefined,
});

const loadData = async () => {
  loading.value = true;
  try {
    const params: ListQueryParams = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      keyword: filters.keyword || undefined,
      category: filters.category || undefined,
    };

    const res = await getList(params);

    if (res?.code === 200) {
      dataSource.value = res.data.list;
      pagination.total = res.data.total;
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>
```

## 功能特性

### 1. 服务端分页

- 由后端处理分页逻辑
- 减少前端数据量
- 提升性能

### 2. 关键词搜索

支持搜索以下字段：
- 名称 (name)
- 属性 (attribute)
- 类别 (category)

**特点**:
- 不区分大小写
- 模糊匹配
- 前端防抖（300ms）

### 3. 类别筛选

可筛选的类别：
- 图像
- 文本
- 音频

### 4. 实时刷新

- 搜索/筛选时自动重置到第一页
- 保存成功后自动刷新列表
- 支持手动刷新

## Mock 数据

开发环境使用 Mock 数据，位于 `mock/inputOutput.ts`

**Mock 数据特点**:
- 支持完整的分页逻辑
- 支持关键词搜索
- 支持类别筛选
- 返回格式与真实接口一致

**切换到真实接口**:

1. 修改 `vite.config.ts`，禁用 Mock:
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: false,  // 改为 false
  logger: true
})
```

2. 确保后端接口地址正确:
```typescript
// .env.development
VITE_API_BASE_URL=''  // 使用代理

// vite.config.ts - proxy 配置
proxy: {
  '/api': {
    target: 'http://10.80.1.45:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## 接口调试

### 开发环境日志

开发环境会自动打印请求和响应日志：

```
[API Request] POST /api/model_input_output/retrieve
{
  params: undefined,
  data: { current: 1, pageSize: 10, keyword: "模型A" },
  headers: { Authorization: "Bearer token..." }
}

[API Response] POST /api/model_input_output/retrieve
{
  code: 200,
  message: "查询成功",
  data: { list: [...], total: 3 }
}
```

### 浏览器调试

1. 打开开发者工具 (F12)
2. 切换到 Network 标签
3. 筛选 XHR 请求
4. 查找 `model_input_output/retrieve`
5. 检查 Request Payload 和 Response

## 错误处理

### 常见错误

1. **401 Unauthorized** - Token 无效或过期
   - 自动清除 token 并跳转到登录页

2. **400 Bad Request** - 请求参数错误
   - 检查参数格式和类型

3. **500 Internal Server Error** - 服务器错误
   - 查看后端日志

4. **Network Error** - 网络连接失败
   - 检查代理配置
   - 确认后端服务是否运行

### 错误处理示例

```typescript
try {
  const res = await getList(params);

  if (res?.code === 200) {
    // 成功处理
    dataSource.value = res.data.list;
  } else {
    // 业务错误
    message.error(res?.message || "查询失败");
  }
} catch (err) {
  // 网络错误
  console.error(err);
  message.error("网络请求失败");
}
```

## 性能优化

### 1. 防抖搜索

搜索输入添加 300ms 防抖，减少不必要的请求：

```typescript
const debouncedSearch = debounce(() => {
  filters.keyword = searchKeyword.value;
  pagination.current = 1;
  loadData();
}, 300);
```

### 2. 服务端分页

- 减少一次性加载的数据量
- 提升首屏加载速度
- 降低内存占用

### 3. 请求取消

建议在组件卸载时取消进行中的请求：

```typescript
import { ref, onUnmounted } from "vue";

const controller = ref<AbortController>();

const loadData = async () => {
  // 取消之前的请求
  controller.value?.abort();

  // 创建新的 controller
  controller.value = new AbortController();

  const params = { /* ... */ };
  await getList(params);
};

onUnmounted(() => {
  controller.value?.abort();
});
```

## 相关文件

| 文件 | 说明 |
|------|------|
| `src/api/inputOutput.ts` | API 接口定义 |
| `src/views/InputOutput/index.vue` | 列表页面组件 |
| `mock/inputOutput.ts` | Mock 数据 |
| `src/utils/request.ts` | 请求拦截器 |
| `src/types/model.ts` | 类型定义 |

## 更新日志

### 2026-01-07

- ✅ 新增 POST `/api/model_input_output/retrieve` 接口
- ✅ 支持服务端分页
- ✅ 支持关键词搜索
- ✅ 支持类别筛选
- ✅ 添加 Mock 数据支持
- ✅ 优化前端防抖搜索
- ✅ 完善错误处理
