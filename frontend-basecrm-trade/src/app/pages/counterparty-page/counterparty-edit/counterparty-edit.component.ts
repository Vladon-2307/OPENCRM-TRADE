import {Component, Inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CounterpartyService} from "../../../services/counterparty.service";
import {ICounterpartyEdit} from "../../../interfaces/counterparty";

@Component({
  selector: 'app-counterparty-edit',
  standalone: true,
    imports: [
        MatIcon,
        ReactiveFormsModule
    ],
  templateUrl: './counterparty-edit.component.html',
  styleUrl: './counterparty-edit.component.scss'
})
export class CounterpartyEditComponent {

  form: FormGroup
  id: number

  constructor(
    private dialogRef: MatDialogRef<CounterpartyEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, id: number | null},
    private counterpartyService: CounterpartyService,
  ) {
    if(data.title == 'Добавление'){
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        account_number: new FormControl(''),
        bank_name: new FormControl(''),
        code_bank: new FormControl(''),
        legal_address: new FormControl('', [Validators.required]),
        mailing_address: new FormControl('', [Validators.required]),
        phone: new FormControl('', [Validators.required]),
        unn: new FormControl(''),
        okpo: new FormControl('')
      })
    }
    if(data.title == 'Редоктирование'){
      if(data.id != null){
        this.id = data.id
      }
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        account_number: new FormControl(''),
        bank_name: new FormControl(''),
        code_bank: new FormControl(''),
        legal_address: new FormControl('', ),
        mailing_address: new FormControl('', ),
        phone: new FormControl('', ),
        unn: new FormControl(''),
        okpo: new FormControl('')
      })
      this.counterpartyService.getById(this.id).subscribe(value => {
        this.form.controls['name'].setValue(value.data.name)
        this.form.controls['account_number'].setValue(value.data.account_number)
        this.form.controls['bank_name'].setValue(value.data.bank_name)
        this.form.controls['code_bank'].setValue(value.data.code_bank)
        this.form.controls['legal_address'].setValue(value.data.legal_address)
        this.form.controls['mailing_address'].setValue(value.data.mailing_address)
        this.form.controls['phone'].setValue(value.data.phone)
        this.form.controls['unn'].setValue(value.data.unn)
        this.form.controls['okpo'].setValue(value.data.okpo)
      })
    }
  }

  close(){
    this.dialogRef.close()
  }

  submit(){
    if(this.data.title == 'Добавление'){
      if(this.form.valid){
        this.counterpartyService.create(this.form.value)
        if(this.counterpartyService.editStatus() == 201){
          this.counterpartyService.editStatus.set(0)
          this.dialogRef.close('ok')
        }
      }
    }
    if(this.data.title == 'Редоктирование'){
      if(this.form.valid){
        let data: ICounterpartyEdit = {
          name: this.form.controls['name'].value
        }
        if(!!this.form.controls['account_number'].value){ data = {...data, account_number:this.form.controls['account_number'].value}}
        if(!!this.form.controls['bank_name'].value){ data = {...data, bank_name:this.form.controls['bank_name'].value}}
        if(!!this.form.controls['code_bank'].value){ data = {...data, code_bank:this.form.controls['code_bank'].value}}
        if(!!this.form.controls['legal_address'].value){ data = {...data, legal_address:this.form.controls['legal_address'].value}}
        if(!!this.form.controls['mailing_address'].value){ data = {...data, mailing_address:this.form.controls['mailing_address'].value}}
        if(!!this.form.controls['phone'].value){ data = {...data, phone:this.form.controls['phone'].value}}
        if(!!this.form.controls['unn'].value){ data = {...data, unn:this.form.controls['unn'].value}}
        if(!!this.form.controls['okpo'].value){ data = {...data, okpo:this.form.controls['okpo'].value}}
       this.counterpartyService.update(this.id, data)
        if(this.counterpartyService.editStatus() == 200){
          this.counterpartyService.editStatus.set(0)
          this.dialogRef.close('ok')
        }
      }
    }
  }
}
