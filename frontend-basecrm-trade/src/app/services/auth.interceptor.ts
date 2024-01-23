import {Injectable} from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {ToastrService} from "ngx-toastr";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    if(token != null){
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }


    return next.handle(req).pipe(
      catchError(err => {
        if(err.error.status == 401){
          this.authService.logout()
          this.toastr.error(err.error.message, "Ошибка")
        }
        if(err.error.status == 403){
          this.router.navigateByUrl('')
          this.toastr.error(err.error.message, "Ошибка")
        }
        if(err.error.status == 500){
          this.toastr.error(err.error.message, "Ошибка")
        }
        return throwError(err.error);
      })

    );
  }
}
