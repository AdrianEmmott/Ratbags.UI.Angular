import { Comment } from './comment';

export interface ArticleListItem {
  id: string;
  title: string;
  description: string;
  thumbnailImageUrl: string;
  commentCount: number;
  published: Date;
}
