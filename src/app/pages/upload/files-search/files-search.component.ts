import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { FilesResponse } from 'app/services/archivo.model';
import { ArchivoService } from 'app/services/archivo.service';
import { AuthService } from 'app/services/auth.service';
import { ICuenta } from 'app/services/cuentas.model';
import { CuentasService } from 'app/services/cuentas.service';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'app-files-search',
  templateUrl: './files-search.component.html',
  styleUrls: ['./files-search.component.css'],
  providers: [DatePipe],
})
export class FilesSearchComponent implements OnInit {
  @Input() type: string;
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
  loadingSearchj$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  pageSize = 10;
  pageSizeOptions = [10, 25];
  currentPage = 0;
  totalSize = 0;

  constructor(
    private authService: AuthService,
    private archivoService: ArchivoService,
    private cuentasService: CuentasService,
    private datePipe: DatePipe,
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
    const fechaInicial = this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd');
    const fechaFinal = this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd');
    this.totalSize = 0;
    this.files = [];
    this.filesDataSource = [];
    this.loadingSearchj$.next(true);
    this.archivoService
      .Search({ tipo:  this.type, cuenta: this.account.value, fechaInicial, fechaFinal })
      .subscribe({
        next: (response) => { this.filesDataSource = response; this.totalSize = response.length; this.iterator(); },
        complete: () => (this.loadingSearchj$.next(false))
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
