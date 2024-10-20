import { Comment } from './comment';

export interface Article {
  id: string;
  title: string;
  content: string;
  bannerImageUrl?: string;
  created: Date;
  updated: Date;
  publishDate: Date;
  comments: Comment[];
  userId: string;
  authorName?: string;
}
