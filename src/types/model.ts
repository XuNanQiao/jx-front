export interface ModelInputOutput {
  id: string
  name: string // 模型输入输出名称
  attribute: string // 属性
  category: string // 类别
  integrity: number // 完整度
  dataInput: string // 数据输入时间
  dataInputTrend: number[] // 数据输入趋势数据（用于折线图）
  cycleTime: number // 周期（毫秒）
  createdTime: string // 创建时间
  createdUserId: string // 创建人
  updatedTime?: string // 更新时间
  updatedUserId?: string // 更新人
}

export interface TableFilterParams {
  completenessDateRange?: [string, string] | null
  dataInputDateRange?: [string, string] | null
}

// 模型输入输出数据结构
export interface DataStructure {
  id: string
  column: string // 列名
  name: string // 显示名称
  data_type?: string // 数据类型（下划线命名，后端返回）
  model_input_output_id?: string // 模型输入输出主键ID（下划线命名）
  created_time?: string // 创建时间（下划线命名）
  created_user_id?: string // 创建人（下划线命名）
  updated_time?: string // 更新时间（下划线命名）
  updated_user_id?: string // 更新人（下划线命名）
}

// 数据库连接配置
export interface DatabaseConfig {
  id: string
  databaseCategory: string // 数据库类别 (MySQL, PostgreSQL, InfluxDB, Kingbase)
  connectionConfig: Record<string, any> // 数据库连接配置
  modelInputOutputId: number // 模型输入输出主键ID
  createdTime: string // 创建时间
  createdUserId: string // 创建人
  updatedTime?: string // 更新时间
  updatedUserId?: string // 更新人
}
export interface DataBrowseParams {
  device_instance?: string;
  data_columns?: string[];
  time_range_type?: string;
  start_date?: string;
  end_date?: string;
  sort_order?: "asc" | "desc" | "none";
  data_type?: string;
  sampling_rate?: number;
  current?: number;
  page_size?: number;
}

// 不同数据库的连接配置接口
export interface MySQLConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  charset?: string
}

export interface PostgreSQLConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  schema?: string
}

export interface InfluxDBConfig {
  url: string
  token: string
  org: string
  bucket: string
}

export interface KingbaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  schema?: string
}
