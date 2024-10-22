import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate';
import { UnsavedChangesPromptComponent } from '../components/unsaved-changes-prompt/unsaved-changes-prompt.component'; 

@Injectable({
  providedIn: 'root'
})

// used by the router to allow / halt navigation away from a component.
//
// guard must implement angular CanDeactivate interface.
//
// the CanComponentDeactivate - even though it's really only for the component,
// we must expost it here so the guard can see the component's canDeactivate and editFinished methods.
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private modalService: NgbModal) { }

  canDeactivate(component: CanComponentDeactivate): Promise<boolean> | boolean {
    if (component.canDeactivate && !component.canDeactivate()) {

      // open ngb modal if !canDeactivate (usually form.dirty and editor mode)
      return this.modalService
        .open(UnsavedChangesPromptComponent)
        .result
        .then(
          (result) => {
            // if result, checks if editFinished method exists on the component and calls the method if it does
            if (result && component.editFinished) {
              component.editFinished();
            }

            // this gets returned to the route and allows the router to navigate away from the component - or stay put if the user chooses "stay"
            return result;
          }
        )
        .catch(
          () => false
        );
    }

    // if we get here: there were no unsaved changes and the modal didn't open
    // check if the component has editFinished() and if it does
    // call it in the component
    if (component.editFinished) {
      component.editFinished();
    }
    // this gets returned to the route and allows the router to navigate away from the component
    return true;
  }
}
