import { apiClient } from './api';
import { Post, PostListItem, CreatePostDto, UpdatePostDto } from '@/types/post';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export const postService = {
  async getPosts(page = 1, limit = 10): Promise<PaginatedResponse<PostListItem>> {
    return apiClient.get(`/api/posts?page=${page}&limit=${limit}`);
  },

  async getPost(id: string): Promise<ApiResponse<Post>> {
    return apiClient.get(`/api/posts/${id}`);
  },

  async searchPosts(query: string): Promise<{ success: boolean; count: number; data: PostListItem[] }> {
    return apiClient.get(`/api/posts/search?q=${encodeURIComponent(query)}`);
  },

  async createPost(data: CreatePostDto): Promise<ApiResponse<Post>> {
    return apiClient.post('/api/posts', data);
  },

  async updatePost(id: string, data: UpdatePostDto): Promise<ApiResponse<Post>> {
    return apiClient.put(`/api/posts/${id}`, data);
  },

  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.delete(`/api/posts/${id}`);
  },
};
