import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Article } from '../../../../interfaces/article';
import { Comment } from '../../../../interfaces/comment';
import { CommentsService } from '../../../../services/comments.service';

import { faComments, faMinusSquare, faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() article: Article | undefined;
  @Input() isLoggedIn: boolean = false;

  @ViewChild('content') content!: TemplateRef<any>; // This binds to the #content template ref
  showOffCanvasSubscription!: Subscription; // local subscription


  private offcanvasService = inject(NgbOffcanvas);
  closeResult = '';

  isCollapsed: boolean = false;

  // icons
  faComments = faComments;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  constructor(public router: Router,
    private commentsService: CommentsService) { }

  ngOnInit() {
    this.showOffCanvasSubscription = this.commentsService.showCommentsOffCanvas$
      .subscribe({
        next: result => {
          if (result) {
            this.openEnd(this.content);
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.showOffCanvasSubscription) {
      this.showOffCanvasSubscription.unsubscribe();
    }
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

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title', position: 'end', scroll: true }).result.then(
      (result) => {
        //this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
