import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import BasicLayout from '@/layouts/BasicLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: '/home',
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
          title: '首页',
          requiresAuth: true
        }
      },
      {
        path: '/model/input-output',
        name: 'ModelInputOutput',
        component: () => import('@/views/model/InputOutput.vue'),
        meta: {
          title: '模型输入输出',
          requiresAuth: true
        }
      },
      {
        path: '/model/development',
        name: 'ModelDevelopment',
        component: () => import('@/views/model/Development.vue'),
        meta: {
          title: '模型开发',
          requiresAuth: true
        }
      },
      {
        path: '/model/operators',
        name: 'ModelOperators',
        component: () => import('@/views/model/Operators.vue'),
        meta: {
          title: '算子管理',
          requiresAuth: true
        }
      },
      {
        path: '/model/deployment',
        name: 'ModelDeployment',
        component: () => import('@/views/model/Deployment.vue'),
        meta: {
          title: '模型部署',
          requiresAuth: true
        }
      },
      {
        path: '/model/jobs',
        name: 'ModelJobs',
        component: () => import('@/views/model/Jobs.vue'),
        meta: {
          title: '模型作业',
          requiresAuth: true
        }
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true
        }
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('@/views/system/Users.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true
        }
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('@/views/system/Roles.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true
        }
      },
      {
        path: '/permissions',
        name: 'Permissions',
        component: () => import('@/views/system/Permissions.vue'),
        meta: {
          title: '权限管理',
          requiresAuth: true
        }
      },
      {
        path: '/articles',
        name: 'Articles',
        component: () => import('@/views/content/Articles.vue'),
        meta: {
          title: '文章列表',
          requiresAuth: true
        }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/views/content/Categories.vue'),
        meta: {
          title: '分类管理',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue Admin`
  }

  // 如果需要登录但未登录，跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  // 如果已登录访问登录页，跳转到首页
  else if (to.path === '/login' && isLoggedIn) {
    next('/home')
  }
  // 其他情况正常跳转
  else {
    next()
  }
})

export default router
