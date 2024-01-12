import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api/api.service';
import { ProfileType, ITokenResponse, TokenModel, ADMINISTRADOR, SUPERUSUARIO, CUENTA } from './auth.model';
import jwt_decode from 'jwt-decode';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private profile: ProfileType = {};
  private profileSub$: Subject<ProfileType> = new Subject<ProfileType>();
  private urlBase: string;
  private token: string;
  private tokenSub$: BehaviorSubject<string> = new BehaviorSubject<string>(
    `${localStorage.getItem('tokenJlr')}`
  );
  Grabar: string;
  constructor(private apiService: ApiService) {
    this.urlBase = `${environment.baseUrl}/api/auth`;
    this.token = `${localStorage.getItem('tokenJlr')}`;
  }

  getProfileSub(): Subject<ProfileType> {
    return this.profileSub$;
  }

  getProfile(): ProfileType {
    return this.profile;
  }

  setProfile(profile: ProfileType): void {
    this.profile = profile;
    this.profileSub$.next(profile);
  }

  getTokenJlr(body: { user: string, password: string }): Observable<ITokenResponse> {
    return this.apiService.post(`${this.urlBase}/token`, body);
  }

  refreshTokenJlr(): Observable<any> {
    const item = {
      accessToken: localStorage.getItem('tokenJlr'),
      refreshToken: localStorage.getItem('refreshTokenJlr'),
      Grabar: localStorage.getItem('Grabar'),
    };
    const urlBuilder = `${this.urlBase}/refresh-token`;
    return this.apiService.post(urlBuilder, item);
  }

  setTokenJrl(token?: TokenModel): void {
    localStorage.setItem('tokenJlr', `${token?.token}`);
    localStorage.setItem('refreshTokenJlr', `${token?.refreshToken}`);
    localStorage.setItem('grabar', `${token?.grabar}`);
   
    this.token = `${token?.token}`;
    this.Grabar = `${token?.grabar}`;
    this.tokenSub$.next(this.token);
  }

  getTokenSub(): Subject<string> {
    return this.tokenSub$;
  }

  getToken(): string {
    return this.token;
  }

  getExpiredDate(): Date {
    const date = this.getDecodedAccessToken(this.token)['exp'];
    return new Date(date * 1000);
  }

  getUsuario(): string {
    return `${this.getDecodedAccessToken(this.token)['user']}`;
  }

  getCuenta(): string {
    return `${this.getDecodedAccessToken(this.token)['account']}`;
  }

  getRole(): string {
    return `${this.getDecodedAccessToken(this.token)['role']}`;
  }

  isAdmin(): boolean {
    return this.getRole() === ADMINISTRADOR;
  }

  isSuper(): boolean {
    return this.getRole() === SUPERUSUARIO;
  }

  isCuenta(): boolean {
    return this.getRole() === CUENTA;
  }

  isExpired(): boolean {
    if (!this.token) { return true; }
    const date = this.getDecodedAccessToken(this.token)['exp'];
    if (!date) { return true; }
    return new Date().getTime() > new Date(date * 1000).getTime();
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token) || {};
    } catch (Error) {
      return {};
    }
  }

  logout(): void {
    localStorage.removeItem('tokenJlr');
    localStorage.removeItem('refreshTokenJlr');
    this.token = ``;
    this.tokenSub$.next(this.token);
  }
}
