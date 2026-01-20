# 类型定义整理文档

本文档记录了项目类型定义的整理工作，包括新创建的类型文件和整理后的结构。

## 📁 类型文件结构

所有类型文件统一使用 `.d.ts` 后缀，符合 TypeScript 类型声明文件规范。

### 1. src/types/api.d.ts
**用途**：API 相关类型定义

**包含的类型**：
- `ApiResponse<T>` - 统一的 API 响应格式
- `ListQueryParams` - 列表查询通用参数
- `LoginParams` - 登录请求参数
- `UserInfo` - 用户信息
- `LoginResult` - 登录响应数据
- `JobListQueryParams` - 模型作业列表查询参数
- `JobPlanQueryParams` - 作业计划查询参数
- `JobPlanItem` - 作业计划项
- `JobPlanResponse` - 作业计划响应数据结构
- `ScriptFileUploadResponse` - 脚本文件上传响应
- `ScriptFileUploadExtraParams` - 脚本文件上传额外参数
- `CreateScriptFileParams` - 创建脚本文件参数
- `UpdateScriptFileParams` - 更新脚本文件参数
- `CompletenessParams` - 数据完整度查询参数

### 2. src/types/component.d.ts
**用途**：组件相关类型定义

**包含的类型**：
- `ButtonType` - 按钮类型
- `SpaceSize` - 间距大小类型
- `ParamsResolver` - 参数解析器
- `UploadFile` - 上传文件对象
- `UploadChangeParam` - 上传变化参数
- `DownloadRequestContext` - 下载请求上下文
- `DownloadRequestHandler` - 下载请求处理器
- `CodeEditorProps` - 代码编辑器 Props
- `SourceFile` - 源码文件
- `LogModalProps` - 日志模态框 Props
- `TreeNode` - 树节点

### 3. src/types/form.d.ts
**用途**：表单相关类型定义

**包含的类型**：
- `SelectOption` - 下拉选项
- `ValidationRule` - 验证规则
- `CustomRenderCtx` - 自定义渲染上下文
- `FieldItem` - 字段项配置
- `ModuleItem` - 模块项配置
- `DatabaseConfigForm` - 数据库配置表单
- `Dependency` - 依赖包配置
- `FormData` - 通用表单数据

### 4. src/types/table.d.ts
**用途**：表格相关类型定义

**包含的类型**：
- `DisplayMode` - 数据展示模式
- `TimeRangeType` - 时间范围类型
- `SortOrder` - 排序方式
- `CompletenessRow` - 完整度行数据

### 5. src/types/upload.d.ts
**用途**：上传下载相关类型定义

**包含的类型**：
- `FileItem` - 文件项
- `LogItem` - 日志项

### 6. src/types/model.d.ts
**用途**：模型相关类型定义（已存在，已更新后缀）

### 7. src/types/user.d.ts
**用途**：用户相关类型定义（已存在，已更新后缀）

### 8. src/types/index.d.ts
**用途**：统一导出所有类型

**功能**：
- 导出所有子模块的类型
- 声明全局类型（向后兼容）

## 🔧 已更新的 API 文件

以下 API 文件已更新为使用统一的类型定义：

### 1. [src/api/auth.ts](../api/auth.ts)
- 引入 `ApiResponse`, `LoginParams`, `LoginResult`, `UserInfo`
- 移除本地重复定义的类型

### 2. [src/api/operators.ts](../api/operators.ts)
- 引入 `ApiResponse`, `ListQueryParams`
- 移除本地重复定义的类型

### 3. [src/api/inputOutput.ts](../api/inputOutput.ts)
- 引入 `ApiResponse`, `ListQueryParams`, `CompletenessParams`
- 移除本地重复定义的类型
- 重新导出 `DataBrowseParams`, `ListQueryParams`

### 4. [src/api/development.ts](../api/development.ts)
- 引入所有脚本文件相关类型
- 移除本地重复定义的类型
- 重新导出 `ListQueryParams`

### 5. [src/api/modelJob.ts](../api/modelJob.ts)
- 引入所有作业相关类型
- 移除本地重复定义的类型
- 重新导出 `JobListQueryParams`, `JobPlanItem`

