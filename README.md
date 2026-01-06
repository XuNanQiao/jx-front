# Vue3 Admin 项目

基于 Vue3 + Vite + Pinia + TypeScript + UnoCSS 构建的管理系统框架。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue 官方状态管理库
- **TypeScript** - JavaScript 的超集
- **UnoCSS** - 即时按需的原子化 CSS 引擎
- **Vue Router** - Vue.js 官方路由管理器

## 项目结构

```
jx/
├── src/
│   ├── router/          # 路由配置
│   │   └── index.ts     # 路由配置和路由守卫
│   ├── stores/          # Pinia 状态管理
│   │   └── user.ts      # 用户状态管理
│   ├── types/           # TypeScript 类型定义
│   │   └── user.ts      # 用户相关类型
│   ├── views/           # 页面组件
│   │   ├── Login.vue    # 登录页面
│   │   └── Home.vue     # 首页
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── vite-env.d.ts    # Vite 类型声明
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── uno.config.ts        # UnoCSS 配置
└── package.json         # 项目依赖
```

## 主要功能

### 1. 登录认证
- 用户登录表单验证
- Token 持久化存储
- 路由守卫保护

### 2. 状态管理
- Pinia 管理用户状态
- 支持登录、登出功能
- LocalStorage 持久化

### 3. 路由配置
- 路由懒加载
- 路由元信息配置
- 登录状态路由守卫
- 自动页面标题设置

### 4. UnoCSS 样式
- 原子化 CSS
- 预设快捷类（flex-center、btn-primary 等）
- 响应式设计支持

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 登录测试

- **用户名**: admin（或任意用户名）
- **密码**: 任意密码（长度至少6位）

## 配置说明

### Vite 配置
- 路径别名：`@` 指向 `src` 目录
- 开发服务器端口：3000
- 自动打开浏览器

### UnoCSS 配置
预设了常用的快捷类：
- `flex-center`: 居中布局
- `flex-between`: 两端对齐
- `btn-primary`: 主要按钮样式
- `input-base`: 输入框基础样式

### TypeScript 配置
- 严格模式
- 路径别名支持
- Vue 组件类型支持

## 开发建议

1. **添加新页面**：在 `src/views/` 目录下创建新的 Vue 组件
2. **添加路由**：在 `src/router/index.ts` 中配置新路由
3. **状态管理**：在 `src/stores/` 目录下创建新的 store
4. **类型定义**：在 `src/types/` 目录下添加 TypeScript 类型

## 下一步扩展

- [ ] 添加 Axios 封装进行 API 请求
- [ ] 添加全局组件（Layout、Sidebar、Header）
- [ ] 添加权限管理
- [ ] 添加更多业务页面
- [ ] 添加 ESLint 和 Prettier
- [ ] 添加单元测试

## License

MIT
