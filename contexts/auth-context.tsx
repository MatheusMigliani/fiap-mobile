import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '@/types/auth';
import { authService } from '@/services/auth-service';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_TOKEN'; payload: { user: User; token: string } };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userJson = await SecureStore.getItemAsync('user');

        if (token && userJson) {
          const user = JSON.parse(userJson) as User;
          dispatch({ type: 'RESTORE_TOKEN', payload: { user, token } });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    restoreToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);

    const user: User = {
      id: response.data.user.id || (response.data.user as any)._id,
      name: response.data.user.name,
      email: response.data.user.email,
      role: response.data.user.role,
      createdAt: response.data.user.createdAt,
    };

    await SecureStore.setItemAsync('token', response.token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));

    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: response.token } });
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
