import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useFocusEffect, router, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { postService } from '@/services/post-service';
import { Post } from '@/types/post';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  const canEdit = isAuthenticated && user && (user.role === 'professor' || user.role === 'admin');

  useFocusEffect(
    useCallback(() => {
      const fetchPost = async () => {
        try {
          const result = await postService.getPost(id);
          setPost(result.data);
        } catch {
          setPost(null);
        } finally {
          setLoading(false);
        }
      };
      setLoading(true);
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

        {canEdit && (
          <Button
            title="Editar Post"
            onPress={() => router.push(`/posts/editar/${id}`)}
            style={styles.editButton}
          />
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
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
  author: {
    fontSize: 15,
    color: '#ED145B',
    fontWeight: '600',
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  body: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    marginTop: 24,
  },
});
