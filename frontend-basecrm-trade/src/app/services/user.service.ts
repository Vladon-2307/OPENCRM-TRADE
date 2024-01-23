import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IResponse} from "../interfaces/response";
import {IUserData, IUserEdit} from "../interfaces/user";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  editStatus = signal<number>(0)

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getAll(){
    return this.http.get<IResponse<IUserData[]>>(`${environment.api}/api/user`)
  }

  getById(id: number) {
    return this.http.get<IResponse<IUserData>>(`${environment.api}/api/user/${id.toString()}`)
  }

  update(id: number, user: IUserEdit){
    return this.http.patch<IResponse<any>>(`${environment.api}/api/user/${id.toString()}`, user).subscribe(value => {
      if(value.status == 200){
        this.editStatus.set(200)
        this.toastr.success(value.message)
      }
    },
      error => {
        if(error.status == 400){
          this.editStatus.set(400)
          this.toastr.error(error.message)
        }
      }
    )
  }

  create(user: IUserEdit){
    return this.http.post<IResponse<any>>(`${environment.api}/api/user`, user).subscribe(value => {
      if(value.status == 201){
        this.editStatus.set(201)
        this.toastr.success(value.message)
      }
    },
      error => {
        if(error.status == 400){
          this.editStatus.set(400)
          this.toastr.error(error.message)
        }
      })
  }

  remove(id: number){
    return this.http.delete<IResponse<any>>(`${environment.api}/api/user/${id.toString()}`).subscribe(value => {
      if(value.status == 200){
        this.toastr.info(value.message)
      }
    },
      error => {
        if(error.status == 400){
          this.toastr.error(error.message)
        }
      })
  }
}
