import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { postService } from '@/services/post-service';
import { Post } from '@/types/post';
import { PostForm } from '@/components/post-form';
import { Loading } from '@/components/ui/loading';

export default function EditPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await postService.getPost(id);
        setPost(result.data);
      } catch {
        Alert.alert('Erro', 'Post não encontrado');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (data: { title: string; content: string }) => {
    await postService.updatePost(id, data);
    Alert.alert('Sucesso', 'Post atualizado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Stack.Screen options={{ title: 'Editar Post' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <PostForm
          initialValues={{ title: post?.title, content: post?.content }}
          onSubmit={handleSubmit}
          submitLabel="Salvar"
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