## ✅ 解决的问题

### 1. 类型重复定义
**问题**：以下类型在多个文件中重复定义
- `ApiResponse<T>` - 在 6 个 API 文件中重复定义
- `ListQueryParams` - 在 3 个 API 文件中重复定义
- `ButtonType` - 在 3 个组件中重复定义
- `ParamsResolver` - 在 3 个组件中重复定义
- `TimeRangeType` - 在 2 个文件中重复定义

**解决方案**：统一到各自的类型文件中，通过 `@/types` 统一导入

### 2. 类型导出问题
**问题**：某些类型在 API 文件中定义但未导出，导致外部无法使用

**解决方案**：在 API 文件中使用 `export type { TypeName }` 重新导出需要的类型

### 3. 类型文件后缀不规范
**问题**：原有类型文件使用 `.ts` 后缀

**解决方案**：统一改为 `.d.ts` 后缀，符合 TypeScript 类型声明文件规范

## 📦 类型整理结构

```
src/types/
├── index.d.ts          # 统一导出入口
├── api.d.ts            # API 相关类型
├── component.d.ts      # 组件相关类型
├── form.d.ts           # 表单相关类型
├── table.d.ts          # 表格相关类型
├── upload.d.ts         # 上传下载相关类型
├── model.d.ts          # 模型相关类型
├── user.d.ts           # 用户相关类型
└── README.md           # 本文档
```

## 🎯 使用方式

### 统一导入（推荐）
```typescript
import type { ApiResponse, ListQueryParams, SelectOption } from '@/types';
```

### 从具体文件导入
```typescript
import type { ApiResponse } from '@/types/api';
import type { ButtonType } from '@/types/component';
import type { SelectOption } from '@/types/form';
```

### 全局类型（自动可用，无需导入）
```typescript
// SelectOption 和 FieldConfig 已声明为全局类型
// 可直接使用，无需导入
const options: SelectOption[] = [
  { label: '选项1', value: 1 }
];
```

## 🚨 注意事项

1. **文件后缀**：所有类型文件统一使用 `.d.ts` 后缀，符合 TypeScript 类型声明文件规范

2. **全局类型**：`SelectOption` 和 `FieldConfig` 已声明为全局类型，可直接使用无需导入（向后兼容）

3. **显式导入（推荐）**：虽然某些类型是全局的，但推荐显式导入以提高代码可读性
   ```typescript
   import type { SelectOption } from '@/types';
   ```

4. **类型导出**：API 文件中如需对外暴露类型，请使用：
   ```typescript
   export type { TypeName };
   ```

5. **类型命名**：统一使用 PascalCase 命名，interface 和 type 均可

6. **文件组织**：新增类型时，请按照业务领域放入对应的类型文件

## ✅ 类型检查状态

**状态**：✅ 全部通过
**检查时间**：2026-01-20
**命令**：`npx vue-tsc --noEmit`

所有类型错误已修复，项目类型定义完全符合 TypeScript 规范。

## 📝 已修复的问题

1. ✅ 统一所有 API 文件的类型定义
2. ✅ 消除类型重复定义
3. ✅ 修复类型导出问题
4. ✅ 添加全局类型声明（向后兼容）
5. ✅ 修复 [src/views/jobs/index.vue:40](../views/jobs/index.vue#L40) 未使用的变量
6. ✅ 修复 [src/views/operators/index.vue:210](../views/operators/index.vue#L210) null 类型不兼容问题
7. ✅ 所有类型文件统一使用 `.d.ts` 后缀

## 📝 可选优化项

虽然以下文件使用了全局类型声明（已支持），但建议在后续开发中逐步更新为显式导入以提高代码可读性：

- src/views/deployment/indexData.ts
- src/views/development/components/OperatorPanel.vue
- src/views/development/indexData.ts
- src/views/InputOutput/index.ts
- src/views/InputOutput/tabs/DataBrowse.vue
- src/views/jobs/indexData.ts
- src/views/operators/indexData.ts

**注意**：这些是可选的优化，不影响项目运行。

---

**整理完成时间**：2026-01-20
**整理人**：Claude Code
**类型检查**：✅ 全部通过
