import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { CuentaResponse, ICuenta } from 'app/services/cuentas.model';
import { CuentasService } from 'app/services/cuentas.service';
import {
  CuentaSucursalResponse,
  ICuentaSucursal,
} from 'app/services/sucursales.model';
import { SucursalesService } from 'app/services/sucursales.service';
import { BehaviorSubject, finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-page-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  usuario: string;
  cuenta: string;
  cuentaSeleccionada: string;
  cuentas: Array<ICuenta> = [];
  cuentasDataSource: Array<ICuenta> = [];
  sucursales: Array<ICuentaSucursal> = [];
  sucursalesDataSource: Array<ICuentaSucursal> = [];
  loadingCuentas$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  loadingSucursales$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  pageSizeOptions = [10, 25];
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;
  pageSizeCuenta = 10;
  currentPageCuenta = 0;
  totalSizeCuenta = 0;


  constructor(
    private authService: AuthService,
    private sucursalesService: SucursalesService,
    private cuentasService: CuentasService
  ) {
    this.usuario = this.authService.getUsuario();
    this.cuenta = this.authService.getCuenta();
  }

  ngOnInit() {
    this.getListCuentas();
  }

  seleccionarCuenta(cuenta: string) {
    this.totalSize = 0;
    this.sucursales = [];
    this.sucursalesDataSource = [];
    this.cuentaSeleccionada = cuenta;
    this.getListSucursales();
  }

  getListCuentas(): void {
    this.loadingCuentas$.next(true);
    const setCuentas = (response: any) => {
      this.cuentasDataSource = response;
      this.totalSizeCuenta = this.cuentasDataSource.length;
      this.iteratorCuenta();
    };
    const pipeFinalize = () => {
      this.seleccionarCuenta(this.cuentas[0]?.cliente);
      this.loadingCuentas$.next(false);
    };
    if (this.authService.isCuenta()) {
      this.cuentasService.getCuentas(this.cuenta).pipe(finalize(pipeFinalize)).subscribe(setCuentas);
    } else {
      this.cuentasService.getAllCuentas().pipe(finalize(pipeFinalize)).subscribe(setCuentas);
    }
  }

  getListSucursales(): void {
    if (!!this.cuentaSeleccionada) {
      this.loadingSucursales$.next(true);
      this.sucursalesService.getSucursales(this.cuentaSeleccionada).subscribe({
        next: (response) => {
          this.sucursalesDataSource = response || [];
          this.totalSize = this.sucursalesDataSource.length;
          this.iterator();
        },
        error: () => {
          this.sucursalesDataSource = [];
          this.iterator();
        },
        complete: () => this.loadingSucursales$.next(false),
      });
    } else {
      this.sucursales = [];
      this.sucursalesDataSource = [];
    }
  }

  handlePage(e: any) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.iterator();
  }

  handlePageCuenta(e: any) {
    this.currentPageCuenta = e.pageIndex;
    this.pageSizeCuenta = e.pageSize;
    this.iteratorCuenta();
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.sucursalesDataSource.slice(start, end);
    this.sucursales = part;
  }

  private iteratorCuenta() {
    const end = (this.currentPageCuenta + 1) * this.pageSizeCuenta;
    const start = this.currentPageCuenta * this.pageSizeCuenta;
    const part = this.cuentasDataSource.slice(start, end);
    this.cuentas = part;
  }
}
