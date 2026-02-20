import { Tabs, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ROLE_COLORS: Record<string, string> = {
  professor: 'rgba(255,255,255,0.3)',
  student: '#00b894',
};

const ROLE_LABELS: Record<string, string> = {
  professor: 'Prof',
  student: 'Aluno',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, user, logout } = useAuth();

  const isPrivileged = isAuthenticated && user?.role === 'professor';

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
        headerRight: () =>
          isAuthenticated && user ? (
            <View style={styles.headerRight}>
              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {user.name.split(' ')[0]}
                </Text>
                <View
                  style={[
                    styles.roleBadge,
                    { backgroundColor: ROLE_COLORS[user.role] ?? '#888' },
                  ]}
                >
                  <Text style={styles.roleText}>
                    {ROLE_LABELS[user.role] ?? user.role}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleAuthPress} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Sair</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleAuthPress} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Entrar</Text>
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
        name="meus-posts"
        options={{
          title: 'Meus Posts',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="pencil" color={color} />
          ),
          href: isAuthenticated && user?.role === 'student' ? undefined : null,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  roleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
