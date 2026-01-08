<template>
  <div class="login-container w-full h-full flex-center bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="login-box w-400px bg-white rounded-lg shadow-2xl p-8">
      <div class="login-header text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">欢迎登录</h1>
        <p class="text-gray-500 text-sm">Vue3 Admin System</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-item mb-6">
          <label class="block text-gray-700 text-sm font-semibold mb-2"> 用户名 </label>
          <input v-model="loginForm.username" type="text" placeholder="请输入用户名" class="input-base" :class="{ 'border-red-500': errors.username }" />
          <p v-if="errors.username" class="text-red-500 text-xs mt-1">
            {{ errors.username }}
          </p>
        </div>

        <div class="form-item mb-6">
          <label class="block text-gray-700 text-sm font-semibold mb-2"> 密码 </label>
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" class="input-base" :class="{ 'border-red-500': errors.password }" />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <div class="form-item mb-6 flex items-center justify-between">
          <label class="flex items-center cursor-pointer">
            <input v-model="rememberMe" type="checkbox" class="mr-2 w-4 h-4 text-blue-500 cursor-pointer" />
            <span class="text-sm text-gray-600">记住我</span>
          </label>
          <a href="#" class="text-sm text-blue-500 hover:text-blue-600"> 忘记密码? </a>
        </div>

        <button type="submit" class="btn-primary w-full h-44px text-lg font-semibold" :disabled="loading">
          {{ loading ? "登录中..." : "登录" }}
        </button>

        <div v-if="errorMessage" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import type { LoginForm } from "@/types/user";

const router = useRouter();
const userStore = useUserStore();

const loginForm = reactive<LoginForm>({
  username: "",
  password: "",
});

const errors = reactive({
  username: "",
  password: "",
});

const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref("");

// 初始化：读取"记住我"功能保存的用户名
onMounted(() => {
  const savedRemember = localStorage.getItem("rememberMe");
  const savedUsername = localStorage.getItem("savedUsername");

  if (savedRemember === "true" && savedUsername) {
    rememberMe.value = true;
    loginForm.username = savedUsername;
  }

  // 开发环境默认填充
  if (import.meta.env.DEV && !loginForm.username) {
    loginForm.username = "admin";
    loginForm.password = "password123";
  }
});

// 表单验证
const validateForm = (): boolean => {
  let isValid = true;
  errors.username = "";
  errors.password = "";

  if (!loginForm.username.trim()) {
    errors.username = "请输入用户名";
    isValid = false;
  }

  if (!loginForm.password.trim()) {
    errors.password = "请输入密码";
    isValid = false;
  } else if (loginForm.password.length < 6) {
    errors.password = "密码长度不能少于6位";
    isValid = false;
  }

  return isValid;
};

// 处理登录
const handleLogin = async () => {
  errorMessage.value = "";

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    userStore.login(loginForm).then((result) => {
      if (result.success) {
        // 登录成功，跳转到首页
        router.push("/");
      }
    });
  } catch (error: any) {
    console.error("登录失败：", error);
    errorMessage.value = error?.message || "登录失败，请稍后重试";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
