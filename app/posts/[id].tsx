import { Loading } from '@/components/ui/loading';
import { postService } from '@/services/post-service';
import { Post } from '@/types/post';
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const result = await postService.getPost(id);
          setPost(result.data);
        } catch {
          setPost(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }, [id])
  );

  if (loading) return <Loading />;

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Post não encontrado</Text>
      </View>
    );
  }

  const date = new Date(post.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Stack.Screen options={{ title: 'Post' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.body}>{post.content}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 32,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  author: { fontSize: 15, color: '#ED145B', fontWeight: '600' },
  date: { fontSize: 13, color: '#999' },
  body: { fontSize: 16, color: '#444', lineHeight: 26 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#666' },
});
