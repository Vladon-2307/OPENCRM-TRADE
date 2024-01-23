import {Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IResponse} from "../interfaces/response";
import {ICounterparty, ICounterpartyEdit, IResCounterparty} from "../interfaces/counterparty";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CounterpartyService {

  editStatus = signal<number>(0)

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getAll(page: number, search: string) {
    return this.http.get<IResponse<IResCounterparty>>(`${environment.api}/api/counterparty`,{
      params: {
        page: page,
        search: search
      }
    })
  }

  getById(id: number) {
    return this.http.get<IResponse<ICounterparty>>(`${environment.api}/api/counterparty/${id.toString()}`)
  }

  update(id: number, data: ICounterpartyEdit) {
    return this.http.patch<IResponse<any>>(`${environment.api}/api/counterparty/${id.toString()}`, data).subscribe(value => {
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
      })
  }

  create(data: ICounterpartyEdit) {
    return this.http.post<IResponse<any>>(`${environment.api}/api/counterparty`, data).subscribe(value => {
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
      }
    )
  }

  remove(id: number) {
    return this.http.delete<IResponse<any>>(`${environment.api}/api/counterparty/${id.toString()}`).subscribe(value => {
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
