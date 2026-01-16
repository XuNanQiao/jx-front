<template>
  <a-layout-header class="app-header">
    <div class="header-content">
      <!-- 左侧 Logo 和菜单 -->
      <div class="left-section">
        <!-- Logo -->
        <div class="logo-section" @click="router.push('/')">
          <div class="logo-icon">
            <svg viewBox="0 0 1024 1024" width="32" height="32">
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
                fill="#1890ff" />
              <path
                d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0 1 30.9-44.8c59-22.7 97.1-74.7 97.1-132.5 0-39.3-17.2-76-48.4-103.3zM472 732a40 40 0 1 0 80 0 40 40 0 1 0-80 0z"
                fill="#1890ff" />
            </svg>
          </div>
          <span class="logo-text">管理系统</span>
        </div>

        <!-- 横向菜单 -->
        <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" class="header-menu" @click="handleMenuClick">
          <a-menu-item key="/model/input-output">
            <template #icon>
              <ImportOutlined />
            </template>
            模型输入输出
          </a-menu-item>
          <a-menu-item key="/model/development">
            <template #icon>
              <CodeOutlined />
            </template>
            模型开发
          </a-menu-item>
          <a-menu-item key="/model/operators">
            <template #icon>
              <FunctionOutlined />
            </template>
            算子管理
          </a-menu-item>
          <a-menu-item key="/model/deployment">
            <template #icon>
              <CloudServerOutlined />
            </template>
            模型部署
          </a-menu-item>
          <a-menu-item key="/model/jobs">
            <template #icon>
              <ClusterOutlined />
            </template>
            模型作业
          </a-menu-item>
        </a-menu>
      </div>

      <!-- 右侧用户信息 -->
      <div class="user-section me-20px">
        <a-dropdown>
          <div class="user-info">
            <!--  <a-avatar :size="36" :src="userStore.userInfo?.avatar">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar> -->
            <div class="user-text">
              <span class="username">{{ userStore.userInfo?.nickname || '管理员' }}</span>
              <span v-if="userStore.userInfo?.role" class="user-role">{{ getRoleText(userStore.userInfo.role) }}</span>
            </div>
            <DownOutlined class="dropdown-icon" />
          </div>
          <template #overlay>
            <a-menu class="user-dropdown-menu">
              <!-- 用户信息展示 -->
              <!--        <div class="user-info-detail">
                <a-avatar :size="48" :src="userStore.userInfo?.avatar">
                  <template #icon>
                    <UserOutlined />
                  </template>
                </a-avatar>
                <div class="user-detail-text">
                  <div class="detail-nickname">{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</div>
                  <div class="detail-username">@{{ userStore.userInfo?.username }}</div>
                  <div v-if="userStore.userInfo?.email" class="detail-email">{{ userStore.userInfo?.email }}</div>
                </div>
              </div> -->
              <!--  <a-menu-divider />
              <a-menu-item key="profile">
                <UserOutlined />
                <span>个人中心</span>
              </a-menu-item>
              <a-menu-item key="settings">
                <SettingOutlined />
                <span>设置</span>
              </a-menu-item> -->
              <a-menu-divider />
              <a-menu-item key="logout" @click="handleLogout">
                <LogoutOutlined />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import {
  CloudServerOutlined,
  ClusterOutlined,
  CodeOutlined,
  DownOutlined,
  FunctionOutlined,
  ImportOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const menuKeys = ['/model/input-output', '/model/development', '/model/operators', '/model/deployment', '/model/jobs'];
const resolveSelectedKey = (path: string) => menuKeys.find((key) => path.startsWith(key)) || path;
const selectedKeys = ref<string[]>([resolveSelectedKey(route.path)]);

// 监听路由变化，更新选中的菜单
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [resolveSelectedKey(newPath)];
  },
);

// 处理菜单点击
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key);
};

// 获取角色显示文本
const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    user: '普通用户',
    guest: '访客',
  };
  return roleMap[role] || role;
};

// 处理退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    message.success('退出成功');
    router.push('/login');
  } catch (error) {
    message.error('退出失败');
  }
};
</script>

<style scoped>
.app-header {
  border-bottom: 1px solid #2e5e83;
  padding: 0 var(--spacing-lg);
  height: 48px;
  line-height: 48px;
  position: sticky;
  top: 0;
  z-index: 999;
  backdrop-filter: blur(22px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

/* 左侧区域 */
.left-section {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 20px;
}

/* Logo 区域 */
.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding-right: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.logo-section:hover {
  transform: translateY(-1px);
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  letter-spacing: 0.5px;
}

/* 横向菜单 */
.header-menu {
  flex: 1;
  border-bottom: none;
  line-height: 62px;
}

.header-menu :deep(.ant-menu-item),
.header-menu :deep(.ant-menu-submenu-title) {
  top: 0;
  color: var(--text-secondary) !important;
  transition:
    color 0.2s ease,
    background 0.2s ease;
  border-radius: var(--radius-md);
}

.header-menu :deep(.ant-menu-item:hover),
.header-menu :deep(.ant-menu-submenu-title:hover) {
  color: var(--text-white) !important;
  background: rgba(255, 255, 255, 0.12);
}

.header-menu :deep(.ant-menu-item-selected) {
  color: var(--text-white) !important;
  background: rgba(255, 255, 255, 0.18) !important;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

/* 用户信息区域 */
.user-section {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid transparent;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 24px rgba(9, 16, 32, 0.35);
  border-color: rgba(255, 255, 255, 0.12);
}

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.4;
}

.username {
  font-size: 14px;
  color: var(--text-white);
  font-weight: 600;
}

.user-role {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 400;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary);
  transition: transform 0.3s;
}

.user-info:hover .dropdown-icon {
  transform: translateY(2px);
}

/* 下拉菜单用户详情 */
.user-info-detail {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(138deg, rgba(49, 69, 103, 0.95) 0%, rgba(41, 60, 92, 0.88) 100%);
  margin: 4px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.user-detail-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-nickname {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-white);
}

.detail-username {
  font-size: 13px;
  color: var(--text-secondary);
}

.detail-email {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-menu :deep(.ant-menu-submenu-title),
  .header-menu :deep(.ant-menu-item) {
    padding: 0 12px;
  }
}

@media (max-width: 992px) {
  .header-menu {
    display: none;
  }

  .logo-section {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .logo-text {
    display: none;
  }

  .user-text {
    display: none;
  }

  .app-header {
    padding: 0 var(--spacing-md);
  }
}
</style>
