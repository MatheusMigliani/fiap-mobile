import { useAuth } from '@/hooks/use-auth';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // While restoring token on boot, render nothing (splash stays visible)
  if (isLoading) return null;

  // User is authenticated — redirect declaratively (fires at render time)
  if (isAuthenticated && user) {
    const destination =
      user.role === 'professor'
        ? '/(tabs)/admin'
        : '/(tabs)';
    return <Redirect href={destination} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
