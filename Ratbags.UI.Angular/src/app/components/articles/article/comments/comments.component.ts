import { Component, Input, OnInit } from '@angular/core';

import { Article } from '../../../../interfaces/article';
import { Comment } from '../../../../interfaces/comment';
import { CommentsService } from '../../../../services/comments.service';

import { faComments, faMinusSquare, faPlusSquare } from '@fortawesome/free-regular-svg-icons';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() article: Article | undefined;
  @Input() isLoggedIn: boolean = false;

  isCollapsed: boolean = false;

  // icons
  faComments = faComments;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  constructor(public router: Router,
    private commentsService: CommentsService) { }

  ngOnInit() {
  }

  // only used when adding comments - otherwise articles api gets them
  getCommentsbyArticleId() {
    if (this.article) {
      this.commentsService.getCommentsByArticleId(this.article?.id)
        .subscribe({
          next: (results) => {
            if (this.article) {
              this.article.comments = results as Comment[];
            }
          }
        });
    }
  }
}
