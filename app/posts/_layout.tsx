import { Stack } from 'expo-router';

export default function PostsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ED145B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    />
  );
}
