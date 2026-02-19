import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, page <= 1 && styles.buttonDisabled]}
        onPress={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <Text style={[styles.buttonText, page <= 1 && styles.textDisabled]}>Anterior</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        {page} de {totalPages}
      </Text>

      <TouchableOpacity
        style={[styles.button, page >= totalPages && styles.buttonDisabled]}
        onPress={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <Text style={[styles.buttonText, page >= totalPages && styles.textDisabled]}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ED145B',
    borderRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  textDisabled: {
    color: '#999',
  },
  info: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
