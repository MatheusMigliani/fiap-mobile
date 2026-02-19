import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { studentService } from '@/services/student-service';
import { UserListItem } from '@/types/user';
import { UserForm } from '@/components/user-form';
import { Loading } from '@/components/ui/loading';

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [student, setStudent] = useState<UserListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await studentService.getStudent(id);
        setStudent(result.data);
      } catch {
        Alert.alert('Erro', 'Aluno não encontrado');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    const updateData: Record<string, string> = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = data.password;

    await studentService.updateStudent(id, updateData);
    Alert.alert('Sucesso', 'Aluno atualizado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: 'Editar Aluno' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <UserForm
          initialValues={{ name: student?.name, email: student?.email }}
          onSubmit={handleSubmit}
          submitLabel="Salvar"
          isEditing
        />
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
