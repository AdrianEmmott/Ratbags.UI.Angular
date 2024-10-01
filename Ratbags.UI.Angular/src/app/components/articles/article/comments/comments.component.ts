import { Component, Input, OnInit } from '@angular/core';

import { Article } from '../../../../interfaces/article';
import { Comment } from '../../../../interfaces/comment';
import { ComemntsService } from '../../../../services/comments-service';

import { faComments, faMinusSquare, faPlusSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() article: Article | undefined;

  isCollapsed: boolean = false;

  // icons
  faComments = faComments;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  constructor(private commentsService: ComemntsService) { }

  ngOnInit() {

  }

  // only used when adding comments
  getCommentsbyArticleId() {
    if (this.article) {
      this.commentsService.getCommentsByArticleId(this.article?.id)
        .subscribe((results) => {
          if (this.article) {
            this.article.comments = results as Comment[];
          }
        });
    }
  }

  // keep this
  //addComment() {
  //  if (this.article && this.form) {
  //    let comment: Comment = {
  //      articleId: this.article.id,
  //      content: this.form.controls['comment'].value,
  //      published: new Date().toISOString(),
  //      userId: "b9fb9865-34a9-4981-8d6a-0f4c1ee4be37" // just for now...
  //    };

  //    this.commentsService.addComment(comment)
  //      .pipe(
  //        switchMap(() => {
  //          if (this.article) {
  //            return this.commentsService.getCommentsByArticleId(this.article.id);
  //          } else {
  //            return of([] as Comment[]);
  //          }
  //        })
  //      )
  //      .subscribe(
  //        result => {
  //          if (this.article) {
  //            this.article.comments = <Comment[]>result;
  //          }
  //        },
  //        error => {
  //          console.error('error adding comment or retrieving comments:', error);
  //        }
  //      );
  //  }
  //}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
