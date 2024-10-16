import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

export abstract class BaseService {
  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);

    let errorMessage = 'Something went wrong. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
