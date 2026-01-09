# API 字段命名规范转换文档

## 转换说明

为了与后端接口规范保持一致，将前端 API 接口中的驼峰命名（camelCase）字段转换为下划线命名（snake_case）。

## 完成的修改

### 1. DataBrowseParams 接口 - [inputOutput.ts:93-104](src/api/inputOutput.ts#L93-L104)

#### 修改前
```typescript
export interface DataBrowseParams {
  deviceInstance?: string;
  dataColumns?: string[];
  timeRangeType?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: "asc" | "desc" | "none";
  dataType?: string;
  samplingRate?: number;
  current?: number;
  pageSize?: number;
}
```

#### 修改后
```typescript
export interface DataBrowseParams {
  device_instance?: string;
  data_columns?: string[];
  time_range_type?: string;
  start_date?: string;
  end_date?: string;
  sort_order?: "asc" | "desc" | "none";
  data_type?: string;
  sampling_rate?: number;
  current?: number;
  page_size?: number;
}
```

### 2. getDatabaseConfig 函数参数 - [inputOutput.ts:76-78](src/api/inputOutput.ts#L76-L78)

#### 修改前
```typescript
export function getDatabaseConfig(modelInputOutputId: number): Promise<ApiResponse<any>> {
  return request.get("/input-output/database-config", { params: { modelInputOutputId } });
}
```

#### 修改后
```typescript
export function getDatabaseConfig(model_input_output_id: number): Promise<ApiResponse<any>> {
  return request.get("/input-output/database-config", { params: { model_input_output_id } });
}
```

### 3. getDataColumns 函数参数 - [inputOutput.ts:114-116](src/api/inputOutput.ts#L114-L116)

#### 修改前
```typescript
export function getDataColumns(deviceInstance?: string): Promise<ApiResponse<any[]>> {
  return request.get("/input-output/data-columns", { params: { deviceInstance } });
}
```

#### 修改后
```typescript
export function getDataColumns(device_instance?: string): Promise<ApiResponse<any[]>> {
  return request.get("/input-output/data-columns", { params: { device_instance } });
}
```

### 4. DataBrowse.vue 组件更新 - [DataBrowse.vue:351-366](src/views/InputOutput/tabs/DataBrowse.vue#L351-L366)

#### 修改前
```typescript
const params: DataBrowseParams = {
  deviceInstance: filters.deviceInstance,
  dataColumns: filters.dataColumns,
  timeRangeType: filters.timeRangeType,
  sortOrder: filters.sortOrder,
  dataType: filters.dataType,
  samplingRate: filters.samplingRate,
  current: pagination.current,
  pageSize: pagination.pageSize,
};

if (filters.dateRange && filters.dateRange.length === 2) {
  params.startDate = filters.dateRange[0].format("YYYY-MM-DD");
  params.endDate = filters.dateRange[1].format("YYYY-MM-DD");
}
```

#### 修改后
```typescript
const params: DataBrowseParams = {
  device_instance: filters.deviceInstance,
  data_columns: filters.dataColumns,
  time_range_type: filters.timeRangeType,
  sort_order: filters.sortOrder,
  data_type: filters.dataType,
  sampling_rate: filters.samplingRate,
  current: pagination.current,
  page_size: pagination.pageSize,
};

if (filters.dateRange && filters.dateRange.length === 2) {
  params.start_date = filters.dateRange[0].format("YYYY-MM-DD");
  params.end_date = filters.dateRange[1].format("YYYY-MM-DD");
}
```

## 字段映射对照表

| 原驼峰命名 | 新下划线命名 | 说明 |
|-----------|------------|------|
| `deviceInstance` | `device_instance` | 设备实例 |
| `dataColumns` | `data_columns` | 数据列 |
| `timeRangeType` | `time_range_type` | 时间范围类型 |
| `startDate` | `start_date` | 开始日期 |
| `endDate` | `end_date` | 结束日期 |
| `sortOrder` | `sort_order` | 排序方式 |
| `dataType` | `data_type` | 数据类型 |
| `samplingRate` | `sampling_rate` | 采样频率 |
| `pageSize` | `page_size` | 每页数量 |
| `modelInputOutputId` | `model_input_output_id` | 模型输入输出ID |

## 注意事项

### 1. 前端内部变量命名
前端组件内部的响应式变量、computed、methods 等**保持驼峰命名**（这是 JavaScript/TypeScript 的惯例）：

```typescript
// ✅ 正确：前端内部使用驼峰命名
const filters = reactive({
  deviceInstance: undefined,
  dataColumns: [],
  // ...
});
```

### 2. API 接口字段命名
API 请求的参数和接口定义**使用下划线命名**（符合后端规范）：

```typescript
// ✅ 正确：API 接口使用下划线命名
export interface DataBrowseParams {
  device_instance?: string;
  data_columns?: string[];
  // ...
}
```

### 3. 数据转换
在调用 API 时，需要将前端的驼峰命名转换为下划线命名：

```typescript
// ✅ 正确：转换字段名
const params: DataBrowseParams = {
  device_instance: filters.deviceInstance,  // 驼峰 → 下划线
  data_columns: filters.dataColumns,        // 驼峰 → 下划线
  // ...
};
```

### 4. TypeScript 类型安全
通过更新接口定义，TypeScript 会自动提示正确的字段名，避免拼写错误：

```typescript
// ❌ 错误：使用旧的驼峰命名会报类型错误
const params: DataBrowseParams = {
  deviceInstance: "xxx", // TypeScript 报错
};

// ✅ 正确：使用新的下划线命名
const params: DataBrowseParams = {
  device_instance: "xxx", // TypeScript 通过
};
```

## 验证测试

### 数据浏览功能测试
1. 访问数据浏览页面
2. 选择设备实例、数据列等筛选条件
3. 点击查询按钮
4. 检查浏览器控制台的请求日志：
   ```
   📤 发起请求: {
     url: "/api/input-output/browse-data",
     data: {
       device_instance: "xxx",
       data_columns: ["temp", "humidity"],
       time_range_type: "recent",
       // ...
     }
   }
   ```
5. 确认请求参数使用下划线命名

### 数据库配置功能测试
1. 访问详情页面的基础信息 Tab
2. 点击配置数据库按钮
3. 检查请求参数是否使用 `model_input_output_id`

## 后续建议

### 1. 统一命名规范
建议在项目中创建一个工具函数，自动转换驼峰和下划线命名：

```typescript
// utils/nameConverter.ts
export function camelToSnake(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = camelToSnake(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export function snakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}
```

### 2. 请求拦截器自动转换
在 Axios 拦截器中自动转换命名格式：

```typescript
// 请求拦截器：驼峰 → 下划线
service.interceptors.request.use((config) => {
  if (config.data) {
    config.data = camelToSnake(config.data);
  }
  if (config.params) {
    config.params = camelToSnake(config.params);
  }
  return config;
});

// 响应拦截器：下划线 → 驼峰
service.interceptors.response.use((response) => {
  if (response.data) {
    response.data = snakeToCamel(response.data);
  }
  return response;
});
```

这样前端就可以完全使用驼峰命名，自动转换为后端的下划线命名。

## 影响范围

- ✅ 数据浏览功能
- ✅ 数据库配置功能
- ⚠️ 其他功能需要逐步检查和更新

## 总结

通过这次修改，API 接口字段命名已经符合后端的下划线命名规范，确保前后端数据交互的一致性。后续开发中应遵循相同的命名规范，保持代码的规范性和可维护性。
