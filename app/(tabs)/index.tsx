import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { postService } from '@/services/post-service';
import { PostListItem } from '@/types/post';
import { PostCard } from '@/components/post-card';
import { SearchBar } from '@/components/search-bar';
import { Pagination } from '@/components/pagination';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';

export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const canCreate = isAuthenticated && user && (user.role === 'professor' || user.role === 'admin');

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
      setRefreshing(false);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      fetchPosts(1);
      return;
    }
    try {
      setLoading(true);
      const result = await postService.searchPosts(query);
      setPosts(result.data);
      setTotalPages(1);
      setPage(1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setSearchQuery('');
      fetchPosts(1);
    }, [fetchPosts])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    fetchPosts(1);
  };

  const handlePageChange = (newPage: number) => {
    setLoading(true);
    fetchPosts(newPage);
  };

  if (loading && !refreshing) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <SearchBar onSearch={handleSearch} placeholder="Buscar posts..." />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => router.push(`/posts/${item.id}`)}
          />
        )}
        ListEmptyComponent={<EmptyState message="Nenhum post encontrado" />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#ED145B']} />
        }
        ListFooterComponent={
          !searchQuery ? (
            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          ) : null
        }
        contentContainerStyle={posts.length === 0 ? styles.emptyList : undefined}
      />

      {canCreate && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/posts/criar')}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ED145B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 30,
  },
});
