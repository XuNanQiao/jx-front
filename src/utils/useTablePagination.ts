import { reactive } from 'vue';

/**
 * 表格分页逻辑复用
 */
export function useTablePagination(initialPageSize = 10) {
  const pagination = reactive({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
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
