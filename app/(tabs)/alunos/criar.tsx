import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { studentService } from '@/services/student-service';
import { UserForm } from '@/components/user-form';

export default function CreateStudentScreen() {
  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    await studentService.createStudent(data);
    Alert.alert('Sucesso', 'Aluno criado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Novo Aluno' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <UserForm onSubmit={handleSubmit} submitLabel="Criar Aluno" />
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
