import { Comment } from './comment';

export interface Article {
  id: string;
  title: string;
  description?: string | null;
  introduction?: string | null;
  content: string;
  bannerImageUrl?: string | null;
  created: Date;
  updated: Date;
  publishDate: Date;
  comments: Comment[];
  authorUserId?: string;
  authorName?: string;
  views?: number;
}
