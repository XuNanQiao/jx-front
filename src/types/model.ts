export interface ModelInputOutput {
  id: string
  name: string
  attribute: string
  category: string
  completeness: number // 完整度百分比
  dataInput: string // 数据输入时间
  dataInputTrend: number[] // 数据输入趋势数据（用于折线图）
  cycle: number // 周期（毫秒）
  createTime: string
  createBy: string
}

export interface TableFilterParams {
  completenessDateRange?: [string, string] | null
  dataInputDateRange?: [string, string] | null
}
