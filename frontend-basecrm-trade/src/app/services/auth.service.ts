import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IAuthData, IAuthResponse} from "../interfaces/auth";
import {IResponse} from "../interfaces/response";
import {environment} from "../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import {IUserData} from "../interfaces/user";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = signal<IUserData | null>(null)

  constructor(
    private http: HttpClient,
    private jwt: JwtHelperService,
    private router: Router,
    private toastr: ToastrService
  ) {
    const token = localStorage.getItem('token')
    if(token != null){
      const decodeToken = this.jwt.decodeToken(token)
      this.auth.set({
        id: decodeToken.id,
        login: decodeToken.login,
        role: decodeToken.role
      })
    }else {
      this.router.navigateByUrl('auth')
    }
  }

  logout(){
    localStorage.removeItem('token')
    this.auth.set(null)
    this.router.navigateByUrl('auth')
  }

  login(authData: IAuthData){
    return this.http.post<IResponse<IAuthResponse>>(`${environment.api}/api/auth/sign-in`, authData).subscribe(
      res => {
        if(res.status == 200){
          localStorage.setItem('token', res.data.token)
          const decodeToken = this.jwt.decodeToken(res.data.token)
          this.auth.set({
            id: decodeToken.id,
            login: decodeToken.login,
            role: decodeToken.role
          })
          this.router.navigateByUrl('')
        }else {
          this.toastr.error(res.message, "Ошибка")
        }
      }
    )
  }
}
