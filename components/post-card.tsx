import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { PostListItem } from '@/types/post';

interface PostCardProps {
  post: PostListItem;
  onPress: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const date = new Date(post.createdAt).toLocaleDateString('pt-BR');

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
      <Text style={styles.excerpt} numberOfLines={3}>{post.excerpt}</Text>
      <View style={styles.meta}>
        <Text style={styles.author}>{post.author}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    color: '#ED145B',
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
