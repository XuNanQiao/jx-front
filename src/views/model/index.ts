import { ModelInputOutput } from "@/types/model";
import type { TableColumnType, TableProps } from "ant-design-vue";

// 表格列定义
const columns: TableColumnType<ModelInputOutput>[] = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    sorter: true,
    width: 150,
  },
  {
    title: "属性",
    dataIndex: "attribute",
    key: "attribute",
    width: 120,
  },
  {
    title: "类别",
    dataIndex: "category",
    key: "category",
    width: 120,
  },
  {
    title: "完整度",
    dataIndex: "completeness",
    key: "completeness",
    width: 150,
  },
  {
    title: "数据输入",
    dataIndex: "dataInput",
    key: "dataInput",
    width: 180,
  },
  {
    title: "周期（毫秒）",
    dataIndex: "cycle",
    key: "cycle",
    width: 120,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    sorter: true,
    width: 180,
  },
  {
    title: "创建人",
    dataIndex: "createBy",
    key: "createBy",
    width: 120,
  },
  {
    title: "操作",
    key: "action",
    fixed: "right",
    width: 70,
  },
];
