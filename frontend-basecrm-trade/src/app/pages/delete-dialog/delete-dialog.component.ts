import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
  ) {
  }

  ok(){
    this.dialogRef.close('yes')
  }

  close(){
    this.dialogRef.close()
  }
}
