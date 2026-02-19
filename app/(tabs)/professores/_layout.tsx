import { Stack } from 'expo-router';

export default function ProfessoresLayout() {
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
