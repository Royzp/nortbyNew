import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ApiService } from './api/api.service';
import { IUserRol, UserRolResponse } from './user.model';
import { IGeneralResponse } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlBase: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/userrol`;
  }

  getUsers(): Observable<UserRolResponse> {
    return this.apiService.get(`${this.urlBase}`);
  }

  saveUser(user: IUserRol): Observable<IGeneralResponse<boolean>> {
    return this.apiService.post(`${this.urlBase}`, user);
  }

  saveStatusUser(user: IUserRol): Observable<IGeneralResponse<boolean>> {
    return this.apiService.post(`${this.urlBase}/{id}`, user, { params: { id: user.id, status: user.userStatus, grabar: user.grabar } });
  }

  deleteUser(user: IUserRol): Observable<IGeneralResponse<boolean>> {
    return this.apiService.delete(`${this.urlBase}/{id}`, { params: { id: user.id } });
  }
}
