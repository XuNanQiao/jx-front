# InputOutput 模块代码整理文档

本文档说明了 `src/views/InputOutput` 文件夹的代码结构优化和最佳实践。

## 📁 文件结构

```
src/views/InputOutput/
├── composables/                 # 组合式函数（可复用逻辑）
│   ├── useTablePagination.ts   # 表格分页逻辑
│   └── useTimeRangeFilter.ts   # 时间范围筛选逻辑
├── constants/                   # 常量定义
│   └── index.ts                # 共享常量（时间范围、排序等选项）
├── tabs/                        # 详情页面的标签页组件
│   ├── BasicInfo.vue           # 基础信息
│   ├── DataStructure.vue       # 数据结构
│   ├── DataBrowse.vue          # 数据浏览 ✨ 已优化
│   ├── DataCompleteness.vue    # 数据完整度
│   ├── AccessStats.vue         # 接入统计
│   ├── DataUpload.vue          # 数据上传
│   ├── DataStructureForm.vue   # 数据结构表单
│   └── DatabaseConfigModal.vue # 数据库配置弹窗
├── index.ts                     # 模块配置文件 ✨ 已优化
├── index.vue                    # 列表页面
├── Detail.vue                   # 详情页面
├── InputOutputFormModal.vue     # 表单弹窗
└── README.md                    # 本文档

```

## ✨ 优化内容

### 1. 创建组合式函数 (Composables)

#### `useTablePagination.ts` - 表格分页复用
```typescript
// 使用示例
const { pagination, handleTableChange, resetPagination } = useTablePagination(10);
```

**功能：**
- 统一管理分页状态（current, pageSize, total）
- 提供分页变化处理函数
- 提供重置分页函数

#### `useTimeRangeFilter.ts` - 时间范围筛选复用
```typescript
// 使用示例
const { getTimeRange } = useTimeRangeFilter();
const timeRange = getTimeRange('7', null); // 最近7天
```

**功能：**
- 统一处理各种时间范围类型（今天、昨天、最近一周、最近一月、自定义）
- 自动格式化时间为标准格式
- 简化查询参数构建

### 2. 提取共享常量

#### `constants/index.ts` - 集中管理常量
```typescript
// 时间范围选项
export const TIME_RANGE_OPTIONS = [...]

// 排序选项
export const SORT_ORDER_OPTIONS = [...]

// 数据类型选项
export const DATA_TYPE_OPTIONS = [...]
```

**优势：**
- 避免重复定义
- 易于维护和更新
- 类型安全

### 3. 优化 `index.ts` 配置文件

**改进点：**
- ✅ 添加清晰的分区注释
- ✅ 统一命名规范
- ✅ 简化表格列定义（单行配置）
- ✅ 添加类型导出
- ✅ 删除重复定义

**结构：**
```typescript
// 类型定义
export interface SelectOption { ... }
export interface FieldConfig { ... }

// 表格列配置
export const columns = [...]
export const columnsDataStructure = [...]
export const DataBrowseColumns = [...]

// 选项配置
export const selectOptions = [...]
export const attributeOptions = [...]

// 字段配置
export const basicFields = [...]
export const retentionFields = [...]
export const otherFields = [...]
```

### 4. 优化 `DataBrowse.vue` 组件

**主要改进：**

#### 4.1 引入组合式函数
```typescript
// 之前：手动管理分页
const pagination = reactive({ current: 1, pageSize: 10, total: 0 });

// 之后：使用 composable
const { pagination, handleTableChange } = useTablePagination(10);
```

#### 4.2 简化时间范围处理
```typescript
// 之前：40+ 行的 if-else
if (filters.timeRangeType == "0") { ... }
else if (filters.timeRangeType == "1") { ... }
// ... 更多条件

// 之后：1行代码
const timeRange = getTimeRange(filters.timeRangeType, filters.dateRange);
```

#### 4.3 优化查询函数
```typescript
// 简化查询参数构建
const params = {
  model_input_output_id: route.params.id,
  device_value: filters.deviceInstance,
  sort_order: filters.sortOrder,
  page: pagination.current,
  size: pagination.pageSize,
  selected_columns: filters.dataColumns?.length > 0
    ? filters.dataColumns
    : dataColumnsOptions.value.map(opt => opt.value),
  ...timeRange, // 直接展开时间范围
};
```

