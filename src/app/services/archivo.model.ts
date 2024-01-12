import { IGeneralResponse } from './shared.model';

export interface IArchivoResponse {
  name?: string;
}

export interface UploadFileModel {
  fechaInicial: string;
  fechaFinal: string;
  cuenta: string;
}

export interface ISearchRetailVentasArchRequest {
  tipo?: string;
  fechaInicial?: string;
  fechaFinal?: string;
  cuenta?: string;
  limit?: number;
}

export interface IUploadFile {
  id: number;
  secuencia: number;
  sucursal: string;
  archivo: string;
  titulo: string;
  fechaCargaInicial: string;
  fechaCargaFinal: string;
  tipoCarga: string;
  usuario: string;
  fechaCarga: string;
  unidades: number;
  registros: number;
  ventas: number;
}

export interface IErrorUploadFile {
  fila: number;
  errores: Array<string>;
}

export type FilesResponse = Array<IUploadFile>;
export type UploadFile = IUploadFile & { errores?: Array<IErrorUploadFile> } & { headerErrores?: Array<string> };
export type UploadFileResponse = IGeneralResponse<UploadFile>;
