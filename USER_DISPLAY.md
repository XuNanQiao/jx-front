# 用户信息展示说明

## 概述

应用的顶部导航栏（AppHeader）现在会展示真实的用户信息，这些信息来自全局状态管理（Pinia Store）。

## 展示的用户信息

### 1. 导航栏显示

**位置：** 页面右上角

**展示内容：**
- **用户头像** - 来自 `userInfo.avatar`（如果没有则显示默认图标）
- **用户昵称** - 优先显示 `userInfo.nickname`，没有则显示 `userInfo.username`
- **用户角色** - 显示 `userInfo.role` 的中文翻译（管理员/普通用户）

**示例：**
```
[头像] 管理员
       管理员
```

### 2. 下拉菜单详细信息

**触发方式：** 点击右上角用户信息区域

**展示内容：**
- **大头像** - 48px 尺寸
- **昵称** - 主显示名称（大字体、加粗）
- **用户名** - @username 格式
- **邮箱** - 如果有的话

**示例：**
```
┌────────────────────────┐
│  [大头像]  管理员       │
│           @admin        │
│           admin@ex.com  │
├────────────────────────┤
│  👤 个人中心           │
│  ⚙️ 设置               │
├────────────────────────┤
│  🚪 退出登录           │
└────────────────────────┘
```

## 数据来源

### 全局状态 (Pinia Store)

**位置：** `src/stores/user.ts`

用户信息存储在全局状态中：
```typescript
const userStore = useUserStore()
const userInfo = userStore.userInfo

// userInfo 结构
{
  id: number | string
  username: string        // 用户名（必须）
  nickname?: string       // 昵称（可选，优先显示）
  email?: string         // 邮箱（可选）
  avatar?: string        // 头像URL（可选）
  role?: string          // 角色（可选）
}
```

### 数据更新时机

1. **登录时** - `Login.vue` 调用 `userStore.login()` 后自动保存
2. **页面刷新** - `main.ts` 启动时从 localStorage 恢复
3. **主动获取** - 调用 `userStore.fetchUserInfo()` 更新

## 角色映射

系统支持以下角色的中文显示：

| 英文角色 | 中文显示 |
|---------|---------|
| admin   | 管理员   |
| user    | 普通用户 |
| guest   | 访客     |
| 其他    | 原样显示 |

**实现位置：** `src/components/AppHeader.vue` 的 `getRoleText()` 函数

## 响应式设计

### 桌面端（> 768px）
- 显示完整信息：头像 + 昵称 + 角色

### 移动端（≤ 768px）
- 仅显示头像
- 隐藏文字信息以节省空间

## 测试账号

### 管理员账号
```
用户名: admin
密码: password123
显示名称: 管理员
角色: admin → 显示为"管理员"
```

### 普通用户账号
```
用户名: user
密码: password123
显示名称: 普通用户
角色: user → 显示为"普通用户"
```

## 视觉效果

### 交互效果
- **悬停** - 背景色变化，下拉图标下移
- **点击** - 展开下拉菜单显示完整信息
- **过渡** - 平滑的动画效果

### 样式特点
- 头像：圆形，36px（导航栏）/ 48px（下拉菜单）
- 字体：清晰的层级关系（昵称 > 用户名 > 邮箱）
- 颜色：主文本 > 次文本 > 辅助文本

## 相关文件

| 文件 | 作用 |
|------|------|
| `src/components/AppHeader.vue` | 用户信息展示组件 |
| `src/stores/user.ts` | 用户状态管理 |
| `src/types/user.ts` | 用户信息类型定义 |
| `mock/user.ts` | Mock 用户数据 |
| `src/main.ts` | 应用启动时恢复用户状态 |

## 自定义扩展

### 添加新的角色类型

编辑 `src/components/AppHeader.vue`：

```typescript
const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    'admin': '管理员',
    'user': '普通用户',
    'guest': '访客',
    'vip': 'VIP用户',        // 新增
    'developer': '开发者'     // 新增
  }
  return roleMap[role] || role
}
```

### 添加更多用户信息展示

在 `AppHeader.vue` 的下拉菜单中添加：

```vue
<div v-if="userStore.userInfo?.phone" class="detail-phone">
  📱 {{ userStore.userInfo?.phone }}
</div>
```

### 修改头像样式

在 CSS 中自定义：

```css
.user-info :deep(.ant-avatar) {
  border: 2px solid #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}
```

## 注意事项

1. **数据安全** - 敏感信息不应在前端展示（如密码）
2. **空值处理** - 使用可选链操作符 `?.` 避免错误
3. **优雅降级** - 没有昵称时显示用户名，没有头像时显示图标
4. **实时更新** - 用户信息更新后组件会自动响应（响应式）
