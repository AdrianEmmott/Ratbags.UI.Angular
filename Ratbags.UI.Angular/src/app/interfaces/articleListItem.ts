import { Comment } from './comment';

export interface ArticleListItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  commentCount: number;
  published: Date;
}
