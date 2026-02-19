import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserFormProps {
  initialValues?: {
    name?: string;
    email?: string;
  };
  onSubmit: (data: { name: string; email: string; password: string }) => Promise<void>;
  submitLabel?: string;
  isEditing?: boolean;
}

export function UserForm({
  initialValues,
  onSubmit,
  submitLabel = 'Salvar',
  isEditing = false,
}: UserFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!isEditing && !password) newErrors.password = 'Senha é obrigatória';
    if (password && password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), password });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Nome"
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
        error={errors.name}
        autoCapitalize="words"
      />
      <Input
        label="E-mail"
        placeholder="email@exemplo.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label={isEditing ? 'Nova Senha (opcional)' : 'Senha'}
        placeholder={isEditing ? 'Deixe vazio para manter' : 'Mínimo 6 caracteres'}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />
      <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
