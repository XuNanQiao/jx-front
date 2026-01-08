# 登录接口调试指南

## 修复内容

### 1. 修复了 baseURL 配置冲突
- **问题**: `baseURL` 设置为 `http://10.80.1.45:8000` 导致请求路径错误
- **修复**: 改为使用相对路径 `/`，由 Vite 代理处理

### 2. 优化了环境配置
- 添加了 `VITE_USE_MOCK` 环境变量，方便切换 Mock/真实接口
- `baseURL` 留空，使用 Vite 代理

## 当前配置

### 开发环境（使用 Mock 数据）
```
请求路径: /api/login
实际请求: http://localhost:3000/api/login
Mock 拦截: 返回模拟数据
```

### 开发环境（使用真实后端）
需要修改 `vite.config.ts` 中的 Mock 配置：
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: false, // 改为 false
  logger: true
})
```

然后请求流程：
```
请求路径: /api/login
Vite 代理: /api -> http://10.80.1.45:8000
路径重写: /api/login -> /login
最终请求: http://10.80.1.45:8000/login
```

## 测试登录

### 1. 使用 Mock 数据（当前配置）
**测试账号**:
- 用户名: `admin`
- 密码: `password123`

或

- 用户名: `user`
- 密码: `password123`

### 2. 切换到真实后端
修改 `vite.config.ts`:
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: false, // 关闭 Mock
  logger: true
})
```

重启开发服务器：
```bash
npm run dev
```

## 调试步骤

### 1. 打开浏览器控制台
- F12 打开开发者工具
- 切换到 Network 标签

### 2. 尝试登录
- 输入用户名和密码
- 点击登录按钮

### 3. 检查请求
在 Network 中查找 `login` 请求：

**成功的请求应该显示**:
- Status: 200
- Response:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "mock-token-1-...",
      "user": {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        ...
      }
    }
  }
  ```

**失败的常见情况**:

1. **404 Not Found**
   - Mock 未启用或路径不匹配
   - 检查 Mock 配置

2. **Network Error / CORS**
   - 后端服务未启动
   - 代理配置错误
   - 检查后端地址是否正确

3. **400 Bad Request**
   - 用户名或密码错误
   - 请求参数格式错误

4. **500 Internal Server Error**
   - 后端服务异常
   - 检查后端日志

## 查看控制台日志

在浏览器控制台中会显示：
- Mock 日志（如果启用）
- 请求/响应错误信息
- Axios 拦截器日志

## 快速切换 Mock/真实接口

### 方法1: 修改配置文件（推荐）
编辑 `vite.config.ts`:
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: false, // true=Mock, false=真实接口
  logger: true
})
```

### 方法2: 使用环境变量
创建 `.env.development.local`:
```bash
VITE_USE_MOCK=false
```

然后修改 `vite.config.ts`:
```typescript
viteMockServe({
  mockPath: 'mock',
  enable: process.env.VITE_USE_MOCK !== 'false',
  logger: true
})
```

## 常见问题

### Q1: 登录请求一直 pending
**原因**: 后端服务未启动或地址错误
**解决**:
1. 检查后端服务是否运行
2. 验证代理地址 `http://10.80.1.45:8000` 是否正确

### Q2: CORS 错误
**原因**: 跨域问题
**解决**:
1. 使用 Mock 数据（开发环境）
2. 后端配置 CORS
3. 检查 `changeOrigin: true` 配置

### Q3: 401 Unauthorized
**原因**: Token 过期或无效
**解决**:
1. 清除 localStorage
2. 重新登录

### Q4: 密码错误但用户名正确
**原因**: Mock 数据中密码不匹配
**解决**:
检查 `mock/user.ts` 中的密码设置，当前为 `password123`
