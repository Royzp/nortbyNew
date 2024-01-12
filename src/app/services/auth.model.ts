import { IGeneralResponse } from './shared.model';

export interface ProfileType {
  usuario?: string,
  cuenta?: string,
}

export interface TokenModel {
  token?: string;
  refreshToken?: string;
  grabar?: string;
}

export interface ITokenResponse extends IGeneralResponse<TokenModel> {};

export const ADMINISTRADOR = 'A';
export const SUPERUSUARIO = 'S';
export const CUENTA = 'C';
