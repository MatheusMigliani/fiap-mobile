export interface User {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'admin' | 'student';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: {
    user: User;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
