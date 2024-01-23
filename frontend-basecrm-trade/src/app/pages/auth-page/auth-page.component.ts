import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  authForm: FormGroup = new FormGroup({
    login: new FormControl('admin', [Validators.required]),
    password: new FormControl('admin', [Validators.required])
  })

  constructor(private authService: AuthService) {
  }

  isInvalidLogin(): boolean{
    return (this.authForm.controls['login'].getError('required') && this.authForm.controls['login'].touched)
  }

  isInvalidPassword(): boolean{
    return (this.authForm.controls['password'].getError('required') && this.authForm.controls['password'].touched)
  }

  submit() {
    if(this.authForm.valid){
      this.authService.login(this.authForm.value)
    }
  }
}
