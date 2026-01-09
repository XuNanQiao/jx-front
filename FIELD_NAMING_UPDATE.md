# 字段命名规范更新文档

## 更新说明

将 `index.ts` 文件中的所有字段名从驼峰命名（camelCase）改为下划线命名（snake_case），以匹配后端 API 返回的数据结构。

## 修改详情

### 1. 表格列定义 (columns)

#### 修改的字段

| 原字段名 | 新字段名 | 说明 |
|---------|---------|------|
| `dataInput` | `data_input` | 数据输入 |

**注意**：
- `dataIndex` - 改为下划线（与后端数据字段一致）
- `key` - 保持驼峰（前端内部使用）

```typescript
// 修改后
{
  title: "数据输入",
  dataIndex: "data_input",  // 下划线：与后端返回的数据字段一致
  key: "dataInput",         // 驼峰：前端内部标识
  width: 180,
}
```

### 2. 数据结构表格列定义 (columnsDataStructure)

#### 修改的字段

| 原字段名 | 新字段名 | 说明 |
|---------|---------|------|
| `dataType` | `data_type` | 数据类型 |
| `createdTime` | `created_time` | 创建时间 |
| `createdUserId` | `created_user_id` | 创建人ID |

```typescript
// 修改后
export const columnsDataStructure: TableColumnType<DataStructure>[] = [
  // ...
  {
    title: "数据类型",
    dataIndex: "data_type",      // 改为下划线
    key: "dataType",             // key 保持驼峰
    sorter: true,
  },
  {
    title: "创建时间",
    dataIndex: "created_time",   // 改为下划线
    key: "createdTime",          // key 保持驼峰
    sorter: true,
  },
  {
    title: "创建人",
    dataIndex: "created_user_id", // 改为下划线
    key: "createdUserId",        // key 保持驼峰
  },
  // ...
];
```

### 3. 基础信息字段 (basicFields)

#### 修改的字段

| 原字段名 | 新字段名 | 说明 |
|---------|---------|------|
| `displayName` | `display_name` | 显示名称 |
| `dataType` | `data_type` | 数据类型 |
| `defaultDevice` | `default_device` | 使用默认设备 |
| `storageEngine` | `storage_engine` | 存储引擎 |
| `dataCycle` | `data_cycle` | 数据周期 |

```typescript
// 修改后
export const basicFields = [
  { key: "name", label: "名称" },
  { key: "display_name", label: "显示名称" },
  { key: "data_type", label: "数据类型" },
  { key: "default_device", label: "使用默认设备" },
  { key: "storage_engine", label: "存储引擎" },
  { key: "data_cycle", label: "数据周期" },
];
```

**修正**：同时修正了 "星示名称" 的错别字为 "显示名称"

### 4. 数据保留字段 (retentionFields)

#### 修改的字段

| 原字段名 | 新字段名 | 说明 |
|---------|---------|------|
| `batchRetention` | `batch_retention` | 批量数据保留 |
| `streamRetention` | `stream_retention` | 流式数据保留 |
| `archiveBatchRetention` | `archive_batch_retention` | 归档数批保留 |

```typescript
// 修改后
export const retentionFields = [
  { key: "batch_retention", label: "批量数据保留" },
  { key: "stream_retention", label: "流式数据保留" },
  { key: "archive_batch_retention", label: "归档数批保留" },
];
```

### 5. 其他信息字段 (otherFields)

#### 修改的字段

| 原字段名 | 新字段名 | 说明 |
|---------|---------|------|
| `customPK` | `custom_pk` | 自定义主键 |
| `mockCycle` | `mock_cycle` | Mock周期 |
| `ioType` | `io_type` | 输入输出类型 |

```typescript
// 修改后
export const otherFields = [
  { key: "created", label: "创建人 / 创建时间" },
  { key: "scope", label: "可用范围" },
  { key: "custom_pk", label: "自定义主键" },
  { key: "ledger", label: "关联台账" },
  { key: "mock_cycle", label: "Mock周期" },
  { key: "category", label: "类别" },
  { key: "io_type", label: "输入输出类型" },
];
```

## 完整字段映射表

### 表格列字段
| 模块 | 原驼峰命名 | 新下划线命名 |
|------|-----------|------------|
| 主表格 | `dataInput` | `data_input` |
| 数据结构表格 | `dataType` | `data_type` |
| 数据结构表格 | `createdTime` | `created_time` |
| 数据结构表格 | `createdUserId` | `created_user_id` |

