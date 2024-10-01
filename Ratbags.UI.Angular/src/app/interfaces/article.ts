import { Comment } from './comment';

export interface Article {
  id: string;
  title: string;
  content: string;
  created: Date;
  updated: Date;
  publishDate: Date;
  comments: Comment[];
  userId: string;
}
