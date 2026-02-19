export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PostListItem {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  excerpt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}
