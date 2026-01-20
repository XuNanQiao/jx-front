/*
 * @Author: ZHAO
 * @Date: 2026-01-09 09:42:30
 * @LastEditTime: 2026-01-20 17:20:44
 * @LastEditors: ZHAO
 * @Description:
 * @FilePath: \jx\src\utils\useTablePagination.ts
 *
 */
import { reactive } from "vue";

/**
 * 表格分页逻辑复用
 */
export function useTablePagination(initialPageSize = 10) {
  const pagination = reactive({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  });

  const handleTableChange = (pag: any) => {
    if (pag.current) pagination.current = pag.current;
    if (pag.pageSize) pagination.pageSize = pag.pageSize;
  };

  const resetPagination = () => {
    pagination.current = 1;
  };

  return {
    pagination,
    handleTableChange,
    resetPagination,
  };
}
