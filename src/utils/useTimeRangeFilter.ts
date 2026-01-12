import { type Dayjs } from 'dayjs';
import dayjs from 'dayjs';

type TimeRangeType = '0' | '1' | '7' | '30' | 'custom';

/**
 * 时间范围筛选逻辑复用
 */
export function useTimeRangeFilter() {
  /**
   * 根据时间范围类型和自定义日期范围生成起止时间
   */
  const getTimeRange = (
    timeRangeType: TimeRangeType,
    dateRange: [Dayjs, Dayjs] | null
  ): { start_time?: string; end_time?: string } => {
    const format = 'YYYY-MM-DD HH:mm:ss';

    switch (timeRangeType) {
      case '0': // 最近（今天）
        return {
          start_time: dayjs().startOf('day').format(format),
          end_time: dayjs().format(format),
        };

      case '1': // 昨天
        return {
          start_time: dayjs().subtract(1, 'day').startOf('day').format(format),
          end_time: dayjs().subtract(1, 'day').endOf('day').format(format),
        };

      case '7': // 最近一周
        return {
          start_time: dayjs().subtract(7, 'day').format(format),
          end_time: dayjs().format(format),
        };

      case '30': // 最近一月
        return {
          start_time: dayjs().subtract(30, 'day').format(format),
          end_time: dayjs().format(format),
        };

      case 'custom': // 自定义
        if (dateRange && dateRange.length === 2) {
          return {
            start_time: dateRange[0].format(format),
            end_time: dateRange[1].format(format),
          };
        }
        return {};

      default:
        return {};
    }
  };

  return {
    getTimeRange,
  };
}
export function dayjsFormat(date: Dayjs | null, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return date ? date.format(format) : '';
}
