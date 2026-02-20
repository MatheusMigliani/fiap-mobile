export interface User {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'student';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Representa a forma REAL que a API retorna — _id em vez de id
interface ApiUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'professor' | 'student';
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: {
    user: ApiUser;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
