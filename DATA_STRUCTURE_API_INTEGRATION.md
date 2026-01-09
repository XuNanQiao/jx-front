# 数据结构列表 API 集成文档

## 概述

本文档说明了数据结构列表功能如何集成真实的后端 API 接口。

## API 接口规范

### 数据结构列表查询接口

**路径**: `GET /api/model_input_output/data_struct/retrieve`

**请求参数**:
```typescript
{
  model_input_output_id: string | number; // 模型输入输出ID（必填）
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {
        "id": "1",
        "column": "temperature",
        "name": "温度",
        "data_type": "FLOAT",
        "model_input_output_id": 123,
        "created_time": "2024-01-01 10:00:00",
        "created_user_id": "user001"
      }
    ],
    "total": 10
  }
}
```

或者简化格式（直接返回数组）:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "1",
      "column": "temperature",
      "name": "温度",
      "data_type": "FLOAT",
      "model_input_output_id": 123,
      "created_time": "2024-01-01 10:00:00",
      "created_user_id": "user001"
    }
  ]
}
```

## 前端实现

### 1. API 接口定义 ([src/api/inputOutput.ts](src/api/inputOutput.ts))

```typescript
// 数据结构列表查询接口 - 使用真实后端 API
export function getDataStructureList(model_input_output_id: string | number): Promise<ApiResponse<any>> {
  return request.get("/api/model_input_output/data_struct/retrieve", {
    params: { model_input_output_id },
  });
}
```

**特点**:
- 使用 GET 请求
- 通过查询参数传递 `model_input_output_id`
- 返回标准的 `ApiResponse` 格式

### 2. 数据结构组件 ([src/views/InputOutput/tabs/DataStructure.vue](src/views/InputOutput/tabs/DataStructure.vue))

#### 获取路由参数

```typescript
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 获取当前模型输入输出的ID
const modelInputOutputId = computed(() => (route.params.id as string) || "");
```

**说明**:
- 从路由参数 `route.params.id` 中获取父级模型输入输出的ID
- 使用 `computed` 确保响应式更新

#### 加载数据逻辑

```typescript
const loadData = async () => {
  if (!modelInputOutputId.value) {
    message.error("缺少模型输入输出ID参数");
    return;
  }

  loading.value = true;
  try {
    console.log("📤 正在加载数据结构列表，model_input_output_id:", modelInputOutputId.value);
    const res: any = await getDataStructureList(modelInputOutputId.value);
    console.log("📥 数据结构列表响应:", res);

    if (res?.code === 200) {
      // 后端返回的数据可能在 res.data.items 或 res.data
      const items = res.data?.items || res.data || [];
      dataSource.value = items;
      pagination.total = res.data?.total || items.length;
      console.log("✅ 数据结构列表加载成功，共", pagination.total, "条");
    } else {
      message.error(res?.message || "加载数据失败");
      console.error("❌ 数据结构列表加载失败:", res);
    }
  } catch (err: any) {
    console.error("❌ 数据结构列表加载错误:", err);
    message.error(err?.message || "加载数据失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};
```

**特点**:
- 参数验证：检查 `modelInputOutputId` 是否存在
- 兼容两种数据格式：
  - `res.data.items` + `res.data.total` (分页格式)
  - `res.data` 直接返回数组
- 详细的日志记录（仅在开发环境）
- 完善的错误处理和用户提示

#### 搜索过滤逻辑

```typescript
// 筛选后的数据
const filteredData = computed(() => {
  let result = [...dataSource.value];

  // 关键词搜索
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    result = result.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const column = item.column?.toLowerCase() || "";
      // 支持 dataType 和 data_type 两种字段名
      const dataType = (item.dataType || item.data_type || "").toLowerCase();
      return name.includes(keyword) || column.includes(keyword) || dataType.includes(keyword);
    });
  }
  // 更新分页总数
  pagination.total = result.length;
  return result;
});
```

**特点**:
- 兼容驼峰命名（`dataType`）和下划线命名（`data_type`）
- 支持对名称、列名、数据类型的模糊搜索
- 安全的空值处理

### 3. TypeScript 类型定义 ([src/types/model.ts](src/types/model.ts))

```typescript
// 模型输入输出数据结构
export interface DataStructure {
  id: string
  column: string // 列名
  name: string // 显示名称
  dataType?: string // 数据类型（驼峰命名，兼容旧代码）
  data_type?: string // 数据类型（下划线命名，后端返回）
  modelInputOutputId?: number // 模型输入输出主键ID（驼峰命名）
  model_input_output_id?: number // 模型输入输出主键ID（下划线命名）
  createdTime?: string // 创建时间（驼峰命名）
  created_time?: string // 创建时间（下划线命名）
  createdUserId?: string // 创建人（驼峰命名）
  created_user_id?: string // 创建人（下划线命名）
  updatedTime?: string // 更新时间（驼峰命名）
  updated_time?: string // 更新时间（下划线命名）
  updatedUserId?: string // 更新人（驼峰命名）
  updated_user_id?: string // 更新人（下划线命名）
}
```

**特点**:
- 同时支持驼峰命名和下划线命名
- 所有字段都是可选的（使用 `?`），增强灵活性
- 保证前后端数据结构的兼容性

## 字段命名转换

### 后端 → 前端

后端使用下划线命名，前端类型定义同时支持两种命名方式：

| 前端字段（驼峰） | 后端字段（下划线） | 说明 |
|----------------|------------------|------|
| `dataType` | `data_type` | 数据类型 |
| `modelInputOutputId` | `model_input_output_id` | 模型输入输出ID |
| `createdTime` | `created_time` | 创建时间 |
| `createdUserId` | `created_user_id` | 创建人ID |
| `updatedTime` | `updated_time` | 更新时间 |
| `updatedUserId` | `updated_user_id` | 更新人ID |

### 使用示例

```typescript
// 后端返回的数据
const backendData = {
  id: "1",
  column: "temperature",
  name: "温度",
  data_type: "FLOAT",
  model_input_output_id: 123,
  created_time: "2024-01-01 10:00:00",
  created_user_id: "user001"
};

