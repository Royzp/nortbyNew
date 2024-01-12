import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilesResponse } from 'app/services/archivo.model';
import { ArchivoService } from 'app/services/archivo.service';
import { AuthService } from 'app/services/auth.service';
import { ICuenta } from 'app/services/cuentas.model';
import { CuentasService } from 'app/services/cuentas.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css'],
  providers: [DatePipe],
})
export class MaintenanceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cuenta: string;
  cuentaSeleccionada: string;
  endDate = new FormControl();
  startDate = new FormControl();
  account = new FormControl();
  cuentas: Array<ICuenta> = [];
  files: FilesResponse = [];
  filesDataSource: FilesResponse = [];
  optionsCuentas: Array<{ value: string; viewValue: string }> = [];
  loadingSearchj$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  pageSize = 10;
  pageSizeOptions = [10, 25];
  currentPage = 0;
  totalSize = 0;

  constructor(
    private authService: AuthService,
    private archivoService: ArchivoService,
    private cuentasService: CuentasService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    const toDay = new Date();
    const month = toDay.getMonth();
    this.startDate.setValue(new Date(toDay.getFullYear(), month - 2, 1));
    this.endDate.setValue(new Date(toDay.getFullYear(), month + 1, 0));
  }

  ngOnInit() {
    this.cuenta = this.authService.getCuenta();
    this.getListCuentas();
    this.search();
  }

  getListCuentas(): void {
    this.cuentasService
      .getCuentas(this.cuenta)
      .pipe(
        finalize(() => {
          this.optionsCuentas = this.cuentas.map((c) => ({
            value: c.cliente,
            viewValue: c.cliente,
          }));
        })
      )
      .subscribe((response) => (this.cuentas = response));
  }

  search(): void {
    const fechaInicial = this.datePipe.transform(
      this.startDate.value,
      'yyyy-MM-dd'
    );
    const fechaFinal = this.datePipe.transform(
      this.endDate.value,
      'yyyy-MM-dd'
    );
    this.currentPage = 0;
    this.totalSize = 0;
    this.files = [];
    this.filesDataSource = [];
    this.loadingSearchj$.next(true);
    this.archivoService
      .Search({ cuenta: this.account.value, fechaInicial, fechaFinal })
      .subscribe({
        next: (response) => {
          this.filesDataSource = response;
          this.totalSize = response.length;
          this.iterator();
        },
        complete: () => this.loadingSearchj$.next(false),
      });
  }

  getTipo(tipo: string): string {
    let result = '';
    switch (tipo) {
      case 'VE':
        result = 'Venta';
        break;
      case 'IN':
        result = 'Inventario';
        break;
      case 'SI':
        result = '';
        break;
      case 'FA':
        result = 'Facturación';
        break;
      case 'TR':
        result = 'Tráfico';
        break;
      case 'PC':
        result = '';
        break;
      default:
        break;
    }

    return result;
  }

  dateValid(fecha: Date): boolean {
    const now = new Date();
    const diff = now.valueOf() - new Date(fecha).valueOf();
    return Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24)) <= 2;
  }

  deleteFile(sec: number): void {
    const error = () => {
      this.snackBar.open(
        'Ocurrio un error al eliminar el archivo, si el error persiste comuniquese con su administrador.',
        'x',
        { duration: 15000, panelClass: ['error-snackbar'] }
      );
      this.spinner.hide();
    };
    this.spinner.show();
    this.archivoService.deleteFile(sec).subscribe({
      next: (response) => {
        this.spinner.hide();
        if (response.status === 200) {
          this.snackBar.open(
            'No se encontraron errores, los datos fueron enviados.',
            'x',
            { duration: 15000, panelClass: ['success-snackbar'] }
          );
          this.search();
        } else {
          if (response.status === 400) {
            this.snackBar.open(response.message, 'x', {
              duration: 15000,
              panelClass: ['error-snackbar'],
            });
          } else {
            error();
          }
        }
      },
      error: () => error(),
      complete: () => this.spinner.hide(),
    });
  }

  public handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.filesDataSource.slice(start, end);
    this.files = part;
  }
}
