import Antd from 'ant-design-vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useUserStore } from './stores/user';

import '@/styles/common-table.scss';
import '@/styles/theme.css';
import 'ant-design-vue/dist/reset.css';
import 'uno.css';

dayjs.locale('zh-cn');

const app = createApp(App);

// 创建 Pinia 实例
const pinia = createPinia();
app.use(pinia);

// 初始化用户状态（从 localStorage 恢复 token 和 userInfo）
const userStore = useUserStore();
userStore.initUserInfo();

app.use(router);
app.use(Antd);

app.mount('#app');
