export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePictureUrl: string | null;
  }
}