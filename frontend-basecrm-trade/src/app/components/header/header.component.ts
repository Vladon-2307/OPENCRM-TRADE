import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatIconModule} from '@angular/material/icon';
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private authService: AuthService
  ) {
  }

  isAdmin():boolean{
    return this.authService.auth()?.role == "ADMIN"
  }

  logout(){
    this.authService.logout()
  }
}
