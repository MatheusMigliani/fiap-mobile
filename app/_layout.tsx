import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store, AppDispatch } from '@/store';
import { restoreToken } from '@/store/slices/authSlice';
import { apiClient } from '@/services/api';

// Liga o apiClient ao Redux store para leitura síncrona do token
apiClient.setTokenGetter(() => store.getState().auth.token);

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(restoreToken());
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="posts" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutInner />
    </Provider>
  );
}
