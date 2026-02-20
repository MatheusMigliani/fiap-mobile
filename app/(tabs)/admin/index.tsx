import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { postService } from '@/services/post-service';
import { professorService } from '@/services/professor-service';
import { studentService } from '@/services/student-service';
import { PostListItem } from '@/types/post';
import { CreateUserDto, UpdateUserDto, UserListItem } from '@/types/user';
import { Stack, useFocusEffect } from 'expo-router';
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

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'posts' | 'professors' | 'students';

interface UserFormState {
  name: string;
  email: string;
  password: string;
}

interface PostFormState {
  title: string;
  content: string;
  author: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );
}

// ─── Generic User Form Modal ─────────────────────────────────────────────────

function UserFormModal({
  visible,
  title,
  initial,
  isNew,
  saving,
  onSave,
  onClose,
}: {
  visible: boolean;
  title: string;
  initial: UserFormState;
  isNew: boolean;
  saving: boolean;
  onSave: (data: UserFormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UserFormState>(initial);

  // Reset when modal opens with new initial
  React.useEffect(() => { setForm(initial); }, [initial, visible]);

  const set = (key: keyof UserFormState) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={set('name')} placeholder="Nome completo" />

          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={form.email} onChangeText={set('email')} placeholder="email@fiap.com.br" keyboardType="email-address" autoCapitalize="none" />

          {isNew && (
            <>
              <Text style={styles.label}>Senha</Text>
              <TextInput style={styles.input} value={form.password} onChangeText={set('password')} placeholder="Senha" secureTextEntry />
            </>
          )}

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.disabledBtn]}
              onPress={() => onSave(form)}
              disabled={saving}
            >
              {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Salvar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Post Form Modal ──────────────────────────────────────────────────────────

function PostFormModal({
  visible,
  title,
  initial,
  saving,
  onSave,
  onClose,
}: {
  visible: boolean;
  title: string;
  initial: PostFormState;
  saving: boolean;
  onSave: (data: PostFormState) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PostFormState>(initial);
  React.useEffect(() => { setForm(initial); }, [initial, visible]);

  const set = (key: keyof PostFormState) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.modalScrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{title}</Text>

            <Text style={styles.label}>Título</Text>
            <TextInput style={styles.input} value={form.title} onChangeText={set('title')} placeholder="Título do post" />

            <Text style={styles.label}>Autor</Text>
            <TextInput style={styles.input} value={form.author} onChangeText={set('author')} placeholder="Nome do autor" />

            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.content}
              onChangeText={set('content')}
              placeholder="Escreva o conteúdo aqui..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.disabledBtn]}
                onPress={() => onSave(form)}
                disabled={saving}
              >
                {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveBtnText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Posts Section ────────────────────────────────────────────────────────────

function PostsSection() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<PostListItem | null>(null);
  const [editInitial, setEditInitial] = useState<PostFormState | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null); // id do post carregando
  const [saving, setSaving] = useState(false);

  const emptyPost: PostFormState = { title: '', content: '', author: '' };

  const fetch = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await postService.getPosts(p, 10);
      setPosts(res.data);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch { setPosts([]); }
    finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => { fetch(1); }, [fetch]));

  const openCreate = () => { setEditTarget(null); setEditInitial(null); setFormVisible(true); };
  const openEdit = async (post: PostListItem) => {
    setLoadingEdit(post.id);
    try {
      const res = await postService.getPost(post.id);
      setEditTarget(post);
      setEditInitial({ title: res.data.title, content: res.data.content, author: res.data.author });
      setFormVisible(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o post');
    } finally {
      setLoadingEdit(null);
    }
  };
  const closeForm = () => { setFormVisible(false); setEditTarget(null); setEditInitial(null); };

  const handleSave = async (data: PostFormState) => {
    if (!data.title.trim() || !data.author.trim()) {
      Alert.alert('Atenção', 'Título e autor são obrigatórios'); return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        await postService.updatePost(editTarget.id, data);
      } else {
        await postService.createPost(data);
      }
      closeForm();
      fetch(page);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await postService.deletePost(deleteTarget);
      setDeleteTarget(null);
      fetch(page);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally { setDeleting(false); }
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.createBtn} onPress={openCreate}>
        <Text style={styles.createBtnText}>+ Novo Post</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#ED145B" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(it) => it.id}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum post encontrado</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardMeta}>{item.author} · {new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={[styles.editBtn, loadingEdit === item.id && styles.disabledBtn]}
                  onPress={() => openEdit(item)}
                  disabled={loadingEdit === item.id}
                >
                  {loadingEdit === item.id
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.actionText}>Editar</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => setDeleteTarget(item.id)}>
                  <Text style={styles.actionText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity disabled={page <= 1} onPress={() => fetch(page - 1)} style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}>
                  <Text style={styles.pageBtnText}>‹ Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>{page} / {totalPages}</Text>
                <TouchableOpacity disabled={page >= totalPages} onPress={() => fetch(page + 1)} style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}>
                  <Text style={styles.pageBtnText}>Próxima ›</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}

      <PostFormModal
        visible={formVisible}
        title={editTarget ? 'Editar Post' : 'Novo Post'}
        initial={editInitial ?? emptyPost}
        saving={saving}
        onSave={handleSave}
        onClose={closeForm}
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
  );
}

