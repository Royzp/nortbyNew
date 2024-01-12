import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ApiService } from './api/api.service';
import { CuentaResponse } from './cuentas.model';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  private urlBase: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/cuentas`;
  }

  getCuentas(cuenta: string): Observable<CuentaResponse> {
    return this.apiService.get(`${this.urlBase}/{cuenta}`, { params: { cuenta } });
  }

  getAllCuentas(): Observable<CuentaResponse> {
    return this.apiService.get(`${this.urlBase}`);
  }
}
