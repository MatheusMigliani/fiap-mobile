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
import { postService } from '@/services/post-service';
import { PostListItem } from '@/types/post';
import { Pagination } from '@/components/pagination';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function AdminScreen() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const result = await postService.getPosts(pageNum, 10);
      setPosts(result.data);
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchPosts(1);
    }, [fetchPosts])
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await postService.deletePost(deleteTarget);
      setDeleteTarget(null);
      fetchPosts(page);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao excluir post');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: 'Administração' }} />
      <View style={styles.container}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.author} - {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => router.push(`/posts/editar/${item.id}`)}
                >
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => setDeleteTarget(item.id)}
                >
                  <Text style={styles.btnText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<EmptyState message="Nenhum post encontrado" />}
          ListFooterComponent={
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setLoading(true); fetchPosts(p); }} />
          }
          contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
        />

        <ConfirmDialog
          visible={!!deleteTarget}
          title="Excluir Post"
          message="Tem certeza que deseja excluir este post?"
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardInfo: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  meta: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#ED145B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyList: {
    flexGrow: 1,
  },
});
