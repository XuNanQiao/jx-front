import { type Dayjs } from "dayjs";
import dayjs from "dayjs";

type TimeRangeType = "0" | "1" | "7" | "30" | "custom";

/**
 * 时间范围筛选逻辑复用
 */
export function useTimeRangeFilter() {
  /**
   * 根据时间范围类型和自定义日期范围生成起止时间
   */
  const getTimeRange = (
    timeRangeType: TimeRangeType,
    dateRange: [Dayjs, Dayjs] | null,
  ): { start_time?: string; end_time?: string } => {
    const format = "YYYY-MM-DD HH:mm:ss";

    switch (timeRangeType) {
      case "0": // 最近（今天）
        return {
          start_time: dayjs().startOf("day").format(format),
          end_time: dayjs().format(format),
        };

      case "1": // 昨天
        return {
          start_time: dayjs().subtract(1, "day").startOf("day").format(format),
          end_time: dayjs().subtract(1, "day").endOf("day").format(format),
        };

      case "7": // 最近一周
        return {
          start_time: dayjs().subtract(7, "day").format(format),
          end_time: dayjs().format(format),
        };

      case "30": // 最近一月
        return {
          start_time: dayjs().subtract(30, "day").format(format),
          end_time: dayjs().format(format),
        };

      case "custom": // 自定义
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
export function dayjsFormat(date: Dayjs | null, format = "YYYY-MM-DD HH:mm:ss"): string {
  return date ? date.format(format) : "";
}
export const formatDateTime = (value: dayjs.ConfigType) =>
  value && dayjs(value).isValid() ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "-";

export const formatDurationWithStart = (start: dayjs.ConfigType, end: dayjs.ConfigType) => {
  const startTime = start ? dayjs(start) : null;
  const endTime = end ? dayjs(end) : null;

  if (!startTime || !startTime.isValid()) return "-";

  const base = formatDateTime(startTime);
  if (!endTime || !endTime.isValid()) return base;

  let diffSeconds = endTime.diff(startTime, "second");
  if (diffSeconds < 0) diffSeconds = 0;

  const days = Math.floor(diffSeconds / 86400);
  const hours = Math.floor((diffSeconds % 86400) / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days}天`);
  if (hours) parts.push(`${hours}小时`);
  if (parts.length < 2 && minutes) parts.push(`${minutes}分`);
  if (parts.length < 2 && seconds) parts.push(`${seconds}秒`);

  if (!parts.length) parts.push("0秒");

  return `${base}（${parts.join("")}）`;
};
