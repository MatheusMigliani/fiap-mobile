import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { professorService } from '@/services/professor-service';
import { UserForm } from '@/components/user-form';

export default function CreateProfessorScreen() {
  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    await professorService.createProfessor(data);
    Alert.alert('Sucesso', 'Professor criado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Novo Professor' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <UserForm onSubmit={handleSubmit} submitLabel="Criar Professor" />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
