export interface UserInfo {
  id: number | string
  username: string
  email?: string
  avatar?: string
  role?: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: UserInfo
}
