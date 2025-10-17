export interface UserListInterface {
  name: string;
  email: string;
  id: string;
}
export interface UserInterface {
  name: string;
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  profileImage: string | null;
}

export interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}
