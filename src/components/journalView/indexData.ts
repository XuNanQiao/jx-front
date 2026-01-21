/*
 * @Author: ZHAO
 * @Date: 2026-01-20 17:31:02
 * @LastEditTime: 2026-01-21 13:37:39
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\components\journalView\indexData.ts
 *
 */
import { formatDurationWithStart } from "@/utils/useTimeRangeFilter";

// 作业状态选项
export const statusOptions: SelectOption[] = [
  { label: "待执行", value: 0 },
  { label: "执行中", value: 1 },
  { label: "执行成功", value: 2 },
  { label: "执行失败", value: 3 },
];
export const statusMap: Record<string | number, { text: string; color: string }> = {
  0: { text: "待执行", color: "warning" },
  1: { text: "执行中", color: "processing" },
  2: { text: "成功", color: "success" },
  3: { text: "失败", color: "error" },
};
/* ----------------basicFields----------------- */
export const browseColumns = [
  { dataIndex: "name", title: "作业名称", key: "name", width: 150, ellipsis: true, fixed: "left" },
  {
    dataIndex: "model_id",
    title: "模型/部署",
    key: "model_id",
    align: "center",
    width: 150,
    ellipsis: true,
    customRender: ({ text }: any) => `${text}/模型部署`,
  },
  { dataIndex: "input_repo", title: "输入Repo", key: "input_repo", align: "left", width: 150, ellipsis: true },
  { dataIndex: "output_repo", title: "输出Repo", key: "output_repo", align: "left", width: 150, ellipsis: true },
  {
    dataIndex: "data_start_time",
    title: "数据时间（时长）",
    key: "data_start_time",
    ellipsis: true,
    customRender: ({ record }: any) => formatDurationWithStart(record?.data_start_time, record?.data_end_time),
  },
  { dataIndex: "data_rows_nums", title: "数据行", key: "data_rows_nums", align: "left", width: 100 },
  {
    dataIndex: "exec_log",
    title: "查看日志",
    key: "exec_log",
    align: "center",
    width: 120,
  },
  // { dataIndex: 'status', title: '状态', key: 'name' },
  {
    dataIndex: "exec_start_time",
    title: "作业时间（时长）",
    key: "name",
    align: "left",
    ellipsis: true,
    customRender: ({ record }: any) => formatDurationWithStart(record?.exec_start_time, record?.exec_end_time),
  },
  { dataIndex: "created_user_id", title: "创建人", key: "name", align: "center", width: 100 },
  { dataIndex: "action", title: "操作", key: "action", align: "center", width: 80, fixed: "right" },
];
