/*
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:51
 * @LastEditTime: 2026-01-22 08:49:15
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\views\jobs\indexData.ts
 *
 */
import dayjs from "dayjs";
import { h } from "vue";
import { Tag } from "ant-design-vue";
import { formatDurationWithStart } from "@/utils/useTimeRangeFilter";

// 作业状态选项
export const statusOptions: SelectOption[] = [
  { label: "待执行", value: 0 },
  { label: "执行中", value: 1 },
  { label: "执行成功", value: 2 },
  { label: "执行失败", value: 3 },
];
export const statusMap: Record<string | number, { text: string; color: string }> = {
  0: { text: "待执行", color: "default" },
  1: { text: "执行中", color: "processing" },
  2: { text: "成功", color: "success" },
  3: { text: "失败", color: "error" },
};
// 状态映射:将数字状态码映射为中文状态名称
export const statusJobMap: Record<string, string> = {
  "0": "等待",
  "1": "运行中",
  "2": "成功",
  "3": "失败",
  "4": "计划",
};

// 状态颜色配置
export const statusColors: Record<string, string> = {
  等待: "#faad14",
  运行中: "#1890ff",
  成功: "#52c41a",
  失败: "#ff4d4f",
  计划: "#722ed1",
};
/* ----------------basicFields----------------- */
export const dataStructureColumns = [
  { dataIndex: "name", title: "作业组ID", key: "name" },
  {
    dataIndex: "model_id",
    title: "模型",
    key: "model_id",
    align: "left",
  },
  { dataIndex: "input_repo", title: "输入Repo", key: "input_repo", align: "left" },
  {
    dataIndex: "output_repo",
    title: "状态",
    key: "integrity",
    align: "center",
    width: 80,
    customRender: ({ text }: any) => {
      const status = statusMap[text] || { text: "未知", color: "default" };
      return h(Tag, { color: status.color }, () => status.text);
    },
  },

  {
    dataIndex: "exec_start_time",
    title: "作业时间（时长）",

    key: "name",
    align: "left",
    customRender: ({ record }: any) => formatDurationWithStart(record?.exec_start_time, record?.exec_end_time),
  },
  { dataIndex: "created_user_id", title: "创建人", key: "name", align: "center", width: 100 },
  { dataIndex: "action", title: "操作", key: "action", align: "center", width: 60 },
];