// ─── Generic User Section ─────────────────────────────────────────────────────

function UserSection({
  getAll,
  create,
  update,
  remove,
  label,
  badgeColor,
}: {
  getAll: (p: number, limit: number) => Promise<any>;
  create: (data: CreateUserDto) => Promise<any>;
  update: (id: string, data: UpdateUserDto) => Promise<any>;
  remove: (id: string) => Promise<any>;
  label: string;
  badgeColor: string;
}) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<UserListItem | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm: UserFormState = { name: '', email: '', password: '' };
  const initialForm: UserFormState = editTarget
    ? { name: editTarget.name, email: editTarget.email, password: '' }
    : emptyForm;

  const fetch = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await getAll(p, 10);
      setUsers(res.data);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch { setUsers([]); }
    finally { setLoading(false); }
  }, [getAll]);

  useFocusEffect(useCallback(() => { fetch(1); }, [fetch]));

  const openCreate = () => { setEditTarget(null); setFormVisible(true); };
  const openEdit = (u: UserListItem) => { setEditTarget(u); setFormVisible(true); };
  const closeForm = () => { setFormVisible(false); setEditTarget(null); };

  const handleSave = async (data: UserFormState) => {
    if (!data.name.trim() || !data.email.trim()) {
      Alert.alert('Atenção', 'Nome e e-mail são obrigatórios'); return;
    }
    if (!editTarget && !data.password) {
      Alert.alert('Atenção', 'Senha é obrigatória'); return;
    }
    setSaving(true);
    try {
      if (editTarget) {
        const payload: UpdateUserDto = { name: data.name, email: data.email };
        if (data.password) payload.password = data.password;
        await update(editTarget.id, payload);
      } else {
        await create(data as CreateUserDto);
      }
      closeForm();
      fetch(page);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget);
      setDeleteTarget(null);
      fetch(page);
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally { setDeleting(false); }
  };

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.createBtn} onPress={openCreate}>
        <Text style={styles.createBtnText}>+ Novo {label}</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#ED145B" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(it) => it.id}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum {label.toLowerCase()} encontrado</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Badge label={label} color={badgeColor} />
                </View>
                <Text style={styles.cardMeta}>{item.email}</Text>
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
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={styles.pagination}>
                <TouchableOpacity disabled={page <= 1} onPress={() => fetch(page - 1)} style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}>
                  <Text style={styles.pageBtnText}>‹ Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.pageInfo}>{page} / {totalPages}</Text>
                <TouchableOpacity disabled={page >= totalPages} onPress={() => fetch(page + 1)} style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}>
                  <Text style={styles.pageBtnText}>Próxima ›</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}

      <UserFormModal
        visible={formVisible}
        title={editTarget ? `Editar ${label}` : `Novo ${label}`}
        initial={initialForm}
        isNew={!editTarget}
        saving={saving}
        onSave={handleSave}
        onClose={closeForm}
      />
      <ConfirmDialog
        visible={!!deleteTarget}
        title={`Excluir ${label}`}
        message={`Tem certeza que deseja excluir este ${label.toLowerCase()}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText="Excluir"
        loading={deleting}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AdminScreen() {
  const [tab, setTab] = useState<Tab>('posts');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'posts', label: 'Posts' },
    { key: 'professors', label: 'Professores' },
    { key: 'students', label: 'Alunos' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Painel Admin' }} />

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabItem, tab === t.key && styles.tabItemActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabLabel, tab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {tab === 'posts' && <PostsSection />}
        {tab === 'professors' && (
          <UserSection
            label="Professor"
            badgeColor="#ED145B"
            getAll={professorService.getProfessors.bind(professorService)}
            create={professorService.createProfessor.bind(professorService)}
            update={professorService.updateProfessor.bind(professorService)}
            remove={professorService.deleteProfessor.bind(professorService)}
          />
        )}
        {tab === 'students' && (
          <UserSection
            label="Aluno"
            badgeColor="#00b894"
            getAll={studentService.getStudents.bind(studentService)}
            create={studentService.createStudent.bind(studentService)}
            update={studentService.updateStudent.bind(studentService)}
            remove={studentService.deleteStudent.bind(studentService)}
          />
        )}
      </ScrollView>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { paddingBottom: 40 },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: '#ED145B' },
  tabLabel: { fontSize: 14, fontWeight: '600', color: '#999' },
  tabLabelActive: { color: '#ED145B' },

  // Section
  section: { padding: 16 },
  createBtn: {
    backgroundColor: '#ED145B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardBody: { marginBottom: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222', flex: 1 },
  cardMeta: { fontSize: 12, color: '#999', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#ED145B', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#dc3545', paddingVertical: 7, paddingHorizontal: 16, borderRadius: 6 },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  // Badge
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Pagination
  pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 },
  pageBtn: { backgroundColor: '#ED145B', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  pageBtnDisabled: { backgroundColor: '#ccc' },
  pageBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  pageInfo: { color: '#555', fontWeight: '600' },

  empty: { textAlign: 'center', color: '#aaa', marginTop: 32, fontSize: 15 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalScrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#222', marginBottom: 20 },
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
  textArea: { height: 120 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 24 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelBtnText: { color: '#666', fontWeight: '600' },
  saveBtn: {
    flex: 2,
    backgroundColor: '#ED145B',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  disabledBtn: { opacity: 0.6 },
});