### 表单字段
| 模块 | 原驼峰命名 | 新下划线命名 |
|------|-----------|------------|
| 基础信息 | `displayName` | `display_name` |
| 基础信息 | `dataType` | `data_type` |
| 基础信息 | `defaultDevice` | `default_device` |
| 基础信息 | `storageEngine` | `storage_engine` |
| 基础信息 | `dataCycle` | `data_cycle` |
| 数据保留 | `batchRetention` | `batch_retention` |
| 数据保留 | `streamRetention` | `stream_retention` |
| 数据保留 | `archiveBatchRetention` | `archive_batch_retention` |
| 其他信息 | `customPK` | `custom_pk` |
| 其他信息 | `mockCycle` | `mock_cycle` |
| 其他信息 | `ioType` | `io_type` |

## 使用示例

### 表格数据渲染

后端返回的数据结构：
```json
{
  "id": 1,
  "name": "温度传感器",
  "data_input": "实时数据",
  "cycle_time": 1000,
  "created_time": "2024-01-01 10:00:00",
  "created_user_id": 123
}
```

表格会自动根据 `dataIndex` 从数据中提取对应字段：
```typescript
{
  dataIndex: "data_input",  // 自动映射到 record.data_input
  key: "dataInput",         // 前端内部使用的唯一标识
}
```

### 表单数据绑定

BasicInfo 组件中使用：
```vue
<template>
  <a-descriptions-item :label="field.label">
    <a-input v-model:value="form[field.key]" />
  </a-descriptions-item>
</template>

<script setup lang="ts">
// basicFields 定义
const basicFields = [
  { key: "display_name", label: "显示名称" },
  // ...
];

// 表单数据从后端获取
const form = {
  name: "温度传感器",
  display_name: "温度显示",     // 使用下划线
  data_type: "FLOAT",          // 使用下划线
  default_device: true,        // 使用下划线
  // ...
};

// 通过 form[field.key] 访问：form["display_name"]
</script>
```

## 重要注意事项

### 1. dataIndex vs key 的区别

- **`dataIndex`**: 必须与后端返回的数据字段名完全一致（下划线命名）
- **`key`**: 前端内部使用的唯一标识（驼峰命名，用于 React/Vue key 属性）

```typescript
{
  dataIndex: "created_time",  // 从 record.created_time 读取数据
  key: "createdTime",         // Vue/React 的 key 属性使用
}
```

### 2. 表单字段 key

表单字段的 `key` 直接用于数据绑定，必须与后端字段名一致：

```typescript
// ✅ 正确
const basicFields = [
  { key: "display_name", label: "显示名称" }
];

// form 数据结构
const form = {
  display_name: "xxx"  // 与 key 一致
};
```

### 3. 后端数据结构要求

确保后端返回的 JSON 数据使用下划线命名：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "display_name": "温度显示",
    "data_type": "FLOAT",
    "created_time": "2024-01-01",
    "created_user_id": 123
  }
}
```

## 影响的组件

以下组件会受到此次修改的影响：

- ✅ **InputOutput/index.vue** - 主列表表格
- ✅ **InputOutput/tabs/BasicInfo.vue** - 基础信息表单
- ✅ **InputOutput/tabs/DataStructure.vue** - 数据结构表格

## 测试建议

### 1. 主列表测试
- 访问模型输入输出列表页
- 检查 "数据输入"、"周期"、"创建时间"、"创建人" 列是否正常显示
- 检查浏览器控制台是否有字段未定义的警告

### 2. 详情页测试
- 点击任意记录的详情
- 检查基础信息 Tab 的所有字段是否正常显示
- 尝试编辑保存，确认数据正确提交

### 3. 数据结构测试
- 访问数据结构 Tab
- 检查表格列是否正常显示
- 检查编辑表单是否正常工作

## 后续优化

如果后端字段较多，建议使用自动转换工具：

```typescript
// utils/fieldConverter.ts
export const convertToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// 自动生成字段配置
const generateFields = (fields: string[]) => {
  return fields.map(field => ({
    key: convertToSnakeCase(field),
    label: getLabel(field)
  }));
};
```

## 总结

所有字段已成功从驼峰命名转换为下划线命名，确保与后端 API 数据结构完全一致。这样可以：

1. ✅ 避免字段名不匹配导致的数据显示问题
2. ✅ 提高代码的规范性和可维护性
3. ✅ 减少前后端数据转换的复杂度
4. ✅ 符合 RESTful API 的命名规范
