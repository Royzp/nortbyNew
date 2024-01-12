import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { IUserRol } from 'app/services/user.model';

export interface DialogDataUser {
  isNew: boolean;
  user: IUserRol;
}

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent {
  user: IUserRol;
  optionsRoles: Array<{ value: string; viewValue: string }> = [];
  optionsStatus: Array<{ value: string; viewValue: string }> = [];
  optionsGrabar: Array<{ value: string; viewValue: string }> = [];
  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataUser,
  ) {

    this.user = data.user || {};

    this.optionsRoles = [
      { value: 'C', viewValue: 'Cuenta' },
      { value: 'S', viewValue: 'Super Usuario' },
      { value: 'A', viewValue: 'Administrador' }
    ];  
    this.optionsGrabar = [ 
      { value: 'S', viewValue: 'Semanal' },
      { value: 'M', viewValue: 'Mensual' }
    ];

    this.optionsStatus = [
      { value: 'A', viewValue: 'Activo' },
      { value: 'I', viewValue: 'Inactivo' },
    ];

  }

  onSaveClick(): void {
    this.dialogRef.close(this.user);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
