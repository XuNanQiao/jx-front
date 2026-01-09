# 详情页面真实接口集成文档

## 完成的优化

### 1. API 接口路径更新

#### 修改前
```typescript
// src/api/inputOutput.ts
export function getDetail(id: string): Promise<ApiResponse<any>> {
  return request.get('/input-output/detail', { params: { id } })
}
```

#### 修改后
```typescript
// src/api/inputOutput.ts - Line 23-26
export function getDetail(id: string): Promise<ApiResponse<any>> {
  return request.get(`/api/model_input_output/detail/${id}`)
}
```

**主要改进**:
- ✅ 使用真实后端接口路径：`/api/model_input_output/detail/:id`
- ✅ 将 ID 作为路径参数而不是查询参数
- ✅ 添加注释说明这是通过真实后端 API 获取数据

### 2. 详情页面增强 (Detail.vue)

#### 加载状态管理
- 添加 `loading` 状态变量
- 显示加载中的 Spin 组件
- 防止数据未加载完成时渲染空白

#### 错误处理优化
- 添加详细的错误日志（📤 📥 ✅ ❌ emoji 标识）
- 用户友好的错误提示消息
- 检查 ID 参数是否存在

#### 响应数据验证
```typescript
if (res?.code === 200 && res?.data) {
  detail.value = res.data;
  name.value = res.data.name || "";
} else {
  message.error(res?.message || "获取详情失败");
}
```

### 3. 其他 API 接口同步更新

同时更新了创建和更新接口的路径，保持一致性：
```typescript
// 创建接口
export function createItem(payload: any): Promise<ApiResponse<any>> {
  return request.post('/api/model_input_output/create', payload)
}

// 更新接口
export function updateItem(id: string, payload: any): Promise<ApiResponse<any>> {
  return request.put(`/api/model_input_output/update/${id}`, payload)
}
```

## API 请求流程

### 详情数据获取流程

1. **用户操作**: 点击列表中的详情链接
2. **路由跳转**: 跳转到 `/input-output/detail/:id`
3. **Detail.vue 加载**:
   - `onMounted` 钩子触发
   - 调用 `loadDetail()` 函数
4. **API 请求**:
   ```
   GET http://localhost:3002/api/model_input_output/detail/{id}
   →  代理转发到  →
   GET http://10.80.1.45:8000/model_input_output/detail/{id}
   ```
5. **响应处理**:
   - 成功: 更新 `detail.value` 和 `name.value`
   - 失败: 显示错误提示

### 代理配置

由于使用了 `/api` 前缀，请求会被 Vite 代理：

**vite.config.ts 配置**:
```typescript
proxy: {
  '/api': {
    target: 'http://10.80.1.45:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

**请求转换**:
- 前端请求: `/api/model_input_output/detail/123`
- 代理后: `http://10.80.1.45:8000/model_input_output/detail/123`

## BasicInfo 组件

BasicInfo 组件通过 props 接收详情数据：

```vue
<BasicInfo :detail-data="detail" @saved="handleChildSaved" />
```

### 数据流
1. **Detail.vue** 加载数据 → `detail` ref
2. **传递给 BasicInfo** → `detailData` prop
3. **BasicInfo 监听变化** → 使用 `watch` 更新表单
4. **编辑保存** → 触发 `@saved` 事件 → 更新 Detail.vue 的数据

### 字段映射

BasicInfo 组件会根据以下字段定义渲染表单：
- **基础信息**: `basicFields` (名称、标识、类别、默认设备等)
- **数据保留**: `retentionFields` (保留时长、压缩策略等)
- **其他信息**: `otherFields` (创建时间、更新时间等)

## 调试指南

### 开发环境日志

在浏览器控制台可以看到详细的请求日志：

```
📤 发起请求: {
  method: "GET",
  url: "/api/model_input_output/detail/123",
  fullURL: "/api/model_input_output/detail/123",
  hasToken: true
}

📥 收到响应: {
  url: "/api/model_input_output/detail/123",
  status: 200,
  code: 200,
  message: "success",
  data: { ... }
}

✅ 详情数据加载成功: { id: 123, name: "...", ... }
```

### 常见问题排查

#### Q1: 404 错误 - 接口不存在
**检查**:
1. 后端接口路径是否正确
2. 代理配置的 `rewrite` 规则是否正确
3. 后端服务是否正常运行

#### Q2: 数据不显示
**检查**:
1. 浏览器控制台的响应数据格式
2. `res.code` 是否为 200
3. `res.data` 是否包含预期字段
4. BasicInfo 组件的 `watch` 是否正确触发

#### Q3: 跨域问题
**检查**:
1. `.env.development` 中 `VITE_API_BASE_URL` 是否为空
2. Vite 代理是否正确配置
3. 开发服务器是否已重启

## 测试步骤

1. **启动开发服务器**: `npm run dev`
2. **访问列表页面**: `/model-input-output`
3. **点击详情链接**: 选择任意一条数据
4. **观察控制台日志**:
   - 查看请求日志 (📤)
   - 查看响应日志 (📥)
   - 确认数据加载成功 (✅)
5. **验证数据显示**:
   - 基础信息是否正确显示
   - 编辑功能是否正常
   - 保存功能是否正常

## 下一步优化建议

- [ ] 添加详情数据缓存机制
- [ ] 实现数据刷新功能
- [ ] 优化加载状态的用户体验
- [ ] 添加骨架屏加载效果
- [ ] 完善其他 Tab 页的数据加载
