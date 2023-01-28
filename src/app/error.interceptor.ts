import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwToolbarMixedModesError } from "@angular/material/toolbar";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(public dialog: MatDialog){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occured!";
        if (error.error.message){
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        return throwError(() => new HttpErrorResponse(error));
      })
    );

  }
}
