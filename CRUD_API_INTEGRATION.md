# 模型输入输出 CRUD 功能集成文档

## 概述

本文档说明了模型输入输出页面的增删改查（CRUD）功能如何集成真实的后端 API 接口。

## API 接口规范

### 1. 列表查询接口

**路径**: `POST /api/model_input_output/retrieve`

**请求参数**:
```typescript
{
  size?: number;      // 每页数量
  page?: number;      // 页码
  keyword?: string;   // 搜索关键词
  category?: string;  // 类别筛选
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [...],
    "total": 100
  }
}
```

### 2. 详情查询接口

**路径**: `POST /api/model_input_output/detail`

**请求参数**:
```json
{
  "id": "123"
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "123",
    "name": "温度传感器",
    "attribute": "输入",
    "category": "input",
    // ... 其他字段
  }
}
```

### 3. 创建接口

**路径**: `POST /api/model_input_output/create`

**请求参数**:
```json
{
  "name": "温度传感器",
  "attribute": "输入",
  "category": "input",
  "integrity": 100,
  "cycle_time": 1000
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": "124",
    "name": "温度传感器",
    // ... 完整对象
  }
}
```

### 4. 更新接口

**路径**: `PUT /api/model_input_output/update`

**请求参数**:
```json
{
  "id": "123",
  "name": "温度传感器（更新）",
  "attribute": "输入",
  "category": "input",
  "integrity": 95,
  "cycle_time": 2000
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "123",
    // ... 更新后的完整对象
  }
}
```

### 5. 删除接口

**路径**: `DELETE /api/model_input_output/delete`

**请求参数**:
```json
{
  "id": "123"
}
```

**响应格式**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

## 前端实现

### 1. API 接口定义 (src/api/inputOutput.ts)

```typescript
// 列表查询接口
export function getList(params?: ListQueryParams): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/retrieve", params || {});
}

// 详情查询接口
export function getDetail(id: string): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/detail", { id });
}

// 创建接口
export function createItem(payload: any): Promise<ApiResponse<any>> {
  return request.post("/api/model_input_output/create", payload);
}

// 更新接口
export function updateItem(payload: any): Promise<ApiResponse<any>> {
  return request.put("/api/model_input_output/update", payload);
}

// 删除接口
export function deleteItem(id: string | number): Promise<ApiResponse<any>> {
  return request.delete("/api/model_input_output/delete", { data: { id } });
}
```

### 2. 列表页面 (src/views/InputOutput/index.vue)

#### 删除功能

```typescript
// 删除操作
const handleDelete = (id: string) => {
  Modal.confirm({
    title: "确认删除",
    content: "确定要删除这条数据吗？删除后无法恢复。",
    okText: "确定",
    cancelText: "取消",
    async onOk() {
      try {
        const res = await deleteItem(id);
        if (res.code === 200) {
          message.success("删除成功");
          // 重新加载列表数据
          await loadData();
        } else {
          message.error(res.message || "删除失败");
        }
      } catch (error: any) {
        console.error("删除失败:", error);
        message.error(error?.message || "删除失败，请稍后重试");
      }
    },
  });
};
```

**特点**:
- 二次确认对话框
- 删除成功后自动刷新列表
- 完善的错误处理和用户提示

#### 新建/编辑功能

```typescript
// 新建
const formModalRef = ref(null);
const handleCreate = (record?: any) => {
  if (formModalRef.value) {
    formModalRef.value.openModal(record);
  }
};

// 保存成功回调
const handleSaved = async () => {
  // 保存成功后刷新列表
  await loadData();
};
```

### 3. 表单弹窗组件 (src/views/InputOutput/InputOutputFormModal.vue)

#### 提交逻辑

```typescript
const onOk = async () => {
  try {
    await formRef.value?.validate();
  } catch (error) {
    return;
  }

  loadingLocal.value = true;
  try {
    // 构建提交数据，将驼峰命名转换为下划线命名
    const payload = {
      ...form,
      cycle_time: form.cycleTime, // 驼峰转下划线
    };

    if (form.id) {
      // 编辑模式
      const res: any = await updateItem(payload);
      if (res && res.code === 200) {
        message.success("更新成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "更新失败");
      }
    } else {
      // 新建模式
      const res: any = await createItem(payload);
      if (res && res.code === 200) {
        message.success("创建成功");
        emit("saved", res.data);
        visibleLocal.value = false;
        resetForm();
      } else {
        throw new Error(res?.message || "创建失败");
      }
    }
  } catch (err: any) {
    console.error("保存失败:", err);
    message.error(err?.message || "保存失败，请稍后重试");
  } finally {
    loadingLocal.value = false;
  }
};
```

**特点**:
- 根据是否有 `form.id` 自动判断是新建还是编辑
- 提交前进行表单验证
- 字段名转换（驼峰转下划线）
- 完善的加载状态和错误处理
- 成功后触发 `saved` 事件通知父组件刷新

## 字段命名转换

### 前端 → 后端

前端使用驼峰命名，提交给后端时需要转换为下划线命名：

| 前端字段 | 后端字段 |
|---------|---------|
| `cycleTime` | `cycle_time` |
| `dataInput` | `data_input` |
| `createdTime` | `created_time` |
| `createdUserId` | `created_user_id` |

### 转换实现

```typescript
const payload = {
  ...form,
  cycle_time: form.cycleTime,
  // 如果有更多字段需要转换，继续添加
};
```

## 完整的 CRUD 流程

### 1. 新建数据

