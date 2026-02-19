import { Tabs, router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/auth-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, user, logout } = useAuth();

  const isPrivileged = isAuthenticated && user && (user.role === 'professor' || user.role === 'admin');

  const handleAuthPress = async () => {
    if (isAuthenticated) {
      await logout();
      router.replace('/(tabs)');
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: { backgroundColor: '#ED145B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarButton: HapticTab,
        headerRight: () => (
          <TouchableOpacity onPress={handleAuthPress} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>
              {isAuthenticated ? 'Sair' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Posts',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="professores"
        options={{
          title: 'Professores',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
          href: isAuthenticated ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="alunos"
        options={{
          title: 'Alunos',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
          href: isAuthenticated ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
          href: isPrivileged ? undefined : null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
