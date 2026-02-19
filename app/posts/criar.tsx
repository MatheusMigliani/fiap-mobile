import React from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { postService } from '@/services/post-service';
import { PostForm } from '@/components/post-form';

export default function CreatePostScreen() {
  const handleSubmit = async (data: { title: string; content: string }) => {
    await postService.createPost(data);
    Alert.alert('Sucesso', 'Post criado com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Novo Post' }} />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <PostForm onSubmit={handleSubmit} submitLabel="Publicar" />
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
