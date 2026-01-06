# Mock 登录功能说明

## 功能概述

已成功添加基于接口调用的 mock 登录功能，使用 axios + vite-plugin-mock 实现。

## 项目结构

```
src/
├── api/
│   └── user.ts              # 用户 API 接口
├── utils/
│   └── request.ts           # axios 请求封装
├── stores/
│   └── user.ts              # 用户状态管理（已更新）
mock/
└── user.ts                  # Mock 数据配置
```

## 测试账号

| 用户名 | 密码   | 角色  |
|--------|--------|-------|
| admin  | 123456 | admin |
| user   | 123456 | user  |

## API 接口

### 1. 登录接口
- **URL**: `POST /api/user/login`
- **参数**:
  ```json
  {
    "username": "admin",
    "password": "123456"
  }
  ```
- **响应**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "mock-token-xxx",
      "user": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "avatar": "...",
        "role": "admin"
      }
    }
  }
  ```

### 2. 登出接口
- **URL**: `POST /api/user/logout`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "登出成功",
    "data": null
  }
  ```

### 3. 获取用户信息
- **URL**: `GET /api/user/info`
- **Header**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "code": 200,
    "message": "成功",
    "data": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "avatar": "...",
      "role": "admin"
    }
  }
  ```

## 功能特性

### 1. Axios 请求封装 (src/utils/request.ts)
- ✅ 请求拦截器：自动添加 Authorization token
- ✅ 响应拦截器：统一处理错误和 401 未授权
- ✅ 支持 GET、POST、PUT、DELETE 方法
- ✅ 统一的错误处理

### 2. Mock 服务 (mock/user.ts)
- ✅ 模拟真实的登录验证
- ✅ 用户名和密码验证
- ✅ Token 生成和验证
- ✅ 多用户支持

### 3. 用户状态管理 (src/stores/user.ts)
- ✅ 使用真实 API 调用替代原有的模拟逻辑
- ✅ Token 和用户信息持久化
- ✅ 登录/登出功能
- ✅ 获取用户信息功能

## 使用方法

### 1. 启动项目
```bash
npm run dev
```

### 2. 登录测试
访问 `http://localhost:3000/login`，使用以下账号登录：
- 用户名: `admin`
- 密码: `123456`

### 3. 查看 Mock 日志
在开发模式下，Vite 控制台会显示 mock 请求日志。

## 技术栈

- **Vue 3** - 前端框架
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **Axios** - HTTP 客户端
- **vite-plugin-mock** - Mock 数据服务
- **TypeScript** - 类型支持

## 环境变量

`.env.development`:
```env
VITE_API_BASE_URL=/api
```

## 注意事项

1. Mock 服务仅在开发环境启用
2. 生产环境需要替换为真实的后端 API
3. Token 存储在 localStorage 中
4. 路由守卫会自动检查登录状态

## 后续扩展

如需连接真实后端，只需：
1. 修改 `.env.development` 中的 `VITE_API_BASE_URL`
2. 在 `vite.config.ts` 中禁用 mock 插件或设置 `enable: false`
3. 确保后端 API 接口格式与当前定义一致
