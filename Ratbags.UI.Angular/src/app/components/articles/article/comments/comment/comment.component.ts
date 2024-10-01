import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { switchMap, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Article } from '../../../../../interfaces/article';
import { Comment } from '../../../../../interfaces/comment';
import { ComemntsService } from '../../../../../services/comments-service';

// icons
import { faComment, faCommentAlt, faComments, faMinusSquare, faPlusSquare } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {
  @Input() article: Article | undefined;
  @Output() getComments = new EventEmitter<void>();
  form?: FormGroup;
  
  // icons
  faCommentAlt = faCommentAlt;

  constructor(private formBuilder: FormBuilder,
              private commentsService: ComemntsService) { }

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    if (this.article && this.article.id.length > 0) {
      this.form = this.formBuilder.group({
        articleId: [this.article?.id],
        name: [''],
        comment: ['']
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
          result => {
            this.getComments.emit();
          },
          error => {
            console.error('error adding comment:', error);
          }
        );
    }
  }
}
