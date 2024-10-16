import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Article } from '../../../../../interfaces/article';
import { Comment } from '../../../../../interfaces/comment';
import { ComemntsService } from '../../../../../services/comments.service';

// icons
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  @Input() article: Article | undefined;
  @Input() isLoggedIn: boolean = false;
  @Output() getComments = new EventEmitter<void>();

  form?: FormGroup;

  // icons
  faCommentAlt = faCommentAlt;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private commentsService: ComemntsService,
    private toastrService: ToastrService) { }

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    if (this.article && this.article.id.length > 0) {
      this.form = this.formBuilder.group({
        articleId: [this.article?.id],
        name: ['', [Validators.required]],
        comment: ['', [Validators.required]]
      });
    }
  }

  addComment() {
    if (this.article && this.form) {
      let comment: Comment = {
        articleId: this.article.id,
        content: this.form.controls['comment'].value,
        published: new Date().toISOString(),
        userId: "b9fb9865-34a9-4981-8d6a-0f4c1ee4be37" // just for now...
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