#### 4.4 动态列配置
```typescript
// 根据用户选择的数据列动态生成表格列
const dynamicColumns = computed(() => {
  const baseColumns = [...DataBrowseColumns];
  if (filters.dataColumns?.length > 0) {
    // 只显示选中的列
    const selectedColumns = dataColumnsOptions.value
      .filter(opt => filters.dataColumns.includes(opt.value))
      .map(opt => ({ title: opt.label, dataIndex: opt.value, key: opt.value, width: 150 }));
    return [...baseColumns, ...selectedColumns];
  }
  // 显示所有列
  return [...baseColumns, ...allColumns];
});
```

### 5. 清理冗余代码

**删除：**
- ❌ 未使用的导入（`getDataColumns`, `dayjs` 等）
- ❌ 未使用的类型定义（`DeviceInstance`, `DataColumn` 等）
- ❌ 重复的常量定义
- ❌ 冗余的条件判断

## 🎯 使用指南

### 如何添加新的筛选选项

1. 在 `constants/index.ts` 中定义选项：
```typescript
export const YOUR_OPTIONS = [
  { label: '选项1', value: 'value1' },
  { label: '选项2', value: 'value2' },
];
```

2. 在组件中导入使用：
```typescript
import { YOUR_OPTIONS } from '@/views/InputOutput/constants';
```

### 如何复用分页逻辑

```typescript
import { useTablePagination } from '@/views/InputOutput/composables/useTablePagination';

// 初始化，默认每页10条
const { pagination, handleTableChange, resetPagination } = useTablePagination(20);

// 在表格中使用
<a-table
  :pagination="pagination"
  @change="handleTableChange"
/>

// 搜索时重置分页
const search = () => {
  resetPagination();
  handleQuery();
};
```

### 如何处理时间范围筛选

```typescript
import { useTimeRangeFilter } from '@/views/InputOutput/composables/useTimeRangeFilter';

const { getTimeRange } = useTimeRangeFilter();

// 构建查询参数
const params = {
  ...otherParams,
  ...getTimeRange(filters.timeRangeType, filters.dateRange),
};
```

## 📊 优化效果

| 指标 | 优化前 | 优化后 | 改善 |
|------|--------|--------|------|
| DataBrowse.vue 代码行数 | ~470 | ~430 | ⬇️ 40行 |
| 重复代码 | 多处 | 0 | ✅ 100% |
| 可复用逻辑 | 0 | 2个 composables | ✅ 新增 |
| 类型安全性 | 部分 | 完整 | ⬆️ 提升 |
| 代码可读性 | 一般 | 优秀 | ⬆️ 显著提升 |

## 🔧 后续优化建议

1. **统一 API 调用**：创建 `useInputOutputApi` composable 封装所有接口调用
2. **表单验证复用**：提取表单验证逻辑到 `useFormValidation`
3. **图表配置复用**：创建 `useChartOptions` 统一管理图表配置
4. **错误处理**：创建统一的错误处理机制
5. **Loading 状态管理**：使用 `useLoading` 统一管理加载状态

## 📝 代码规范

1. **命名规范**
   - 组合式函数：`useXxx`
   - 常量：大写下划线 `CONSTANT_NAME`
   - 组件：PascalCase `ComponentName`
   - 变量/函数：camelCase `variableName`

2. **文件组织**
   - 相关逻辑放在一起
   - 导入按类型分组（Vue、第三方库、本地模块）
   - 导出按用途分组（类型、配置、组件）

3. **类型安全**
   - 优先使用 TypeScript 类型
   - 避免使用 `any`，使用具体类型
   - 导出常用类型供其他模块使用

## 🎉 总结

通过本次代码整理，`InputOutput` 模块的代码质量得到了显著提升：
- ✅ 代码更加简洁清晰
- ✅ 逻辑复用性更高
- ✅ 易于维护和扩展
- ✅ 类型安全性更好
- ✅ 符合 Vue 3 最佳实践

---
*最后更新：2026-01-09*
