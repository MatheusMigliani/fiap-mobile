import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useAuth } from '@/hooks/use-auth';
import { postService } from '@/services/post-service';
import { PostListItem } from '@/types/post';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MeusPostsScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editTarget, setEditTarget] = useState<PostListItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Carrega TODOS os posts e filtra pelo nome do autor
  const fetchMyPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Busca até 100 posts — suficiente para o contexto acadêmico
      const result = await postService.getPosts(1, 100);
      const mine = result.data.filter((p) => p.author === user.name);
      setPosts(mine);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchMyPosts(); }, [fetchMyPosts]));

  const openEdit = (post: PostListItem) => {
    setEditTarget(post);
    setEditTitle(post.title);
    setEditContent(''); // excerpt só, content vem do detalhe — carregamos vazio e o usuário edita
    // Busca conteúdo completo
    postService.getPost(post.id).then((res) => setEditContent(res.data.content)).catch(() => {});
  };

  const closeEdit = () => { setEditTarget(null); setEditTitle(''); setEditContent(''); };

  const handleSave = async () => {
    if (!editTarget) return;
    if (!editTitle.trim()) { Alert.alert('Atenção', 'Título é obrigatório'); return; }
    if (!editContent.trim()) { Alert.alert('Atenção', 'Conteúdo é obrigatório'); return; }
    setSaving(true);
    try {
      await postService.updatePost(editTarget.id, { title: editTitle, content: editContent });
      closeEdit();
      fetchMyPosts();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await postService.deletePost(deleteTarget);
      setDeleteTarget(null);
      fetchMyPosts();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <ActivityIndicator style={styles.centered} color="#ED145B" size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>Nenhum post ainda</Text>
            <Text style={styles.emptyDesc}>Seus posts publicados aparecerão aqui.</Text>
          </View>
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </Text>
              <Text style={styles.excerpt} numberOfLines={3}>{item.excerpt}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteTarget(item.id)}>
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Edit Modal */}
      <Modal visible={!!editTarget} animationType="slide" transparent onRequestClose={closeEdit}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Editar Post</Text>

              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Título do post"
              />

              <Text style={styles.label}>Conteúdo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editContent}
                onChangeText={setEditContent}
                placeholder="Conteúdo do post..."
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={closeEdit}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, saving && styles.disabledBtn]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.saveText}>Salvar</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  emptyList: { flexGrow: 1 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 6 },
  emptyDesc: { fontSize: 14, color: '#999', textAlign: 'center' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardBody: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  cardMeta: { fontSize: 12, color: '#aaa', marginBottom: 8 },
  excerpt: { fontSize: 14, color: '#666', lineHeight: 20 },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: {
    backgroundColor: '#ED145B',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalScroll: { flexGrow: 1, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#222', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: { height: 150 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelText: { color: '#666', fontWeight: '600' },
  saveBtn: {
    flex: 2,
    backgroundColor: '#ED145B',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledBtn: { opacity: 0.6 },
});
