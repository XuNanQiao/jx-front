<!--
 * @Author: ZHAO
 * @Date: 2026-01-07 15:30:00
 * @LastEditTime: 2026-01-12 14:21:05
 * @LastEditors: ZHAO
 * @Description: 数据上传页面
 * @FilePath: \jx\src\views\InputOutput\tabs\DataUpload.vue
 *
-->
<template>
  <div class="data-upload page">
    <!-- 顶部操作栏 --> 
    <div class="upload-header">
      <div class="header-left">
        <a-button size="small"  @click="handleRefresh">
          <template #icon>
            <ReloadOutlined />
          </template>
          刷新
        </a-button>
        <div class="switch-item">
          <span class="switch-label">自动监控</span>
          <a-switch v-model:checked="autoMonitor" @change="handleAutoMonitorChange" />
        </div>
      </div>
      <div class="header-right">
        <a-button size="small"  @click="handleConfig">
          <template #icon>
            <SettingOutlined />
          </template>
          配置
        </a-button>
        <a-button size="small"  @click="handleBatchUpload">
          <template #icon>
            <UploadOutlined />
          </template>
          批量上传
        </a-button>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="upload-content">
      <!-- 左侧：文件管理区 -->
      <div class="file-panel">
        <div class="panel-header">
          <div class="header-left">
            <HomeOutlined class="home-icon" />
          </div>
          <div class="header-right">
            <a-button size="small" danger  @click="handleDeleteAll">全部删除</a-button>
            <a-button size="small"  @click="handleRetryAll">全部重试</a-button>
          </div>
        </div>

        <a-tabs v-model:activeKey="fileTabKey" class="file-tabs">
          <a-tab-pane key="all" tab="全部">
            <a-table :columns="fileColumns" :data-source="allFiles" :pagination="false" :scroll="{ y: 'calc(100vh - 400px)' }" row-key="id" size="small" class="file-table">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fileName'">
                  <div class="file-name">
                    <FileOutlined class="file-icon" />
                    <span>{{ record.fileName }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'fileSize'">
                  {{ formatFileSize(record.fileSize) }}
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small" @click="handleRetry(record)">重试</a-button>
                    <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
                  </a-space>
                </template>
              </template>
              <template #emptyText>
                <a-empty description="暂无数据" />
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane key="pending" tab="待处理">
            <a-table :columns="fileColumns" :data-source="pendingFiles" :pagination="false" :scroll="{ y: 'calc(100vh - 400px)' }" row-key="id" size="small" class="file-table">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fileName'">
                  <div class="file-name">
                    <FileOutlined class="file-icon" />
                    <span>{{ record.fileName }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'fileSize'">
                  {{ formatFileSize(record.fileSize) }}
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small" @click="handleRetry(record)">重试</a-button>
                    <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
                  </a-space>
                </template>
              </template>
              <template #emptyText>
                <a-empty description="暂无数据" />
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane key="failed" tab="失败">
            <a-table :columns="fileColumns" :data-source="failedFiles" :pagination="false" :scroll="{ y: 'calc(100vh - 400px)' }" row-key="id" size="small" class="file-table">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'fileName'">
                  <div class="file-name">
                    <FileOutlined class="file-icon" />
                    <span>{{ record.fileName }}</span>
                  </div>
                </template>
                <template v-else-if="column.key === 'fileSize'">
                  {{ formatFileSize(record.fileSize) }}
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-space>
                    <a-button type="link" size="small" @click="handleRetry(record)">重试</a-button>
                    <a-button type="link" size="small" danger @click="handleDelete(record)">删除</a-button>
                  </a-space>
                </template>
              </template>
              <template #emptyText>
                <a-empty description="暂无数据" />
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 右侧：日志区 -->
      <div class="log-panel">
        <div class="panel-header">
          <div class="header-left">
            <span class="panel-title">日志</span>
          </div>
          <div class="header-right">
            <div class="switch-item">
              <span class="switch-label">自动执行</span>
              <a-switch v-model:checked="autoExecute" size="small" @change="handleAutoExecuteChange" />
            </div>
            <a-button size="small"  @click="handleDownloadLog">
              <template #icon>
                <DownloadOutlined />
              </template>
              下载日志
            </a-button>
            <a-button size="small" danger  @click="handleClearLog">
              <template #icon>
                <DeleteOutlined />
              </template>
              清除日志
            </a-button>
          </div>
        </div>

        <div class="log-content">
          <div v-for="log in logs" :key="log.id" :class="['log-item', `log-${log.type}`]">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
          <div v-if="logs.length === 0" class="log-empty">
            <a-empty description="暂无日志" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { message } from "ant-design-vue";
import { ReloadOutlined, SettingOutlined, UploadOutlined, HomeOutlined, FileOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons-vue";

// 自动监控开关
const autoMonitor = ref(false);
// 自动执行开关
const autoExecute = ref(false);
// 文件标签页
const fileTabKey = ref("all");

// 文件列表数据
interface FileItem {
  id: string;
  fileName: string;
  fileSize: number;
  createTime: string;
  status: "pending" | "failed" | "success";
}

const allFiles = ref<FileItem[]>([]);
const pendingFiles = computed(() => allFiles.value.filter((f) => f.status === "pending"));
const failedFiles = computed(() => allFiles.value.filter((f) => f.status === "failed"));

// 文件表格列
const fileColumns = [
  {
    title: "文件名称",
    key: "fileName",
    dataIndex: "fileName",
    ellipsis: true,
  },
  {
    title: "文件大小",
    key: "fileSize",
    dataIndex: "fileSize",
    width: 120,
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
    width: 180,
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    fixed: "right",
  },
];

// 日志数据
interface LogItem {
  id: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
}

const logs = ref<LogItem[]>([]);

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// 添加日志
const addLog = (type: LogItem["type"], message: string) => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  logs.value.unshift({
    id: Date.now().toString(),
    time,
    type,
    message,
  });
  // 限制日志数量
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(0, 100);
  }
};

// 刷新
const handleRefresh = () => {
  message.success("刷新成功");
  addLog("info", "刷新文件列表");
};

// 自动监控开关
const handleAutoMonitorChange = (checked: boolean) => {
  if (checked) {
    message.success("已开启自动监控");
    addLog("success", "自动监控已开启");
  } else {
    message.info("已关闭自动监控");
    addLog("info", "自动监控已关闭");
  }
};

// 配置
const handleConfig = () => {
  message.info("配置功能开发中");
  addLog("info", "打开配置页面");
};

// 批量上传
const handleBatchUpload = () => {
  message.info("批量上传功能开发中");
  addLog("info", "开始批量上传");
};

// 全部删除
const handleDeleteAll = () => {
  if (allFiles.value.length === 0) {
    message.warning("暂无文件可删除");
    return;
  }
  allFiles.value = [];
  message.success("已删除全部文件");
  addLog("warning", "删除全部文件");
};

// 全部重试
const handleRetryAll = () => {
  if (failedFiles.value.length === 0) {
    message.warning("暂无失败文件需要重试");
    return;
  }
  message.success(`正在重试 ${failedFiles.value.length} 个文件`);
  addLog("info", `重试 ${failedFiles.value.length} 个失败文件`);
};

// 重试单个文件
const handleRetry = (record: FileItem) => {
  message.success(`正在重试文件：${record.fileName}`);
  addLog("info", `重试文件：${record.fileName}`);
};

// 删除单个文件
const handleDelete = (record: FileItem) => {
  const index = allFiles.value.findIndex((f) => f.id === record.id);
  if (index > -1) {
    allFiles.value.splice(index, 1);
    message.success("删除成功");
    addLog("warning", `删除文件：${record.fileName}`);
  }
};

// 自动执行开关
const handleAutoExecuteChange = (checked: boolean) => {
  if (checked) {
    message.success("已开启自动执行");
    addLog("success", "自动执行已开启");
  } else {
    message.info("已关闭自动执行");
    addLog("info", "自动执行已关闭");
  }
};

// 下载日志
const handleDownloadLog = () => {
  if (logs.value.length === 0) {
    message.warning("暂无日志可下载");
    return;
  }
  message.success("正在下载日志");
  addLog("info", "下载日志文件");
};

// 清除日志
const handleClearLog = () => {
  if (logs.value.length === 0) {
    message.warning("暂无日志可清除");
    return;
  }
  logs.value = [];
  message.success("日志已清除");
};

// 初始化日志
addLog("info", "系统启动，等待文件上传");
</script>

<style scoped lang="scss">
.data-upload {
  height: 100%;
  display: flex;
  flex-direction: column;

  .upload-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .header-left,
    .header-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }

 
  }

  .upload-content {
    flex: 1;
    display: flex;
    gap: 16px;
    overflow: hidden;

    .file-panel {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .header-left {
          .home-icon {
            font-size: 18px;
            color: #1890ff;
          }
        }

        .header-right {
          display: flex;
          gap: 8px;
        }
      }

      .file-tabs {
        flex: 1;
        overflow: hidden;

        :deep(.ant-tabs-content-holder) {
          overflow: auto;
        }
      }

      .file-name {
        display: flex;
        align-items: center;
        gap: 8px;

        .file-icon {
          color: #1890ff;
        }
      }
    }

    .log-panel {
      width: 400px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        .header-left {
          .panel-title {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
          }
        }

        .header-right {
          display: flex;
          gap: 8px;
          align-items: center;

          .switch-item {
            display: flex;
            align-items: center;
            gap: 6px;

            .switch-label {
              color: #ffffff;
              font-size: 13px;
            }
          }
        }
      }

      .log-content {
        flex: 1;
        overflow-y: auto;
        padding: 12px;

        .log-item {
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 4px;
          font-size: 13px;
          line-height: 1.5;
          background: rgba(255, 255, 255, 0.03);
          border-left: 3px solid;

          .log-time {
            color: rgba(255, 255, 255, 0.6);
            margin-right: 12px;
            font-family: monospace;
          }

          .log-message {
            color: #ffffff;
          }

          &.log-info {
            border-left-color: #1890ff;
          }

          &.log-success {
            border-left-color: #52c41a;
          }

          &.log-warning {
            border-left-color: #faad14;
          }

          &.log-error {
            border-left-color: #f5222d;
          }
        }

        .log-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
      }
    }
  }
}

:deep(.ant-tabs) {
  .ant-tabs-nav {
    margin-bottom: 0;
    padding: 0 16px;
  }

  .ant-tabs-content {
    height: 100%;
  }

  .ant-tabs-tabpane {
    height: 100%;
    padding: 16px;
  }
}

:deep(.file-table) {
  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.85);
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(255, 255, 255, 0.05);
  }
}

// 滚动条样式
.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.log-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}
</style>
