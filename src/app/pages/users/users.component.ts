import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'app/services/auth.service';
import {
  ICuentaSucursal,
  ICuentaSucursalAliasRequest,
} from 'app/services/sucursales.model';
import { IUserRol } from 'app/services/user.model';
import { UsersService } from 'app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, finalize, Observable, Subject } from 'rxjs';
import { UserDeleteModalComponent } from './user-delete-modal/user-delete-modal.component';
import { UserModalComponent } from './user-modal/user-modal.component';

@Component({
  selector: 'app-page-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  message: string;
  usuarios: Array<IUserRol> = [];
  usuariosDataSource: Array<IUserRol> = [];
  loadingUsuarios$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  pageSizeOptions = [10, 25];
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  constructor(
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  ngOnInit() {
    this.getListUsers();
  }

  getListUsers(): void {
    this.loadingUsuarios$.next(true);
    this.usersService.getUsers().subscribe({
      next: (response) => {
      console.log(response);
        this.usuariosDataSource = response || [];
        this.totalSize = this.usuariosDataSource.length;
        this.iterator();
      },
      error: () => {
        this.usuariosDataSource = [];
        this.iterator();
      },
      complete: () => this.loadingUsuarios$.next(false),
    });
  }

  openDialogAgregar(): void {
  
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '450px',
      data: { isNew: true },
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        const errorRegister = () => {
          this.snackBar.open(
            'Ocurrio un error al registrar usuario, si el error persiste comuniquese con su administrador.',
            'x',
            { duration: 15000, panelClass: ['error-snackbar'] }
          );
          this.spinner.hide()
        }
        this.message = 'Grabando';
        this.spinner.show();
        const body: IUserRol = {
          userName: result.userName,
          userLogin: result.userLogin,
          accountNumber: result.accountNumber,
          grabar: result.grabar,
          rolAssigned: result.rolAssigned,
          userStatus: result.userStatus
        };
        this.usersService.saveUser(body).subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.getListUsers();
              this.snackBar.open('Se registro al usuario', 'x', {
                duration: 15000,
                panelClass: ['success-snackbar'],
              });
            } else {
              errorRegister();
            }
          },
          error: errorRegister,
          complete: () => this.spinner.hide(),
        });
      }
    });
  }

  openDialog(user: IUserRol): void {
    const dataUser = JSON.parse(JSON.stringify(user));
    console.log(user);
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '450px',
      data: { user: dataUser },
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        const errorRegister = () => {
          this.snackBar.open(
            'Ocurrio un error al actualizar estado de usuario, si el error persiste comuniquese con su administrador.',
            'x',
            { duration: 15000, panelClass: ['error-snackbar'] }
          );
          this.spinner.hide();
        };
        this.message = 'Actualizando';
        this.spinner.show();
        const body: IUserRol = {
          id: result.id,
          userStatus: result.userStatus,
          grabar: result.grabar
        };
        this.usersService.saveStatusUser(body).subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.getListUsers();
              this.snackBar.open('Se actualizo estado del usuario', 'x', {
                duration: 15000,
                panelClass: ['success-snackbar'],
              });
            } else {
              errorRegister();
            }
          },
          error: errorRegister,
          complete: () => this.spinner.hide(),
        });
      }
    });
  }

  openDialogEliminar(user: IUserRol): void {
    const dataUser = JSON.parse(JSON.stringify(user));
    const dialogRef = this.dialog.open(UserDeleteModalComponent, {
      width: '450px',
      data: dataUser,
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        const errorRegister = (err?) => {
          console.log(err)
          this.snackBar.open(
            'Ocurrio un error al eliminar usuario, si el error persiste comuniquese con su administrador.',
            'x',
            { duration: 15000, panelClass: ['error-snackbar'] }
          );
          this.spinner.hide();
        };
        this.message = 'Eliminando';
        this.spinner.show();
        this.usersService.deleteUser(result).subscribe({
          next: (response) => {
            console.log(response)
            if (response.status === 200) {
              this.getListUsers();
              this.snackBar.open('Se eliminó el usuario', 'x', {
                duration: 15000,
                panelClass: ['success-snackbar'],
              });
            } else {
              errorRegister();
            }
          },
          error: errorRegister,
          complete: () => this.spinner.hide(),
        });
      }
    });
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.usuariosDataSource.slice(start, end);
    this.usuarios = part;
  }
}