1. 用户点击"新建"按钮
2. 调用 `formModalRef.value.openModal()` 打开弹窗
3. 用户填写表单
4. 点击"保存"按钮
5. 表单验证通过
6. 调用 `createItem(payload)` 创建数据
7. 后端返回成功响应
8. 显示成功提示，关闭弹窗
9. 触发 `saved` 事件
10. 父组件调用 `loadData()` 刷新列表

### 2. 编辑数据

1. 用户点击"编辑"按钮
2. 调用 `formModalRef.value.openModal(record)` 打开弹窗并填充数据
3. 用户修改表单
4. 点击"保存"按钮
5. 表单验证通过
6. 调用 `updateItem(payload)` 更新数据
7. 后端返回成功响应
8. 显示成功提示，关闭弹窗
9. 触发 `saved` 事件
10. 父组件调用 `loadData()` 刷新列表

### 3. 删除数据

1. 用户点击"删除"按钮
2. 显示确认对话框
3. 用户确认删除
4. 调用 `deleteItem(id)` 删除数据
5. 后端返回成功响应
6. 显示成功提示
7. 调用 `loadData()` 刷新列表

### 4. 查看详情

1. 用户点击列表中的名称链接
2. 路由跳转到详情页 `/input-output/detail/:id`
3. 调用 `getDetail(id)` 获取详情数据
4. 渲染详情页面各个 Tab

## 错误处理

### 1. 网络错误

```typescript
try {
  const res = await deleteItem(id);
  // ...
} catch (error: any) {
  console.error("删除失败:", error);
  message.error(error?.message || "删除失败，请稍后重试");
}
```

### 2. 业务错误

```typescript
if (res.code === 200) {
  message.success("删除成功");
} else {
  message.error(res.message || "删除失败");
}
```

### 3. 表单验证错误

```typescript
try {
  await formRef.value?.validate();
} catch (error) {
  // 表单验证失败，不执行后续操作
  return;
}
```

## 用户体验优化

### 1. 加载状态

```typescript
const loading = ref(false);
const loadingLocal = ref(false); // 表单提交加载状态

// 列表加载
loading.value = true;
try {
  const res = await getList(params);
  // ...
} finally {
  loading.value = false;
}

// 表单提交
loadingLocal.value = true;
try {
  const res = await createItem(payload);
  // ...
} finally {
  loadingLocal.value = false;
}
```

### 2. 用户反馈

```typescript
// 成功提示
message.success("删除成功");
message.success("创建成功");
message.success("更新成功");

// 错误提示
message.error("删除失败");
message.error(res.message || "创建失败");
message.error(error?.message || "保存失败，请稍后重试");

// 警告提示
message.warning("请先选择要删除的数据");
```

### 3. 确认对话框

```typescript
Modal.confirm({
  title: "确认删除",
  content: "确定要删除这条数据吗？删除后无法恢复。",
  okText: "确定",
  cancelText: "取消",
  async onOk() {
    // 删除逻辑
  },
});
```

## 调试指南

### 开发环境日志

在浏览器控制台可以看到详细的请求日志：

```
📤 发起请求: {
  method: "POST",
  url: "/api/model_input_output/create",
  data: {
    name: "温度传感器",
    cycle_time: 1000,
    ...
  }
}

📥 收到响应: {
  status: 200,
  code: 200,
  message: "创建成功",
  data: { ... }
}
```

### 常见问题排查

#### Q1: 创建/更新失败，提示字段错误

**原因**: 字段命名不一致

**解决**:
1. 检查前端提交的字段名是否使用下划线命名
2. 对比后端期望的字段结构
3. 在 payload 中添加字段转换

#### Q2: 删除成功但列表未刷新

**原因**: 未调用 `loadData()`

**解决**:
```typescript
if (res.code === 200) {
  message.success("删除成功");
  await loadData(); // 刷新列表
}
```

#### Q3: 表单提交时一直 loading

**原因**: `finally` 中未设置 `loadingLocal.value = false`

**解决**:
```typescript
try {
  // ...
} finally {
  loadingLocal.value = false; // 确保设置
}
```

## 测试步骤

### 1. 新建功能测试
- 点击"新建"按钮
- 填写必填字段
- 点击"保存"
- 验证成功提示
- 验证列表已刷新
- 验证新数据出现在列表中

### 2. 编辑功能测试
- 点击某条数据的"编辑"按钮
- 验证表单已填充原数据
- 修改部分字段
- 点击"保存"
- 验证成功提示
- 验证列表已刷新
- 验证数据已更新

### 3. 删除功能测试
- 点击某条数据的"删除"按钮
- 验证确认对话框出现
- 点击"确定"
- 验证成功提示
- 验证列表已刷新
- 验证数据已从列表中移除

### 4. 详情功能测试
- 点击列表中的名称链接
- 验证页面跳转正确
- 验证详情数据加载成功
- 验证各个 Tab 显示正常

## 总结

所有 CRUD 功能已成功集成真实的后端 API 接口，包括：

- ✅ 列表查询 (POST /api/model_input_output/retrieve)
- ✅ 详情查询 (POST /api/model_input_output/detail)
- ✅ 创建数据 (POST /api/model_input_output/create)
- ✅ 更新数据 (PUT /api/model_input_output/update)
- ✅ 删除数据 (DELETE /api/model_input_output/delete)

所有功能都包含：
- 完善的错误处理
- 用户友好的提示信息
- 加载状态显示
- 自动刷新列表
- 详细的控制台日志

确保前后端数据交互的稳定性和用户体验的流畅性。
