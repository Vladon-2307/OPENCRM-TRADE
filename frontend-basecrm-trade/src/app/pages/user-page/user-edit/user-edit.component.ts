import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent {

  form: FormGroup
  id: number

  constructor(
    private dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, id: number | null},
    private userService: UserService
  ) {
    if(this.data.title == 'Добавление'){
      this.form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        role: new FormControl('USER', [Validators.required])
      })
    }
    if(this.data.title == 'Редоктирование'){
      this.form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', ),
        role: new FormControl('USER', [Validators.required])
      })
      if(data.id != null){
        this.id = data.id
        this.userService.getById(this.id).subscribe(value => {
          this.form.controls['login'].setValue(value.data.login)
          this.form.controls['role'].setValue(value.data.role)
        })
      }
    }
  }

  close(){
    this.dialogRef.close()
  }

  isInvalidLogin(): boolean{
    return (this.form.controls['login'].getError('required') && this.form.controls['login'].touched)
  }

  isInvalidPassword(): boolean{
    return (this.form.controls['password'].getError('required') && this.form.controls['password'].touched)
  }

  submit(){
    if(this.data.title == 'Добавление'){
      if(this.form.valid) {
        this.userService.create(this.form.value)
        if(this.userService.editStatus() == 201){
          this.userService.editStatus.set(0)
          this.dialogRef.close('ok')
        }
      }
    }
    if(this.data.title == 'Редоктирование'){
      if(this.form.valid){
        let data
        if(!this.form.value.password){
          data = {
            login: this.form.value.login,
            role: this.form.value.role
          }
        }else{
          data = this.form.value
        }
        this.userService.update(this.id, data)
        if(this.userService.editStatus() == 200){
          this.userService.editStatus.set(0)
          this.dialogRef.close('ok')
        }
      }
    }
  }
}
