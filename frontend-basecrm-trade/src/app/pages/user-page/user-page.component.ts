import { Component } from '@angular/core';
import {UserService} from "../../services/user.service";
import {IUserData} from "../../interfaces/user";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent {

  users: IUserData[] = []

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.getAll()
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      data:  {title: 'Добавление', id: null},
      minWidth: '80%',
      minHeight: '80%',
      height: "80%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'ok') {
        setTimeout(() => this.getAll(), 500)
      }
    });
  }

  delete(id: number){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'yes') {
        this.userService.remove(id)
        setTimeout(() => this.getAll(), 500)
      }
    });
  }

  openEdit(id: number): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      data:  {title: 'Редоктирование', id: id},
      minWidth: '80%',
      minHeight: '80%',
      height: "80%",
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'ok') {
        setTimeout(() => this.getAll(), 500)
      }
    });
  }


  getAll(){
    this.userService.getAll().subscribe(res => {
      this.users = res.data
    })
  }
}
