export interface Comment {
  id?: string;
  articleId: string;
  content: string;
  published: string;
  userId: string;
  commenterName?: string;
}
