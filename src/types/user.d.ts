interface UserInfo {
  id: number | string;
  username: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  role?: string;
}

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: UserInfo;
}
