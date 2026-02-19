import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { professorService } from '@/services/professor-service';
import { UserListItem } from '@/types/user';
import { UserForm } from '@/components/user-form';
import { Loading } from '@/components/ui/loading';

export default function EditProfessorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [professor, setProfessor] = useState<UserListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await professorService.getProfessor(id);
        setProfessor(result.data);
      } catch {
        Alert.alert('Erro', 'Professor não encontrado');
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

    await professorService.updateProfessor(id, updateData);
    Alert.alert('Sucesso', 'Professor atualizado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: 'Editar Professor' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <UserForm
          initialValues={{ name: professor?.name, email: professor?.email }}
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
