import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Article } from '../../../../../interfaces/article';
import { Comment } from '../../../../../interfaces/comment';
import { ComemntsService } from '../../../../../services/comments.service';

// icons
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../../../../../services/account/accounts.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  @Input() article: Article | undefined;
  @Input() isLoggedIn: boolean = false;
  @Output() getComments = new EventEmitter<void>();

  commenterUserId: string | undefined;

  form?: FormGroup;

  // icons
  faCommentAlt = faCommentAlt;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private commentsService: ComemntsService,
    private toastrService: ToastrService,
    private accountsService: AccountsService) { }

  ngOnInit() {
    this.setupForm();

    const decodedToken = this.accountsService.decodeToken();

    if (decodedToken) {
      this.commenterUserId = this.accountsService.userId ?? undefined;
    }
  }

  setupForm() {
    if (this.article && this.article.id.length > 0) {
      this.form = new FormGroup({
        articleId: new FormControl (this.article?.id),
        comment: new FormControl ('', [Validators.required])
      });
    }
  }

  addComment() {
    if (this.article && this.form && this.commenterUserId) {
      let comment: Comment = {
        articleId: this.article.id,
        content: this.form.controls['comment'].value,
        published: new Date().toISOString(),
        userId: this.commenterUserId
      };

      this.commentsService.create(comment)
        .subscribe(
          {
            next:
              result => {
                this.getComments.emit();
              },
            error: error => {
              console.error('error adding comment:', error);
              this.toastrService.error(`Sorry, there was an error adding your comment`);
            }
          }
        );
    }
  }
}
