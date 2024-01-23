import {Component} from '@angular/core';
import {CounterpartyService} from "../../services/counterparty.service";
import {ICounterparty} from "../../interfaces/counterparty";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserEditComponent} from "../user-page/user-edit/user-edit.component";
import {CounterpartyEditComponent} from "./counterparty-edit/counterparty-edit.component";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-counterparty-page',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './counterparty-page.component.html',
  styleUrl: './counterparty-page.component.scss'
})
export class CounterpartyPageComponent {

  counterpartys: ICounterparty[]
  pages: number
  page: number = 1
  inpage: number | undefined = undefined

  searchForm = new FormGroup({
    search: new FormControl('')
  })

  toPage(){
    if(this.inpage != undefined){
      if(this.inpage >=1 && this.inpage <= this.pages){
        this.page= this.inpage
        this.getAll()
      }
      this.inpage = undefined
    }
  }

  constructor(
    private counterpartyService: CounterpartyService,
    public dialog: MatDialog
  ) {
    this.getAll()
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(CounterpartyEditComponent, {
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

  openEdit(id: number): void {
    const dialogRef = this.dialog.open(CounterpartyEditComponent, {
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

  delete(id: number){
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'yes') {
        this.counterpartyService.remove(id)
        setTimeout(() => this.getAll(), 500)
      }
    });
  }

  predPage(){
    if(this.page == 1){
      return
    }
    this.page -= 1
    this.getAll()
  }

  nextPage(){
    if(this.page == this.pages){
      return
    }
    this.page += 1
    this.getAll()
  }

  getAll(){
    let searchData = this.searchForm.value.search
    if(searchData == null){
      searchData = ''
    }
    this.counterpartyService.getAll(this.page, searchData).subscribe(value => {
      this.counterpartys = value.data.data
      this.pages = Math.ceil(value.data.count / 10)
    })
  }
}
