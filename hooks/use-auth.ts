import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { login as loginThunk, logout as logoutThunk } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const login = async (email: string, password: string): Promise<void> => {
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.rejected.match(result)) {
      throw new Error(
        (result.payload as string) || result.error.message || 'E-mail ou senha incorretos'
      );
    }
  };

  const logout = async (): Promise<void> => {
    await dispatch(logoutThunk());
  };

  return { user, token, isLoading, isAuthenticated, login, logout };
}
