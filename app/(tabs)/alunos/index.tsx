import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router, useFocusEffect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { studentService } from '@/services/student-service';
import { UserListItem } from '@/types/user';
import { Pagination } from '@/components/pagination';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function AlunosScreen() {
  const { user } = useAuth();
  const [students, setStudents] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const canManage = user && (user.role === 'professor' || user.role === 'admin');

  const fetchStudents = useCallback(async (pageNum = 1) => {
    try {
      const result = await studentService.getStudents(pageNum, 10);
      setStudents(result.data);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStudents(1);
    }, [fetchStudents])
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await studentService.deleteStudent(deleteTarget);
      setDeleteTarget(null);
      fetchStudents(page);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao excluir');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: 'Alunos' }} />
      <View style={styles.container}>
        {canManage && (
          <Button
            title="Novo Aluno"
            onPress={() => router.push('/(tabs)/alunos/criar')}
            style={styles.addButton}
          />
        )}

        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              {canManage && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => router.push(`/(tabs)/alunos/${item.id}`)}
                  >
                    <Text style={styles.editText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => setDeleteTarget(item.id)}
                  >
                    <Text style={styles.deleteText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListEmptyComponent={<EmptyState message="Nenhum aluno encontrado" />}
          ListFooterComponent={
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setLoading(true); fetchStudents(p); }} />
          }
          contentContainerStyle={students.length === 0 ? styles.emptyList : undefined}
        />

        <ConfirmDialog
          visible={!!deleteTarget}
          title="Excluir Aluno"
          message="Tem certeza que deseja excluir este aluno?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmText="Excluir"
          loading={deleting}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  addButton: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#ED145B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyList: {
    flexGrow: 1,
  },
});
