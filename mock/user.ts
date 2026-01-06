import { MockMethod } from 'vite-plugin-mock'

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    email: 'user@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    role: 'user'
  }
]

export default [
  // 用户登录
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      // 查找用户
      const user = users.find(u => u.username === username)

      if (!user) {
        return {
          code: 400,
          message: '用户不存在',
          data: null
        }
      }

      if (user.password !== password) {
        return {
          code: 400,
          message: '密码错误',
          data: null
        }
      }

      // 生成 token
      const token = `mock-token-${user.id}-${Date.now()}`

      return {
        code: 200,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role
          }
        }
      }
    }
  },

  // 用户登出
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        data: null
      }
    }
  },

  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return {
          code: 401,
          message: '未授权',
          data: null
        }
      }

      // 从 token 中解析用户 ID (简化处理)
      const userId = 1

      const user = users.find(u => u.id === userId)

      if (!user) {
        return {
          code: 401,
          message: '用户不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '成功',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      }
    }
  }
] as MockMethod[]
