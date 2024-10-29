import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate';
import { UnsavedChangesPromptComponent } from '../components/unsaved-changes-prompt/unsaved-changes-prompt.component';
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AccountsService } from '../services/account/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  isLoggedIn$ = this.accountsService.validateToken$;

  constructor(
    private modalService: NgbModal,
    private accountsService: AccountsService
  ) { }

  canDeactivate(component: CanComponentDeactivate): Observable<boolean> {
    return this.isLoggedIn$
      .pipe(
        mergeMap(
          (loggedInResult: boolean) => {
            if (loggedInResult) {
              if (component.canDeactivate && !component.canDeactivate()) {

                // open modal and return the result as an observable
                const modalResult$ = from(this.modalService.open(UnsavedChangesPromptComponent).result)
                  .pipe(
                    map(
                      (result: boolean) => {
                        if (result && component.editFinished) {
                          component.editFinished();
                        }
                        return result;
                      }),

                    catchError(
                      // when user clicks away / hits escape, bypassing confirmation
                      () => of(false)
                    )
                  );

                return modalResult$;
              }
            }

            // if the user is not logged in
            return of(true); 
          }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          // deactivate if error
          return of(true); 
        })
      );
  }
}
