import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unsaved-changes-prompt',
  templateUrl: './unsaved-changes-prompt.component.html',
  styleUrl: './unsaved-changes-prompt.component.scss'
})
export class UnsavedChangesPromptComponent {
  constructor(public activeModal: NgbActiveModal) { }

  confirm() {
    this.activeModal.close(true);
  }

  cancel() {
    this.activeModal.dismiss(false);
  }
}
