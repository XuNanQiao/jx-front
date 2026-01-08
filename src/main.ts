import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import router from './router'
import App from './App.vue'
import { useUserStore } from './stores/user'

import 'ant-design-vue/dist/reset.css'
import 'uno.css'
import '@/styles/theme.css'
import '@/styles/common-table.scss'

const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()
app.use(pinia)

// 初始化用户状态（从 localStorage 恢复 token 和 userInfo）
const userStore = useUserStore()
userStore.initUserInfo()

app.use(router)
app.use(Antd, { locale: zhCN })

app.mount('#app')
