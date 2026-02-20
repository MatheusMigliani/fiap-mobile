import { authService } from '@/services/auth-service';
import { storage } from '@/services/storage';
import { AuthState, User } from '@/types/auth';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const SECURE_KEY_TOKEN = 'auth_token';
const SECURE_KEY_USER = 'auth_user';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Lê token e user do SecureStore durante o boot do app
export const restoreToken = createAsyncThunk(
  'auth/restoreToken',
  async (): Promise<{ user: User; token: string } | null> => {
    const token = await storage.getItem(SECURE_KEY_TOKEN);
    const userJson = await storage.getItem(SECURE_KEY_USER);

    if (token && userJson) {
      const user = JSON.parse(userJson) as User;
      return { user, token };
    }

    return null;
  }
);

// Autentica com a API e persiste token + user no SecureStore
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(email, password);

      const apiUser = response.data.user;
      const user: User = {
        id: apiUser.id ?? (apiUser as any)._id,
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role,
        createdAt: apiUser.createdAt,
      };

      await storage.setItem(SECURE_KEY_TOKEN, response.token);
      await storage.setItem(SECURE_KEY_USER, JSON.stringify(user));

      return { user, token: response.token };
    } catch (error: any) {
      console.error('[auth/login] Erro no thunk de login:', error);
      return rejectWithValue(error.message || 'E-mail ou senha incorretos');
    }
  }
);

// Remove token e user do SecureStore
export const logout = createAsyncThunk('auth/logout', async () => {
  await storage.deleteItem(SECURE_KEY_TOKEN);
  await storage.deleteItem(SECURE_KEY_USER);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // restoreToken
      .addCase(restoreToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(restoreToken.rejected, (state) => {
        state.isLoading = false;
      })

      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })

      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
