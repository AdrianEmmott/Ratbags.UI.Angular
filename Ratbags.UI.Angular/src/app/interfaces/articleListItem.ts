import { Comment } from './comment';

export interface ArticleListItem {
  id: string;
  title: string;
  description: string;
  thumbnailImageUrl: string;
  imgSrc: string | null;
  commentCount: number;
  published: Date;
}
