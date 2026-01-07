export interface UserListInterface {
  name: string;
  email: string;
  id: string;
  role: string;
}
export interface UserInterface {
  name: string;
  email: string;
  role: string;
  password: string;
}

export type UserRole = 'Admin' | 'Sales' | 'Technician';
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAdmin: boolean;
  profileImage: string | null;
}

export interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}
export interface AssignUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}
export interface AssignUser {
  sector: string;
  city: string;
}

