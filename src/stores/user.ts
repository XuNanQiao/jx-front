import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginForm } from '@/types/user'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  // 登录
  const login = async (loginForm: LoginForm) => {
    try {
      // 调用登录接口
      const response = await userApi.login(loginForm)

      if (response.code === 200 && response.data) {
        const { token: newToken, user } = response.data

        // 保存 token 和用户信息
        token.value = newToken
        userInfo.value = user
        localStorage.setItem('token', newToken)
        localStorage.setItem('userInfo', JSON.stringify(user))

        return { success: true, message: response.message || '登录成功' }
      } else {
        return { success: false, message: response.message || '登录失败' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        message: error?.message || '登录失败，请稍后重试'
      }
    }
  }

  // 登出
  const logout = async () => {
    try {
      // 调用登出接口
      await userApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // 清除本地存储
      token.value = ''
      userInfo.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await userApi.getUserInfo()
      if (response.code === 200 && response.data) {
        userInfo.value = response.data
        localStorage.setItem('userInfo', JSON.stringify(response.data))
        return true
      }
      return false
    } catch (error) {
      console.error('Fetch user info error:', error)
      return false
    }
  }

  // 初始化用户信息
  const initUserInfo = () => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('Failed to parse user info:', error)
      }
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    fetchUserInfo,
    initUserInfo
  }
})