// TypeScript 类型检查通过
const item: DataStructure = backendData;

// 访问字段时兼容两种命名
const dataType = item.data_type || item.dataType;
```

## 完整的数据流

### 1. 用户访问详情页

1. 用户在列表页点击某条记录的名称
2. 路由跳转到 `/input-output/detail/:id`
3. Detail.vue 组件加载，展示基础信息和各个 Tab

### 2. 切换到数据结构 Tab

1. 用户点击"数据结构" Tab
2. DataStructure.vue 组件挂载
3. 触发 `onMounted(() => loadData())`

### 3. 加载数据

1. 从 `route.params.id` 获取模型输入输出ID
2. 调用 `getDataStructureList(modelInputOutputId.value)`
3. 发送 GET 请求：`/api/model_input_output/data_struct/retrieve?model_input_output_id=123`
4. 后端返回数据结构列表

### 4. 渲染数据

1. 解析响应数据（兼容两种格式）
2. 更新 `dataSource.value` 和 `pagination.total`
3. 表格自动渲染数据

### 5. 用户搜索

1. 用户输入搜索关键词
2. 防抖 300ms 后更新 `filters.keyword`
3. `filteredData` 计算属性自动重新计算
4. 表格显示过滤后的数据

## 错误处理

### 1. 缺少ID参数

```typescript
if (!modelInputOutputId.value) {
  message.error("缺少模型输入输出ID参数");
  return;
}
```

### 2. 网络错误

```typescript
catch (err: any) {
  console.error("❌ 数据结构列表加载错误:", err);
  message.error(err?.message || "加载数据失败，请稍后重试");
}
```

### 3. 业务错误

```typescript
if (res?.code === 200) {
  // 成功处理
} else {
  message.error(res?.message || "加载数据失败");
  console.error("❌ 数据结构列表加载失败:", res);
}
```

## 用户体验优化

### 1. 加载状态

```typescript
const loading = ref(false);

