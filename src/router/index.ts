import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/stores/user";
import BasicLayout from "@/layouts/BasicLayout.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/",
    component: BasicLayout,
    redirect: "/home",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: {
          title: "首页",
          requiresAuth: true,
        },
      },
      {
        path: "/model/input-output",
        name: "ModelInputOutput",
        component: () => import("@/views/InputOutput/index.vue"),
        meta: {
          title: "模型输入输出",
          requiresAuth: true,
        },
      },
      {
        path: "/model/input-output/:id",
        name: "ModelInputOutputDetail",
        component: () => import("@/views/InputOutput/Detail.vue"),
        meta: {
          title: "模型输入输出详情",
          requiresAuth: true,
        },
      },
      {
        path: "/model/development",
        name: "ModelDevelopment",
        component: () => import("@/views/development/index.vue"),
        meta: {
          title: "模型开发",
          requiresAuth: true,
        },
      },
      {
        path: "/model/operators",
        name: "ModelOperators",
        component: () => import("@/views/operators/index.vue"),
        meta: {
          title: "算子管理",
          requiresAuth: true,
        },
      },
      {
        path: "/model/deployment",
        name: "ModelDeployment",
        component: () => import("@/views/deployment/index.vue"),
        meta: {
          title: "模型部署",
          requiresAuth: true,
        },
      },
      {
        path: "/model/jobs",
        name: "ModelJobs",
        component: () => import("@/views/jobs/index.vue"),
        meta: {
          title: "模型作业",
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue Admin`;
  }

  // 如果需要登录但未登录，跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
  // 如果已登录访问登录页，跳转到首页
  else if (to.path === "/login" && isLoggedIn) {
    next("/home");
  }
  // 其他情况正常跳转
  else {
    next();
  }
});

export default router;
