/*
 * @Author: ZHAO
 * @Date: 2026-01-14 09:12:51
 * @LastEditTime: 2026-01-20 14:24:50
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

/* ----------------basicFields----------------- */
export const browseColumns = [
  { dataIndex: "name", title: "作业名称", key: "name" },
  {
    dataIndex: "model_id",
    title: "模型/部署",
    key: "model_id",
    align: "center",
    customRender: ({ text }: any) => `${text}/模型部署`,
  },
  { dataIndex: "input_repo", title: "输入Repo", key: "input_repo", align: "left" },
  { dataIndex: "output_repo", title: "输出Repo", key: "output_repo", align: "left" },
  {
    dataIndex: "data_start_time",
    title: "数据时间（时长）",
    key: "data_start_time",
    width: 150,
    customRender: ({ record }: any) => formatDurationWithStart(record?.data_start_time, record?.data_end_time),
  },
  { dataIndex: "data_rows_nums", title: "数据行", key: "data_rows_nums", align: "left" },
  {
    dataIndex: "exec_log",
    title: "查看日志",
    key: "exec_log",
    align: "center",
  },
  // { dataIndex: 'status', title: '状态', key: 'name' },
  {
    dataIndex: "exec_start_time",
    title: "作业时间（时长）",
    width: 150,
    key: "name",
    align: "left",
    customRender: ({ record }: any) => formatDurationWithStart(record?.exec_start_time, record?.exec_end_time),
  },
  { dataIndex: "created_user_id", title: "创建人", key: "name", align: "center" },
  { dataIndex: "action", title: "操作", key: "action", align: "center", width: 60 },
];
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
    customRender: ({ text }: any) => {
      const status = statusMap[text] || { text: "未知", color: "default" };
      return h(Tag, { color: status.color }, () => status.text);
    },
  },

  {
    dataIndex: "exec_start_time",
    title: "作业时间（时长）",
    width: 150,
    key: "name",
    align: "left",
    customRender: ({ record }: any) => formatDurationWithStart(record?.exec_start_time, record?.exec_end_time),
  },
  { dataIndex: "created_user_id", title: "创建人", key: "name", align: "center" },
  { dataIndex: "action", title: "操作", key: "action", align: "center", width: 60 },
];