loading.value = true;
try {
  // 加载数据
} finally {
  loading.value = false;
}
```

表格组件会自动显示加载动画：
```vue
<a-table :loading="loading" ... />
```

### 2. 控制台日志

开发环境下提供详细的日志记录：

```
📤 正在加载数据结构列表，model_input_output_id: 123
📥 数据结构列表响应: { code: 200, data: [...] }
✅ 数据结构列表加载成功，共 10 条
```

### 3. 用户提示

```typescript
// 成功提示
console.log("✅ 数据结构列表加载成功，共", pagination.total, "条");

// 错误提示
message.error("加载数据失败");
message.error(res?.message || "加载数据失败");
message.error(err?.message || "加载数据失败，请稍后重试");
```

## 调试指南

### 开发环境日志

在浏览器控制台可以看到详细的请求日志：

```
📤 发起请求: {
  method: "GET",
  url: "/api/model_input_output/data_struct/retrieve",
  fullURL: "http://localhost:3002/api/model_input_output/data_struct/retrieve?model_input_output_id=123",
  params: { model_input_output_id: "123" }
}

📥 收到响应: {
  status: 200,
  code: 200,
  message: "success",
  data: { items: [...], total: 10 }
}

📤 正在加载数据结构列表，model_input_output_id: 123
📥 数据结构列表响应: { code: 200, data: { items: [...], total: 10 } }
✅ 数据结构列表加载成功，共 10 条
```

### 常见问题排查

#### Q1: 列表数据为空

**可能原因**:
1. 后端没有该模型输入输出的数据结构数据
2. `model_input_output_id` 参数不正确

**解决方法**:
1. 检查控制台日志中的 `model_input_output_id` 是否正确
2. 检查后端响应数据是否为空数组
3. 在后端数据库中验证是否有对应的数据

#### Q2: 字段显示为 undefined

**可能原因**: 后端返回的字段名与前端类型定义不匹配

**解决方法**:
1. 检查后端返回的字段名（`data_type` vs `dataType`）
2. 使用兼容代码：`item.data_type || item.dataType`
3. 更新 TypeScript 类型定义以支持两种命名

#### Q3: 搜索功能不工作

**可能原因**: 搜索字段访问了不存在的属性

**解决方法**:
1. 检查 `filteredData` 中的字段访问是否安全
2. 使用可选链和空值合并：`item.data_type || item.dataType || ""`

## 测试步骤

### 1. 列表加载测试

1. 访问模型输入输出列表页
2. 点击任意记录的名称进入详情页
3. 点击"数据结构" Tab
4. 验证数据是否正确加载
5. 检查控制台日志确认请求成功

### 2. 搜索功能测试

1. 在数据结构 Tab 中
2. 在搜索框输入关键词（如"温度"、"temp"）
3. 验证表格数据实时过滤
4. 清空搜索框，验证显示全部数据

### 3. 分页功能测试

1. 如果数据超过10条
2. 测试翻页功能
3. 测试切换每页显示数量
4. 验证分页状态正确

## 总结

数据结构列表功能已成功集成真实的后端 API 接口：

- ✅ 使用真实接口：`GET /api/model_input_output/data_struct/retrieve`
- ✅ 从路由参数获取 `model_input_output_id`
- ✅ 兼容两种数据格式（分页格式和数组格式）
- ✅ 兼容两种字段命名（驼峰和下划线）
- ✅ 完善的错误处理和用户提示
- ✅ 详细的控制台日志（开发环境）
- ✅ 支持关键词搜索过滤
- ✅ 加载状态显示

确保前后端数据交互的稳定性和用户体验的流畅性。
