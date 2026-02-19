import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PostFormProps {
  initialValues?: {
    title?: string;
    content?: string;
  };
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  submitLabel?: string;
}

export function PostForm({
  initialValues,
  onSubmit,
  submitLabel = 'Publicar',
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Título é obrigatório';
    if (!content.trim()) newErrors.content = 'Conteúdo é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Título"
        placeholder="Título do post"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
      />
      <Input
        label="Conteúdo"
        placeholder="Escreva o conteúdo do post..."
        value={content}
        onChangeText={setContent}
        error={errors.content}
        multiline
        numberOfLines={10}
        style={styles.contentInput}
        textAlignVertical="top"
      />
      <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  contentInput: {
    minHeight: 200,
  },
});
