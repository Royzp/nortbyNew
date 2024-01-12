import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ApiService } from './api/api.service';
import { CuentaSucursalResponse, ICuentaSucursalAliasRequest } from './sucursales.model';
import { IGeneralResponse } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class SucursalesService {
  private urlBase: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/sucursales`;
  }

  getSucursales(cuenta: string): Observable<CuentaSucursalResponse> {
    return this.apiService.get(`${this.urlBase}/{cuenta}`, { params: { cuenta } });
  }

  ActualizarAlias(body: ICuentaSucursalAliasRequest): Observable<IGeneralResponse<boolean>> {
    return this.apiService.post(`${this.urlBase}`, body);
  }
}
