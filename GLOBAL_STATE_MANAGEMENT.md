# 全局状态管理说明

## 概述

本应用使用 Pinia 作为全局状态管理工具，用户信息和 token 被保存在全局状态中，并自动与 localStorage 同步。

## 核心实现

### 1. 用户状态存储 (User Store)

位置：`src/stores/user.ts`

**状态结构：**
```typescript
{
  token: string              // 用户认证令牌
  userInfo: UserInfo | null  // 用户详细信息
  isLoggedIn: boolean        // 登录状态（计算属性）
}
```

**关键功能：**
- `login()` - 登录并保存用户信息到全局状态和 localStorage
- `logout()` - 退出登录并清除全局状态和 localStorage
- `initUserInfo()` - 从 localStorage 恢复用户状态到全局
- `fetchUserInfo()` - 从服务器获取最新用户信息

### 2. 全局初始化

位置：`src/main.ts:20-22`

应用启动时自动执行：
```typescript
// 创建 Pinia 实例
const pinia = createPinia()
app.use(pinia)

// 初始化用户状态（从 localStorage 恢复到全局状态）
const userStore = useUserStore()
userStore.initUserInfo()
```

**作用：**
- 页面刷新后自动恢复登录状态
- 确保路由守卫可以正确判断登录状态
- 所有组件可以立即访问用户信息

### 3. 自动 Token 注入

位置：`src/utils/request.ts:16-18`

所有 API 请求自动注入 token：
```typescript
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 4. 路由守卫

位置：`src/router/index.ts:91-114`

根据全局状态控制访问权限：
```typescript
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn

  // 需要登录但未登录 -> 跳转登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  }
  // 已登录访问登录页 -> 跳转首页
  else if (to.path === '/login' && isLoggedIn) {
    next('/home')
  }
  else {
    next()
  }
})
```

## 使用方式

### 在组件中访问全局状态

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 访问状态
console.log(userStore.token)        // 获取 token
console.log(userStore.userInfo)     // 获取用户信息
console.log(userStore.isLoggedIn)   // 获取登录状态

// 在模板中使用
<template>
  <div>{{ userStore.userInfo?.username }}</div>
  <img :src="userStore.userInfo?.avatar" />
</template>
```

### 登录流程

1. 用户在登录页输入账号密码
2. 调用 `userStore.login(loginForm)`
3. 登录成功后：
   - token 保存到 `localStorage` 和全局状态
   - userInfo 保存到 `localStorage` 和全局状态
   - 自动跳转到首页
4. 后续所有 API 请求自动携带 token

### 退出登录流程

1. 用户点击退出按钮
2. 调用 `userStore.logout()`
3. 清除全局状态和 localStorage
4. 跳转到登录页

### 页面刷新恢复状态

1. 用户刷新页面
2. `main.ts` 中自动调用 `userStore.initUserInfo()`
3. 从 localStorage 恢复 token 和 userInfo 到全局状态
4. 路由守卫根据恢复的状态判断是否需要登录
5. 页面正常显示用户信息

## 数据流

```
登录
  ↓
调用 API
  ↓
保存到 localStorage + 全局状态
  ↓
路由守卫判断 → 允许访问
  ↓
组件读取全局状态 → 显示用户信息
  ↓
发起 API 请求 → 自动注入 token
```

```
页面刷新
  ↓
main.ts 初始化
  ↓
从 localStorage 恢复到全局状态
  ↓
路由守卫判断 → 允许访问
  ↓
组件读取全局状态 → 显示用户信息
```

```
退出登录
  ↓
调用 logout API
  ↓
清除 localStorage + 全局状态
  ↓
路由守卫判断 → 重定向到登录页
```

## 关键文件

| 文件 | 作用 |
|------|------|
| `src/stores/user.ts` | 用户状态管理（Pinia Store） |
| `src/main.ts` | 应用启动时初始化全局状态 |
| `src/utils/request.ts` | 自动注入 token 到请求头 |
| `src/router/index.ts` | 根据登录状态控制路由访问 |
| `src/views/Login.vue` | 登录页面，保存用户信息到全局 |
| `src/components/AppHeader.vue` | 显示全局状态中的用户信息 |

## 优势

1. **单一数据源**：全局状态是唯一的数据源，避免数据不一致
2. **自动持久化**：状态自动同步到 localStorage，刷新不丢失
3. **自动恢复**：应用启动时自动从 localStorage 恢复状态
4. **类型安全**：TypeScript 提供完整的类型检查
5. **响应式更新**：状态变化自动触发组件更新
6. **集中管理**：认证逻辑集中在一处，易于维护

## 调试

开发环境下可以在控制台查看状态初始化：
```
已从 localStorage 恢复用户状态: {
  token: "已加载",
  userInfo: { username: "admin", ... }
}
```

登录成功后会显示：
```
登录成功，用户信息：{ username: "admin", ... }
Token已保存：mock-token-1-...
```
