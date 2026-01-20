interface DependencyPackage {
  name: string;
  version?: string;
}

interface IOConfig {
  name?: string;
  [key: string]: any;
}

// 模型输入输出 / 模型开发信息
interface ModelInputOutput {
  id?: string;
  name: string; // 模型名称
  node_name_en?: string; // 节点名称（英文）
  version?: string; // 模型版本
  category?: string | number; // 分类：0=其他,1=风机,2=光伏,3=电气
  editor?: string | number; // 编辑器：0=canvas
  input_config?: IOConfig[]; // 模型输入数据源列表
  output_config?: IOConfig[]; // 模型输出数据源列表
  operator_config?: Record<string, any>; // 算子配置
  language?: string; // 编程语言，默认 python32
  levice_type?: string | number; // 设备类型，0=无
  dependency_package?: DependencyPackage[]; // 依赖包列表
  created_time?: string; // 创建时间
  created_user_id?: string; // 创建人
  updated_time?: string; // 更新时间
  updated_user_id?: string; // 更新人
  is_active?: boolean; // 启动状态
  status?: number; // 作业状态

  // 兼容历史字段（Input/Output 模块使用）
  attribute?: string; // 属性/版本别名
  integrity?: number; // 完整度（0-1）
  dataInput?: string; // 数据输入时间
  dataInputTrend?: number[]; // 数据输入趋势数据（用于折线图）
  cycleTime?: number; // 周期（毫秒）
  cycle_time?: number; // 周期（毫秒，后端下划线）
  createdTime?: string; // 创建时间（驼峰）
  createdUserId?: string; // 创建人（驼峰）
  updatedTime?: string; // 更新时间（驼峰）
  updatedUserId?: string; // 更新人（驼峰）
}

interface TableFilterParams {
  completenessDateRange?: [string, string] | null;
  dataInputDateRange?: [string, string] | null;
}

// 模型输入输出数据结构
interface DataStructure {
  id: string;
  column: string; // 列名
  name: string; // 显示名称
  data_type?: string; // 数据类型（下划线命名，后端返回）
  model_input_output_id?: string; // 模型输入输出主键ID（下划线命名）
  created_time?: string; // 创建时间（下划线命名）
  created_user_id?: string; // 创建人（下划线命名）
  updated_time?: string; // 更新时间（下划线命名）
  updated_user_id?: string; // 更新人（下划线命名）
}

// 数据库连接配置
interface DatabaseConfig {
  id: string;
  databaseCategory: string; // 数据库类别 (MySQL, PostgreSQL, InfluxDB, Kingbase)
  connectionConfig: Record<string, any>; // 数据库连接配置
  modelInputOutputId: number; // 模型输入输出主键ID
  createdTime: string; // 创建时间
  createdUserId: string; // 创建人
  updatedTime?: string; // 更新时间
  updatedUserId?: string; // 更新人
}
interface DataBrowseParams {
  model_input_output_id?: string | string[];
  device_value?: string;
  device_instance?: string;
  selected_columns?: string[];
  data_columns?: string[];
  time_range_type?: string;
  start_time?: string;
  end_time?: string;
  start_date?: string;
  end_date?: string;
  sort_order?: "asc" | "desc" | "none";
  data_type?: string;
  sampling_rate?: number;
  page?: number;
  size?: number;
  current?: number;
  page_size?: number;
}

// 不同数据库的连接配置接口
interface MySQLConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  charset?: string;
}

interface PostgreSQLConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
}

interface InfluxDBConfig {
  url: string;
  token: string;
  org: string;
  bucket: string;
}

interface KingbaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
}
